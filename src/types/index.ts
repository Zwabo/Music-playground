import type { Node, Edge } from '@vue-flow/core'

export type ModuleType = 'synth' | 'drumGrid' | 'delay' | 'filter' | 'oscilloscope' | 'output' | 'gato'

export type HandleSignalType = 'audio'

export interface HandleDef {
  id: string
  signal: HandleSignalType
  direction: 'input' | 'output'
}

export interface ParamDef {
  label: string
  min: number
  max: number
  step: number
  defaultValue: number
}

export interface ModuleDefinition {
  type: ModuleType
  label: string
  inputs: HandleDef[]
  outputs: HandleDef[]
  params: Record<string, ParamDef>
}

export interface SynthNodeData {
  type: 'synth'
  label: string
  waveform: 'sine' | 'square' | 'sawtooth' | 'triangle'
  attack: number
  decay: number
  sustain: number
  release: number
  pattern: (string | null)[]
}

export interface DrumGridNodeData {
  type: 'drumGrid'
  label: string
  tracks: {
    name: string
    steps: boolean[]
  }[]
}

export interface DelayNodeData {
  type: 'delay'
  label: string
  delayTime: number
  feedback: number
  wet: number
}

export interface FilterNodeData {
  type: 'filter'
  label: string
  frequency: number
  resonance: number
  filterType: 'lowpass' | 'highpass' | 'bandpass'
}

export interface OscilloscopeNodeData {
  type: 'oscilloscope'
  label: string
  fftSize: number
}

export interface OutputNodeData {
  type: 'output'
  label: string
  volume: number
}

export type GatoSoundType = 'meow' | 'purr' | 'hiss' | 'chirp'

export interface GatoNodeData {
  type: 'gato'
  label: string
  soundType: GatoSoundType
  pitch: number
}

export type ModuleNodeData = SynthNodeData | DrumGridNodeData | DelayNodeData | FilterNodeData | OscilloscopeNodeData | OutputNodeData | GatoNodeData

export type ModuleNode = Node<ModuleNodeData>
export type ModuleEdge = Edge

export interface TransportState {
  bpm: number
  playing: boolean
}

export interface CanvasState {
  nodes: ModuleNode[]
  edges: ModuleEdge[]
  transport: TransportState
}
