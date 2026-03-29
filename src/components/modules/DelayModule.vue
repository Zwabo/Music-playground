<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import BaseModule from './BaseModule.vue'
import ModuleSlider from '@/components/ui/ModuleSlider.vue'
import { usePlaygroundStore } from '@/stores/playgroundStore'
import type { DelayNodeData } from '@/types'

const props = defineProps<{
  id: string
  data: DelayNodeData
}>()

const store = usePlaygroundStore()

function onParamChange(param: string, value: number) {
  store.updateModuleParam(props.id, param, value)
}
</script>

<template>
  <Handle type="target" :position="Position.Left" id="audio-in" />
  <Handle type="source" :position="Position.Right" id="audio-out" />
  <BaseModule :id="id" :label="'🎛️ ' + data.label" color="var(--blue-light)">
    <div class="delay-controls">
      <ModuleSlider
        label="Time"
        :model-value="data.delayTime"
        :min="0.01" :max="1" :step="0.01"
        :display-value="`${(data.delayTime * 1000).toFixed(0)}ms`"
        color="var(--blue)"
        @update:model-value="onParamChange('delayTime', $event)"
      />
      <ModuleSlider
        label="Feedback"
        :model-value="data.feedback"
        :min="0" :max="0.95" :step="0.01"
        :display-value="`${(data.feedback * 100).toFixed(0)}%`"
        color="var(--blue)"
        @update:model-value="onParamChange('feedback', $event)"
      />
      <ModuleSlider
        label="Wet"
        :model-value="data.wet"
        :min="0" :max="1" :step="0.01"
        :display-value="`${(data.wet * 100).toFixed(0)}%`"
        color="var(--blue)"
        @update:model-value="onParamChange('wet', $event)"
      />
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
</style>
