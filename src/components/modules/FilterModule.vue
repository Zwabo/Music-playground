<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import BaseModule from './BaseModule.vue'
import { usePlaygroundStore } from '@/stores/playgroundStore'
import type { FilterNodeData } from '@/types'

const props = defineProps<{
  id: string
  data: FilterNodeData
}>()

const store = usePlaygroundStore()

function onParamChange(param: string, e: Event) {
  store.updateModuleParam(props.id, param, parseFloat((e.target as HTMLInputElement).value))
}

function onTypeChange(e: Event) {
  store.updateModuleParam(props.id, 'filterType', (e.target as HTMLSelectElement).value)
}

function formatFreq(hz: number): string {
  return hz >= 1000 ? `${(hz / 1000).toFixed(1)}kHz` : `${hz.toFixed(0)}Hz`
}
</script>

<template>
  <Handle type="target" :position="Position.Left" id="audio-in" />
  <Handle type="source" :position="Position.Right" id="audio-out" />
  <BaseModule :id="id" :label="'🔻 ' + data.label" color="var(--red-light)">
    <div class="filter-controls">
      <div class="param-row">
        <label class="param-label">
          Type
        </label>
        <select
          :value="data.filterType"
          @change="onTypeChange"
          class="type-select nodrag nopan"
        >
          <option value="lowpass">Low-pass</option>
          <option value="highpass">High-pass</option>
          <option value="bandpass">Band-pass</option>
        </select>
      </div>
      <div class="param-row">
        <label class="param-label">
          Frequency
          <span class="param-value">{{ formatFreq(data.frequency) }}</span>
        </label>
        <input
          type="range"
          :min="20"
          :max="20000"
          :step="1"
          :value="data.frequency"
          @input="onParamChange('frequency', $event)"
          class="param-slider nodrag nopan"
        />
      </div>
      <div class="param-row">
        <label class="param-label">
          Resonance
          <span class="param-value">{{ data.resonance.toFixed(1) }}</span>
        </label>
        <input
          type="range"
          :min="0.1"
          :max="30"
          :step="0.1"
          :value="data.resonance"
          @input="onParamChange('resonance', $event)"
          class="param-slider nodrag nopan"
        />
      </div>
    </div>
  </BaseModule>
</template>

<style scoped>
.filter-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 170px;
}

.param-row {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.param-label {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-soft);
}

.param-value {
  color: var(--ink);
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}

.type-select {
  width: 100%;
  padding: 4px 8px;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: var(--ink);
  background: var(--bg-warm);
  border: 1.5px solid var(--ink);
  border-radius: 6px;
  cursor: pointer;
  outline: none;
}

.type-select:focus {
  border-color: var(--red);
}

.param-slider {
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

.param-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--red);
  border: 2px solid var(--ink);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}
</style>
