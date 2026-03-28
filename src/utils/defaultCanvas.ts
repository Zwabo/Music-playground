import type { CanvasState } from '@/types'
import { DEFAULT_SYNTH_PATTERN, DEFAULT_DRUM_TRACKS } from '@/types/definitions'

export function createDefaultCanvas(): CanvasState {
  return {
    nodes: [
      {
        id: 'module-1',
        type: 'drumGrid',
        position: { x: 50, y: 80 },
        data: {
          type: 'drumGrid',
          label: 'Drum Grid',
          tracks: DEFAULT_DRUM_TRACKS.map((t) => ({ name: t.name, steps: [...t.steps] })),
        },
      },
      {
        id: 'module-2',
        type: 'synth',
        position: { x: 50, y: 320 },
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
        type: 'delay',
        position: { x: 420, y: 320 },
        data: {
          type: 'delay',
          label: 'Delay',
          delayTime: 0.3,
          feedback: 0.4,
          wet: 0.5,
        },
      },
      {
        id: 'module-4',
        type: 'output',
        position: { x: 700, y: 200 },
        data: {
          type: 'output',
          label: 'Output',
          volume: -6,
        },
      },
    ],
    edges: [
      {
        id: 'e-module-1-module-4',
        source: 'module-1',
        target: 'module-4',
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
      {
        id: 'e-module-3-module-4',
        source: 'module-3',
        target: 'module-4',
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
