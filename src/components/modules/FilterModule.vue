<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import BaseModule from './BaseModule.vue'
import ModuleSlider from '@/components/ui/ModuleSlider.vue'
import ModuleSelect from '@/components/ui/ModuleSelect.vue'
import { usePlaygroundStore } from '@/stores/playgroundStore'
import type { FilterNodeData } from '@/types'

const props = defineProps<{
  id: string
  data: FilterNodeData
}>()

const store = usePlaygroundStore()

const filterTypes = [
  { value: 'lowpass', label: 'Low-pass' },
  { value: 'highpass', label: 'High-pass' },
  { value: 'bandpass', label: 'Band-pass' },
]

function onParamChange(param: string, value: number) {
  store.updateModuleParam(props.id, param, value)
}

function onTypeChange(value: string) {
  store.updateModuleParam(props.id, 'filterType', value)
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
      <ModuleSelect
        label="Type"
        :model-value="data.filterType"
        :options="filterTypes"
        color="var(--red)"
        @update:model-value="onTypeChange"
      />
      <ModuleSlider
        label="Frequency"
        :model-value="data.frequency"
        :min="20" :max="20000" :step="1"
        :display-value="formatFreq(data.frequency)"
        color="var(--red)"
        @update:model-value="onParamChange('frequency', $event)"
      />
      <ModuleSlider
        label="Resonance"
        :model-value="data.resonance"
        :min="0.1" :max="30" :step="0.1"
        :display-value="data.resonance.toFixed(1)"
        color="var(--red)"
        @update:model-value="onParamChange('resonance', $event)"
      />
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
</style>
