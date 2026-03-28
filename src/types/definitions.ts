import type { ModuleDefinition } from '@/types'

export const MODULE_DEFINITIONS: Record<string, ModuleDefinition> = {
  synth: {
    type: 'synth',
    label: 'Synth',
    inputs: [],
    outputs: [{ id: 'audio-out', signal: 'audio', direction: 'output' }],
    params: {
      attack: { label: 'Attack', min: 0.001, max: 2, step: 0.01, defaultValue: 0.01 },
      decay: { label: 'Decay', min: 0.01, max: 2, step: 0.01, defaultValue: 0.2 },
      sustain: { label: 'Sustain', min: 0, max: 1, step: 0.01, defaultValue: 0.5 },
      release: { label: 'Release', min: 0.01, max: 4, step: 0.01, defaultValue: 0.8 },
    },
  },
  drumGrid: {
    type: 'drumGrid',
    label: 'Drum Grid',
    inputs: [],
    outputs: [{ id: 'audio-out', signal: 'audio', direction: 'output' }],
    params: {},
  },
  delay: {
    type: 'delay',
    label: 'Delay',
    inputs: [{ id: 'audio-in', signal: 'audio', direction: 'input' }],
    outputs: [{ id: 'audio-out', signal: 'audio', direction: 'output' }],
    params: {
      delayTime: { label: 'Time', min: 0.01, max: 1, step: 0.01, defaultValue: 0.3 },
      feedback: { label: 'Feedback', min: 0, max: 0.95, step: 0.01, defaultValue: 0.4 },
      wet: { label: 'Wet', min: 0, max: 1, step: 0.01, defaultValue: 0.5 },
    },
  },
  output: {
    type: 'output',
    label: 'Output',
    inputs: [{ id: 'audio-in', signal: 'audio', direction: 'input' }],
    outputs: [],
    params: {
      volume: { label: 'Volume', min: -60, max: 0, step: 1, defaultValue: -6 },
    },
  },
  filter: {
    type: 'filter',
    label: 'Filter',
    inputs: [{ id: 'audio-in', signal: 'audio', direction: 'input' }],
    outputs: [{ id: 'audio-out', signal: 'audio', direction: 'output' }],
    params: {
      frequency: { label: 'Frequency', min: 20, max: 20000, step: 1, defaultValue: 1000 },
      resonance: { label: 'Resonance', min: 0.1, max: 30, step: 0.1, defaultValue: 1 },
    },
  },
  oscilloscope: {
    type: 'oscilloscope',
    label: 'Oscilloscope',
    inputs: [{ id: 'audio-in', signal: 'audio', direction: 'input' }],
    outputs: [{ id: 'audio-out', signal: 'audio', direction: 'output' }],
    params: {},
  },
}

export const DEFAULT_SYNTH_PATTERN: (string | null)[] = [
  'C4', 'E4', 'G4', null, 'C4', null, 'E4', null,
]

export const DEFAULT_DRUM_TRACKS = [
  { name: 'Kick', steps: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
  { name: 'Snare', steps: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false] },
  { name: 'HiHat', steps: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false] },
  { name: 'Clap', steps: [false, false, false, false, true, false, false, true, false, false, false, false, true, false, false, false] },
]
