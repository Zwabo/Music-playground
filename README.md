# Pawdio - The Music Playground 🎛️

A browser-based, infinite musical sandbox where you drag, drop, and connect musical modules on a freeform canvas. Music emerges from interaction, not timelines.

**No DAW. No timeline. Just toys that make sound.**

## What It Does

- **Drag modules** onto an infinite canvas — synths, drum machines, effects, outputs
- **Connect them visually** with cables — audio flows between modules like a modular synth
- **Tweak in real-time** — every knob, slider, and grid cell changes sound instantly
- **Share via URL** — your entire canvas is encoded in the link, zero backend needed

## Modules

| Module | Description |
|--------|-------------|
| 🎹 **Synth** | Polyphonic synthesizer with waveform selector, ADSR envelope, and 8-step note sequencer |
| 🥁 **Drum Grid** | 4-track × 16-step drum machine (kick, snare, hihat, clap) using synthesized percussion |
| 🎛️ **Delay** | Feedback delay effect with time, feedback, and wet/dry controls |
| 🔊 **Output** | Master output with volume control — connects to your speakers |

## Architecture

**Dual-graph model** — the visual node graph (Vue Flow) and the audio signal graph (Tone.js) stay in sync through a one-directional flow:

```
UI Event → Pinia Store → Audio Engine → Sound
```

Audio node instances live in a plain `Map` (not reactive) to prevent Vue from proxying Web Audio internals.

## Tech Stack

- **Vue 3** + TypeScript + Vite
- **Vue Flow** — node-graph canvas (drag, connect, zoom, pan)
- **Tone.js** — audio engine (synths, effects, sequencing, transport)
- **Pinia** — state management
- **lz-string** — URL compression for shareable canvas snapshots

## Design

Neobrutalist aesthetic with retro pastel colors, chunky borders, hard offset shadows, and a dot-grid craft-paper canvas. Typography uses Outfit (display) and Space Grotesk (body).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — click to start audio, then hit play.

> Requires Node.js 20.19+ or 22.12+ (Vite 8 requirement)

## Project Structure

```
src/
  audio/AudioEngine.ts         — Tone.js singleton, create/connect/destroy nodes
  stores/playgroundStore.ts    — Pinia store, nodes/edges/transport state
  types/                       — TypeScript interfaces & module definitions
  utils/                       — URL serialization, default canvas setup
  components/
    canvas/PlaygroundCanvas.vue — Vue Flow canvas + event wiring
    modules/                    — Synth, DrumGrid, Delay, Output node components
    ui/                         — Toolbar, TransportBar, AudioGate, ShareButton
```
