<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import BaseModule from './BaseModule.vue'
import { usePlaygroundStore } from '@/stores/playgroundStore'
import type { SynthNodeData } from '@/types'

const NOTES = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
const WAVEFORMS = ['sine', 'square', 'sawtooth', 'triangle'] as const

const props = defineProps<{
  id: string
  data: SynthNodeData
}>()

const store = usePlaygroundStore()

function onWaveformChange(e: Event) {
  store.updateModuleParam(props.id, 'waveform', (e.target as HTMLSelectElement).value)
}

function onParamChange(param: string, e: Event) {
  store.updateModuleParam(props.id, param, parseFloat((e.target as HTMLInputElement).value))
}

function toggleStep(index: number) {
  const pattern = [...props.data.pattern]
  if (pattern[index]) {
    pattern[index] = null
  } else {
    pattern[index] = 'C4'
  }
  store.updateSynthPattern(props.id, pattern)
}

function changeStepNote(index: number, e: Event) {
  const pattern = [...props.data.pattern]
  pattern[index] = (e.target as HTMLSelectElement).value || null
  store.updateSynthPattern(props.id, pattern)
}
</script>

<template>
  <Handle type="source" :position="Position.Right" id="audio-out" />
  <BaseModule :id="id" :label="'🎹 ' + data.label" color="var(--green-light)">
    <div class="synth-controls">
      <div class="waveform-row">
        <select :value="data.waveform" @change="onWaveformChange" class="waveform-select nodrag nopan">
          <option v-for="w in WAVEFORMS" :key="w" :value="w">{{ w }}</option>
        </select>
      </div>

      <div class="adsr-row">
        <div class="adsr-knob" v-for="p in ['attack', 'decay', 'sustain', 'release']" :key="p">
          <label class="adsr-label">{{ p[0].toUpperCase() }}</label>
          <input
            type="range"
            :min="p === 'sustain' ? 0 : 0.01"
            :max="p === 'sustain' ? 1 : p === 'release' ? 4 : 2"
            :step="0.01"
            :value="(data as Record<string, unknown>)[p]"
            @input="onParamChange(p, $event)"
            class="adsr-slider nodrag nopan"
          />
        </div>
      </div>

      <div class="pattern-grid">
        <div
          v-for="(step, i) in data.pattern"
          :key="i"
          class="pattern-step"
          :class="{ active: step !== null }"
          @click="toggleStep(i)"
        >
          <select
            v-if="step !== null"
            :value="step"
            @change="changeStepNote(i, $event)"
            @click.stop
            class="note-select nodrag nopan"
          >
            <option v-for="n in NOTES" :key="n" :value="n">{{ n }}</option>
          </select>
          <span v-else class="step-empty">·</span>
        </div>
      </div>
    </div>
  </BaseModule>
</template>

<style scoped>
.synth-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 210px;
}

.waveform-row {
  display: flex;
}

.waveform-select {
  width: 100%;
  background: var(--bg-warm);
  color: var(--ink);
  border: var(--border);
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  font-family: var(--font-body);
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.adsr-row {
  display: flex;
  gap: 6px;
}

.adsr-knob {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.adsr-label {
  font-family: var(--font-display);
  font-size: 10px;
  color: var(--ink-soft);
  font-weight: 700;
}

.adsr-slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--bg-warm);
  border: 1.5px solid var(--ink);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.adsr-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--green);
  border: 2px solid var(--ink);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.pattern-grid {
  display: flex;
  gap: 3px;
}

.pattern-step {
  flex: 1;
  height: 30px;
  background: var(--bg-warm);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1.5px solid var(--ink-muted);
  transition: all 0.1s;
  min-width: 26px;
}

.pattern-step.active {
  background: var(--green-light);
  border-color: var(--ink);
  box-shadow: var(--shadow-sm);
}

.pattern-step:hover {
  border-color: var(--ink);
  transform: translateY(-1px);
}

.step-empty {
  color: var(--ink-muted);
  font-size: 14px;
}

.note-select {
  width: 100%;
  background: transparent;
  color: var(--ink);
  border: none;
  font-size: 9px;
  font-family: var(--font-body);
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  padding: 0;
}

.note-select option {
  background: var(--bg-cream);
}
</style>
