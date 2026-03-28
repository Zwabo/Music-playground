<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import BaseModule from './BaseModule.vue'
import { usePlaygroundStore } from '@/stores/playgroundStore'
import type { DrumGridNodeData } from '@/types'

const props = defineProps<{
  id: string
  data: DrumGridNodeData
}>()

const store = usePlaygroundStore()

function toggleStep(trackIndex: number, stepIndex: number) {
  const current = props.data.tracks[trackIndex].steps[stepIndex]
  store.updateDrumStep(props.id, trackIndex, stepIndex, !current)
}
</script>

<template>
  <Handle type="source" :position="Position.Right" id="audio-out" />
  <BaseModule :id="id" :label="'🥁 ' + data.label" color="var(--orange-light)">
    <div class="drum-grid">
      <div v-for="(track, ti) in data.tracks" :key="ti" class="drum-row">
        <span class="track-name">{{ track.name }}</span>
        <div class="steps">
          <button
            v-for="(step, si) in track.steps"
            :key="si"
            class="drum-step nodrag nopan"
            :class="{
              active: step,
              beat: si % 4 === 0,
            }"
            @click="toggleStep(ti, si)"
          />
        </div>
      </div>
    </div>
  </BaseModule>
</template>

<style scoped>
.drum-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 300px;
}

.drum-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.track-name {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 700;
  color: var(--ink-soft);
  width: 36px;
  text-align: right;
  flex-shrink: 0;
  text-transform: uppercase;
}

.steps {
  display: flex;
  gap: 3px;
}

.drum-step {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background: var(--bg-warm);
  border: 1.5px solid var(--ink-muted);
  cursor: pointer;
  padding: 0;
  transition: all 0.1s;
}

.drum-step.beat {
  border-color: var(--ink-soft);
}

.drum-step.active {
  background: var(--orange);
  border-color: var(--ink);
  box-shadow: var(--shadow-sm);
}

.drum-step:hover {
  border-color: var(--ink);
  transform: translateY(-1px);
}
</style>
