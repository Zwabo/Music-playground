<script setup lang="ts">
import { ref } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import BaseModule from './BaseModule.vue'
import { usePlaygroundStore } from '@/stores/playgroundStore'
import type { GatoNodeData, GatoSoundType } from '@/types'

const props = defineProps<{
  id: string
  data: GatoNodeData
}>()

const store = usePlaygroundStore()

const soundTypes: { value: GatoSoundType; label: string }[] = [
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
  // Show the active state image briefly
  currentImage.value = catImages[props.data.soundType]
  isAnimating.value = true
  setTimeout(() => {
    currentImage.value = catImages.idle
    isAnimating.value = false
  }, 500)
}

function setSoundType(value: GatoSoundType) {
  store.updateModuleParam(props.id, 'soundType', value)
}

function setPitch(event: Event) {
  const value = parseFloat((event.target as HTMLInputElement).value)
  store.updateModuleParam(props.id, 'pitch', value)
}
</script>

<template>
  <Handle type="source" :position="Position.Right" id="audio-out" />
  <BaseModule :id="id" :label="'🐱 ' + data.label" color="var(--yellow-light, #fef3c7)">
    <div class="gato-module">
      <!-- Cat Image (clickable) -->
      <button class="cat-trigger nodrag nopan" :class="{ animating: isAnimating }" @click="triggerCat">
        <img :src="currentImage" alt="Gato" class="cat-image" />
      </button>

      <!-- Sound Type Selector -->
      <div class="sound-selector">
        <button
          v-for="st in soundTypes"
          :key="st.value"
          class="sound-btn nodrag nopan"
          :class="{ active: data.soundType === st.value }"
          @click="setSoundType(st.value)"
        >
          {{ st.label }}
        </button>
      </div>

      <!-- Pitch Slider -->
      <div class="param-row">
        <label class="param-label">Pitch</label>
        <input
          type="range"
          class="param-slider nodrag nopan"
          min="0.5"
          max="2"
          step="0.1"
          :value="data.pitch"
          @input="setPitch"
        />
        <span class="param-value">{{ data.pitch.toFixed(1) }}×</span>
      </div>
    </div>
  </BaseModule>
</template>

<style scoped>
.gato-module {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 180px;
  padding: 4px;
}

.cat-trigger {
  background: none;
  border: 2.5px solid var(--ink-muted);
  border-radius: 12px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cat-trigger:hover {
  border-color: var(--ink);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.cat-trigger:active {
  transform: translateY(1px);
  box-shadow: var(--shadow-sm);
}

.cat-trigger.animating {
  animation: catBounce 0.5s ease;
  border-color: var(--orange);
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
  width: 100px;
  height: 100px;
  pointer-events: none;
}

.sound-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  width: 100%;
}

.sound-btn {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 700;
  padding: 5px 8px;
  border: 1.5px solid var(--ink-muted);
  border-radius: 6px;
  background: var(--bg-warm);
  color: var(--ink-soft);
  cursor: pointer;
  transition: all 0.1s;
  text-transform: uppercase;
}

.sound-btn:hover {
  border-color: var(--ink);
  transform: translateY(-1px);
}

.sound-btn.active {
  background: var(--orange);
  border-color: var(--ink);
  color: var(--ink);
  box-shadow: var(--shadow-sm);
}

.param-row {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.param-label {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 700;
  color: var(--ink-soft);
  text-transform: uppercase;
  width: 36px;
  flex-shrink: 0;
}

.param-slider {
  flex: 1;
  height: 4px;
  accent-color: var(--orange);
  cursor: pointer;
}

.param-value {
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  color: var(--ink-soft);
  width: 30px;
  text-align: right;
  flex-shrink: 0;
}
</style>
