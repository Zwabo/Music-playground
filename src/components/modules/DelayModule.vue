<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import BaseModule from './BaseModule.vue'
import { usePlaygroundStore } from '@/stores/playgroundStore'
import type { DelayNodeData } from '@/types'

const props = defineProps<{
  id: string
  data: DelayNodeData
}>()

const store = usePlaygroundStore()

function onParamChange(param: string, e: Event) {
  store.updateModuleParam(props.id, param, parseFloat((e.target as HTMLInputElement).value))
}
</script>

<template>
  <Handle type="target" :position="Position.Left" id="audio-in" />
  <Handle type="source" :position="Position.Right" id="audio-out" />
  <BaseModule :id="id" :label="'🎛️ ' + data.label" color="var(--blue-light)">
    <div class="delay-controls">
      <div class="param-row">
        <label class="param-label">
          Time
          <span class="param-value">{{ (data.delayTime * 1000).toFixed(0) }}ms</span>
        </label>
        <input
          type="range"
          :min="0.01"
          :max="1"
          :step="0.01"
          :value="data.delayTime"
          @input="onParamChange('delayTime', $event)"
          class="param-slider nodrag nopan"
        />
      </div>
      <div class="param-row">
        <label class="param-label">
          Feedback
          <span class="param-value">{{ (data.feedback * 100).toFixed(0) }}%</span>
        </label>
        <input
          type="range"
          :min="0"
          :max="0.95"
          :step="0.01"
          :value="data.feedback"
          @input="onParamChange('feedback', $event)"
          class="param-slider nodrag nopan"
        />
      </div>
      <div class="param-row">
        <label class="param-label">
          Wet
          <span class="param-value">{{ (data.wet * 100).toFixed(0) }}%</span>
        </label>
        <input
          type="range"
          :min="0"
          :max="1"
          :step="0.01"
          :value="data.wet"
          @input="onParamChange('wet', $event)"
          class="param-slider nodrag nopan"
        />
      </div>
    </div>
  </BaseModule>
</template>

<style scoped>
.delay-controls {
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
  background: var(--blue);
  border: 2px solid var(--ink);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}
</style>
