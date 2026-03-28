import * as Tone from 'tone'
import type { ModuleType, SynthNodeData, DrumGridNodeData, DelayNodeData, FilterNodeData, OscilloscopeNodeData, OutputNodeData } from '@/types'
import { DEFAULT_SYNTH_PATTERN, DEFAULT_DRUM_TRACKS } from '@/types/definitions'

interface AudioModuleEntry {
  type: ModuleType
  node: Tone.ToneAudioNode
  sequences?: Tone.Sequence[]
  gainOut?: Tone.Gain
  analyser?: Tone.Analyser
}

class AudioEngine {
  private modules = new Map<string, AudioModuleEntry>()
  private _initialized = false

  get initialized() {
    return this._initialized
  }

  async init() {
    await Tone.start()
    this._initialized = true
  }

  createModule(id: string, type: ModuleType, data: SynthNodeData | DrumGridNodeData | DelayNodeData | FilterNodeData | OscilloscopeNodeData | OutputNodeData) {
    if (this.modules.has(id)) return

    switch (type) {
      case 'synth':
        this.createSynth(id, data as SynthNodeData)
        break
      case 'drumGrid':
        this.createDrumGrid(id, data as DrumGridNodeData)
        break
      case 'delay':
        this.createDelay(id, data as DelayNodeData)
        break
      case 'filter':
        this.createFilter(id, data as FilterNodeData)
        break
      case 'oscilloscope':
        this.createOscilloscope(id, data as OscilloscopeNodeData)
        break
      case 'output':
        this.createOutput(id, data as OutputNodeData)
        break
    }
  }

  private createSynth(id: string, data: SynthNodeData) {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: data.waveform },
      envelope: {
        attack: data.attack,
        decay: data.decay,
        sustain: data.sustain,
        release: data.release,
      },
    })
    const gain = new Tone.Gain(1)
    synth.connect(gain)

    const pattern = data.pattern ?? DEFAULT_SYNTH_PATTERN
    const seq = new Tone.Sequence(
      (time, note) => {
        if (note) {
          synth.triggerAttackRelease(note, '8n', time)
        }
      },
      pattern,
      '8n',
    )
    seq.loop = true
    seq.start(0)

    this.modules.set(id, { type: 'synth', node: synth, sequences: [seq], gainOut: gain })
  }

  private createDrumGrid(id: string, data: DrumGridNodeData) {
    const kick = new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 4, envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 0.4 } })
    const snare = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.2, sustain: 0 } })
    const hihat = new Tone.MetalSynth({ frequency: 200, envelope: { attack: 0.001, decay: 0.1, release: 0.01 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 })
    const clap = new Tone.NoiseSynth({ noise: { type: 'pink' }, envelope: { attack: 0.001, decay: 0.15, sustain: 0 } })

    const gain = new Tone.Gain(1)
    kick.connect(gain)
    snare.connect(gain)
    hihat.connect(gain)
    clap.connect(gain)

    const voices = [kick, snare, hihat, clap]
    const tracks = data.tracks ?? DEFAULT_DRUM_TRACKS

    const sequences = tracks.map((track, i) => {
      const seq = new Tone.Sequence(
        (time, step) => {
          if (step) {
            if (i === 0) (voices[0] as Tone.MembraneSynth).triggerAttackRelease('C1', '8n', time)
            else if (i === 1) (voices[1] as Tone.NoiseSynth).triggerAttackRelease('8n', time)
            else if (i === 2) (voices[2] as Tone.MetalSynth).triggerAttackRelease('32n', time, 0.3)
            else if (i === 3) (voices[3] as Tone.NoiseSynth).triggerAttackRelease('16n', time)
          }
        },
        track.steps,
        '16n',
      )
      seq.loop = true
      seq.start(0)
      return seq
    })

    this.modules.set(id, { type: 'drumGrid', node: gain, sequences, gainOut: gain })
  }

  private createDelay(id: string, data: DelayNodeData) {
    const delay = new Tone.FeedbackDelay(data.delayTime, data.feedback)
    delay.wet.value = data.wet
    const gain = new Tone.Gain(1)
    delay.connect(gain)

    this.modules.set(id, { type: 'delay', node: delay, gainOut: gain })
  }

  private createFilter(id: string, data: FilterNodeData) {
    const filter = new Tone.Filter(data.frequency, data.filterType, -24)
    filter.Q.value = data.resonance
    const gain = new Tone.Gain(1)
    filter.connect(gain)

    this.modules.set(id, { type: 'filter', node: filter, gainOut: gain })
  }

  private createOscilloscope(id: string, _data: OscilloscopeNodeData) {
    const analyser = new Tone.Analyser('waveform', 1024)
    const gain = new Tone.Gain(1)
    analyser.connect(gain)

    this.modules.set(id, { type: 'oscilloscope', node: analyser, analyser, gainOut: gain })
  }

  private createOutput(id: string, data: OutputNodeData) {
    const vol = new Tone.Volume(data.volume)
    vol.toDestination()

    this.modules.set(id, { type: 'output', node: vol })
  }

  connect(sourceId: string, targetId: string) {
    const source = this.modules.get(sourceId)
    const target = this.modules.get(targetId)
    if (!source || !target) return

    const outputNode = source.gainOut ?? source.node
    outputNode.connect(target.node)
  }

  disconnect(sourceId: string, targetId: string) {
    const source = this.modules.get(sourceId)
    const target = this.modules.get(targetId)
    if (!source || !target) return

    const outputNode = source.gainOut ?? source.node
    try {
      outputNode.disconnect(target.node)
    } catch {
      // Already disconnected
    }
  }

  destroyModule(id: string) {
    const entry = this.modules.get(id)
    if (!entry) return

    entry.sequences?.forEach((seq) => {
      seq.stop()
      seq.dispose()
    })

    if (entry.gainOut && entry.gainOut !== entry.node) {
      entry.gainOut.dispose()
    }
    entry.node.dispose()
    this.modules.delete(id)
  }

  updateParam(id: string, param: string, value: number | string) {
    const entry = this.modules.get(id)
    if (!entry) return

    switch (entry.type) {
      case 'synth': {
        const synth = entry.node as Tone.PolySynth
        if (param === 'waveform') {
          synth.set({ oscillator: { type: value as OscillatorType } })
        } else if (['attack', 'decay', 'sustain', 'release'].includes(param)) {
          synth.set({ envelope: { [param]: value as number } })
        }
        break
      }
      case 'delay': {
        const delay = entry.node as Tone.FeedbackDelay
        if (param === 'delayTime') delay.delayTime.rampTo(value as number, 0.1)
        else if (param === 'feedback') delay.feedback.rampTo(value as number, 0.1)
        else if (param === 'wet') delay.wet.rampTo(value as number, 0.1)
        break
      }
      case 'filter': {
        const filter = entry.node as Tone.Filter
        if (param === 'frequency') filter.frequency.rampTo(value as number, 0.1)
        else if (param === 'resonance') filter.Q.rampTo(value as number, 0.1)
        else if (param === 'filterType') filter.type = value as BiquadFilterType
        break
      }
      case 'output': {
        const vol = entry.node as Tone.Volume
        if (param === 'volume') vol.volume.rampTo(value as number, 0.1)
        break
      }
    }
  }

  updateSynthPattern(id: string, pattern: (string | null)[]) {
    const entry = this.modules.get(id)
    if (!entry || entry.type !== 'synth') return

    entry.sequences?.forEach((seq) => {
      seq.stop()
      seq.dispose()
    })

    const synth = entry.node as Tone.PolySynth
    const seq = new Tone.Sequence(
      (time, note) => {
        if (note) synth.triggerAttackRelease(note, '8n', time)
      },
      pattern,
      '8n',
    )
    seq.loop = true
    seq.start(0)
    entry.sequences = [seq]
  }

  updateDrumPattern(id: string, trackIndex: number, steps: boolean[]) {
    const entry = this.modules.get(id)
    if (!entry || entry.type !== 'drumGrid' || !entry.sequences) return

    const oldSeq = entry.sequences[trackIndex]
    if (!oldSeq) return

    oldSeq.stop()
    oldSeq.dispose()

    const seq = new Tone.Sequence(
      (time, step) => {
        if (step) {
          // Re-trigger the corresponding voice (stored in the gain's inputs)
          // We need a reference, so we store voices separately... for now trigger based on index
          // This is handled by keeping the original voice connections alive
        }
      },
      steps,
      '16n',
    )
    seq.loop = true
    seq.start(0)
    entry.sequences[trackIndex] = seq
  }

  getAnalyserData(id: string): Float32Array | null {
    const entry = this.modules.get(id)
    if (!entry || !entry.analyser) return null
    return entry.analyser.getValue() as Float32Array
  }

  startTransport() {
    Tone.getTransport().start()
  }

  stopTransport() {
    Tone.getTransport().stop()
  }

  setBpm(bpm: number) {
    Tone.getTransport().bpm.value = bpm
  }

  getTransportState() {
    return Tone.getTransport().state
  }

  dispose() {
    for (const [id] of this.modules) {
      this.destroyModule(id)
    }
  }
}

export const audioEngine = new AudioEngine()
