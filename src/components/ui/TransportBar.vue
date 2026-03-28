<script setup lang="ts">
import { usePlaygroundStore } from '@/stores/playgroundStore'

const store = usePlaygroundStore()

function onBpmChange(e: Event) {
  store.setBpm(parseInt((e.target as HTMLInputElement).value, 10))
}
</script>

<template>
  <div class="transport-bar">
    <button class="play-btn" :class="{ playing: store.isPlaying }" @click="store.togglePlay">
      {{ store.isPlaying ? '⏹' : '▶' }}
    </button>

    <div class="bpm-control">
      <label class="bpm-label">BPM</label>
      <input
        type="range"
        :min="60"
        :max="200"
        :step="1"
        :value="store.transport.bpm"
        @input="onBpmChange"
        class="bpm-slider"
      />
      <span class="bpm-value">{{ store.transport.bpm }}</span>
    </div>
  </div>
</template>

<style scoped>
.transport-bar {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--bg-cream);
  padding: 10px 18px;
  border-radius: var(--radius);
  border: var(--border);
  box-shadow: var(--shadow);
}

.play-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--green-light);
  border: var(--border);
  color: var(--ink);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s;
  box-shadow: var(--shadow-sm);
}

.play-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow);
}

.play-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0px var(--ink);
}

.play-btn.playing {
  background: var(--green);
  box-shadow: var(--shadow);
}

.bpm-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bpm-label {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-soft);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.bpm-slider {
  width: 120px;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--bg-warm);
  border: 1.5px solid var(--ink);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.bpm-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--orange);
  border: 2px solid var(--ink);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.bpm-value {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 800;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
  min-width: 28px;
  text-align: right;
}
</style>
