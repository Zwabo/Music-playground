<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import BaseModule from './BaseModule.vue'
import ModuleSlider from '@/components/ui/ModuleSlider.vue'
import { usePlaygroundStore } from '@/stores/playgroundStore'
import type { OutputNodeData } from '@/types'

const props = defineProps<{
  id: string
  data: OutputNodeData
}>()

const store = usePlaygroundStore()

function onVolumeChange(value: number) {
  store.updateModuleParam(props.id, 'volume', value)
}
</script>

<template>
  <Handle type="target" :position="Position.Left" id="audio-in" />
  <BaseModule :id="id" :label="'🔊 ' + data.label" color="var(--purple-light)">
    <div class="output-controls">
      <ModuleSlider
        label="Volume"
        :model-value="data.volume"
        :min="-60" :max="0" :step="1"
        :display-value="`${data.volume} dB`"
        color="var(--purple)"
        @update:model-value="onVolumeChange"
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
</style>
