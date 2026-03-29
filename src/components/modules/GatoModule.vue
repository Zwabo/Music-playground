<script setup lang="ts">
import { ref } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import BaseModule from './BaseModule.vue'
import ModuleSlider from '@/components/ui/ModuleSlider.vue'
import ModuleSelect from '@/components/ui/ModuleSelect.vue'
import { usePlaygroundStore } from '@/stores/playgroundStore'
import type { GatoNodeData, GatoSoundType } from '@/types'

const props = defineProps<{
  id: string
  data: GatoNodeData
}>()

const store = usePlaygroundStore()

const soundTypeOptions = [
  { value: 'meow', label: '😺 Meow' },
  { value: 'purr', label: '😻 Purr' },
  { value: 'hiss', label: '🙀 Hiss' },
  { value: 'chirp', label: '😸 Chirp' },
]

const isAnimating = ref(false)

const catImages: Record<GatoSoundType | 'idle', string> = {
  idle: '/assets/gato/idle.png',
  meow: '/assets/gato/meow.png',
  purr: '/assets/gato/purr.png',
  hiss: '/assets/gato/hiss.png',
  chirp: '/assets/gato/chirp.png',
}

const currentImage = ref(catImages.idle)

function triggerCat() {
  store.triggerGato(props.id)
  currentImage.value = catImages[props.data.soundType]
  isAnimating.value = true
  setTimeout(() => {
    currentImage.value = catImages.idle
    isAnimating.value = false
  }, 500)
}

function setSoundType(value: string) {
  store.updateModuleParam(props.id, 'soundType', value)
}

function setPitch(value: number) {
  store.updateModuleParam(props.id, 'pitch', value)
}
</script>

<template>
  <Handle type="source" :position="Position.Right" id="audio-out" />
  <BaseModule :id="id" :label="'🐱 ' + data.label" color="var(--yellow-light, #fef3c7)">
    <div class="gato-module">
      <!-- Cat Image (clickable, displayed large) -->
      <div class="cat-display nodrag nopan" :class="{ animating: isAnimating }" @click="triggerCat">
        <img :src="currentImage" alt="Gato" class="cat-image" />
      </div>

      <!-- Sound Type Selector -->
      <ModuleSelect
        :model-value="data.soundType"
        :options="soundTypeOptions"
        color="var(--orange)"
        @update:model-value="setSoundType"
      />

      <!-- Pitch Slider -->
      <ModuleSlider
        label="Pitch"
        :model-value="data.pitch"
        :min="0.5" :max="2" :step="0.1"
        :display-value="`${data.pitch.toFixed(1)}×`"
        color="var(--orange)"
        @update:model-value="setPitch"
      />
    </div>
  </BaseModule>
</template>

<style scoped>
.gato-module {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  min-width: 180px;
  padding: 4px;
}

.cat-display {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s;
}

.cat-display:hover {
  transform: scale(1.05);
}

.cat-display:active {
  transform: scale(0.97);
}

.cat-display.animating {
  animation: catBounce 0.5s ease;
}

@keyframes catBounce {
  0% { transform: scale(1); }
  20% { transform: scale(1.15) rotate(-5deg); }
  40% { transform: scale(1.1) rotate(5deg); }
  60% { transform: scale(1.05) rotate(-3deg); }
  80% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.cat-image {
  width: 140px;
  height: 140px;
  pointer-events: none;
}
</style>
