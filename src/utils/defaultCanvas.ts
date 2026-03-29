import type { CanvasState } from '@/types'
import { DEFAULT_SYNTH_PATTERN, DEFAULT_DRUM_TRACKS } from '@/types/definitions'

export function createDefaultCanvas(): CanvasState {
  return {
    nodes: [
      {
        id: 'module-1',
        type: 'drumGrid',
        position: { x: 0, y: 60 },
        data: {
          type: 'drumGrid',
          label: 'Drum Grid',
          tracks: DEFAULT_DRUM_TRACKS.map((t) => ({ name: t.name, steps: [...t.steps] })),
        },
      },
      {
        id: 'module-2',
        type: 'synth',
        position: { x: 0, y: 280 },
        data: {
          type: 'synth',
          label: 'Synth',
          waveform: 'sawtooth',
          attack: 0.01,
          decay: 0.2,
          sustain: 0.5,
          release: 0.8,
          pattern: [...DEFAULT_SYNTH_PATTERN],
        },
      },
      {
        id: 'module-3',
        type: 'output',
        position: { x: 800, y: 170 },
        data: {
          type: 'output',
          label: 'Output',
          volume: -6,
        },
      },
    ],
    edges: [
      {
        id: 'e-module-1-module-3',
        source: 'module-1',
        target: 'module-3',
        sourceHandle: 'audio-out',
        targetHandle: 'audio-in',
        animated: true,
      },
      {
        id: 'e-module-2-module-3',
        source: 'module-2',
        target: 'module-3',
        sourceHandle: 'audio-out',
        targetHandle: 'audio-in',
        animated: true,
      },
    ],
    transport: {
      bpm: 120,
      playing: false,
    },
  }
}
