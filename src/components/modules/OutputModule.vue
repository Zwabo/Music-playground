<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import BaseModule from './BaseModule.vue'
import { usePlaygroundStore } from '@/stores/playgroundStore'
import type { OutputNodeData } from '@/types'

const props = defineProps<{
  id: string
  data: OutputNodeData
}>()

const store = usePlaygroundStore()

function onVolumeChange(e: Event) {
  const value = parseFloat((e.target as HTMLInputElement).value)
  store.updateModuleParam(props.id, 'volume', value)
}
</script>

<template>
  <Handle type="target" :position="Position.Left" id="audio-in" />
  <BaseModule :id="id" :label="'🔊 ' + data.label" color="var(--purple-light)">
    <div class="output-controls">
      <label class="param-label">
        Volume
        <span class="param-value">{{ data.volume }} dB</span>
      </label>
      <input
        type="range"
        :min="-60"
        :max="0"
        :step="1"
        :value="data.volume"
        @input="onVolumeChange"
        class="param-slider nodrag nopan"
      />
    </div>
  </BaseModule>
</template>

<style scoped>
.output-controls {
  display: flex;
  flex-direction: column;
  gap: 6px;
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
  background: var(--purple);
  border: 2px solid var(--ink);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}
</style>
