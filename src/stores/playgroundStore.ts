import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Connection } from '@vue-flow/core'
import type { ModuleNode, ModuleEdge, ModuleType, TransportState, ModuleNodeData, SynthNodeData, DrumGridNodeData } from '@/types'
import { audioEngine } from '@/audio/AudioEngine'
import { DEFAULT_SYNTH_PATTERN, DEFAULT_DRUM_TRACKS } from '@/types/definitions'

let moduleCounter = 0

function nextId() {
  return `module-${++moduleCounter}`
}

function createDefaultData(type: ModuleType): ModuleNodeData {
  switch (type) {
    case 'synth':
      return {
        type: 'synth',
        label: 'Synth',
        waveform: 'sawtooth',
        attack: 0.01,
        decay: 0.2,
        sustain: 0.5,
        release: 0.8,
        pattern: [...DEFAULT_SYNTH_PATTERN],
      }
    case 'drumGrid':
      return {
        type: 'drumGrid',
        label: 'Drum Grid',
        tracks: DEFAULT_DRUM_TRACKS.map((t) => ({ name: t.name, steps: [...t.steps] })),
      }
    case 'delay':
      return {
        type: 'delay',
        label: 'Delay',
        delayTime: 0.3,
        feedback: 0.4,
        wet: 0.5,
      }
    case 'filter':
      return {
        type: 'filter',
        label: 'Filter',
        frequency: 1000,
        resonance: 1,
        filterType: 'lowpass',
      }
    case 'oscilloscope':
      return {
        type: 'oscilloscope',
        label: 'Oscilloscope',
        fftSize: 1024,
      }
    case 'output':
      return {
        type: 'output',
        label: 'Output',
        volume: -6,
      }
  }
}

export const usePlaygroundStore = defineStore('playground', () => {
  const nodes = ref<ModuleNode[]>([])
  const edges = ref<ModuleEdge[]>([])
  const transport = ref<TransportState>({ bpm: 120, playing: false })
  const audioStarted = ref(false)

  const isPlaying = computed(() => transport.value.playing)

  function addModule(type: ModuleType, position: { x: number; y: number }): string {
    const id = nextId()
    const data = createDefaultData(type)

    nodes.value.push({
      id,
      type: type,
      position: { ...position },
      data,
    })

    if (audioStarted.value) {
      audioEngine.createModule(id, type, data)
    }

    return id
  }

  function removeModule(id: string) {
    // Remove all connected edges first
    const connectedEdges = edges.value.filter((e) => e.source === id || e.target === id)
    connectedEdges.forEach((e) => {
      audioEngine.disconnect(e.source, e.target)
    })
    edges.value = edges.value.filter((e) => e.source !== id && e.target !== id)

    // Remove the node
    nodes.value = nodes.value.filter((n) => n.id !== id)
    audioEngine.destroyModule(id)
  }

  function connectModules(connection: Connection) {
    const edgeId = `e-${connection.source}-${connection.target}`

    // Prevent duplicate edges
    if (edges.value.some((e) => e.id === edgeId)) return

    edges.value.push({
      id: edgeId,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      animated: true,
    })

    audioEngine.connect(connection.source, connection.target)
  }

  function disconnectModules(edgeId: string) {
    const edge = edges.value.find((e) => e.id === edgeId)
    if (!edge) return

    audioEngine.disconnect(edge.source, edge.target)
    edges.value = edges.value.filter((e) => e.id !== edgeId)
  }

  function updateModuleParam(id: string, param: string, value: number | string) {
    const node = nodes.value.find((n) => n.id === id)
    if (!node) return

    ;(node.data as Record<string, unknown>)[param] = value
    audioEngine.updateParam(id, param, value)
  }

  function updateSynthPattern(id: string, pattern: (string | null)[]) {
    const node = nodes.value.find((n) => n.id === id)
    if (!node || node.data.type !== 'synth') return

    ;(node.data as SynthNodeData).pattern = pattern
    audioEngine.updateSynthPattern(id, pattern)
  }

  function updateDrumStep(id: string, trackIndex: number, stepIndex: number, value: boolean) {
    const node = nodes.value.find((n) => n.id === id)
    if (!node || node.data.type !== 'drumGrid') return

    const data = node.data as DrumGridNodeData
    data.tracks[trackIndex].steps[stepIndex] = value
    audioEngine.updateDrumPattern(id, trackIndex, data.tracks[trackIndex].steps)
  }

  async function startAudio() {
    if (audioStarted.value) return
    await audioEngine.init()
    audioStarted.value = true

    // Create audio nodes for all existing modules
    nodes.value.forEach((node) => {
      audioEngine.createModule(node.id, node.data.type, node.data)
    })

    // Rebuild connections
    edges.value.forEach((edge) => {
      audioEngine.connect(edge.source, edge.target)
    })

    audioEngine.setBpm(transport.value.bpm)
  }

  function togglePlay() {
    if (transport.value.playing) {
      audioEngine.stopTransport()
      transport.value.playing = false
    } else {
      audioEngine.startTransport()
      transport.value.playing = true
    }
  }

  function setBpm(bpm: number) {
    transport.value.bpm = bpm
    audioEngine.setBpm(bpm)
  }

  function loadState(state: { nodes: ModuleNode[]; edges: ModuleEdge[]; transport: TransportState }) {
    // Dispose existing
    audioEngine.dispose()

    nodes.value = state.nodes
    edges.value = state.edges
    transport.value = state.transport

    // Reset counter to avoid collisions
    const maxId = state.nodes.reduce((max, n) => {
      const num = parseInt(n.id.replace('module-', ''), 10)
      return isNaN(num) ? max : Math.max(max, num)
    }, 0)
    moduleCounter = maxId

    if (audioStarted.value) {
      nodes.value.forEach((node) => {
        audioEngine.createModule(node.id, node.data.type, node.data)
      })
      edges.value.forEach((edge) => {
        audioEngine.connect(edge.source, edge.target)
      })
      audioEngine.setBpm(transport.value.bpm)
    }
  }

  return {
    nodes,
    edges,
    transport,
    audioStarted,
    isPlaying,
    addModule,
    removeModule,
    connectModules,
    disconnectModules,
    updateModuleParam,
    updateSynthPattern,
    updateDrumStep,
    startAudio,
    togglePlay,
    setBpm,
    loadState,
  }
})
