<script setup lang="ts">
defineProps<{
  label: string
  modelValue: number
  min: number
  max: number
  step: number
  displayValue: string
  color?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function onInput(e: Event) {
  emit('update:modelValue', parseFloat((e.target as HTMLInputElement).value))
}
</script>

<template>
  <div class="module-slider">
    <label class="module-slider-label">
      {{ label }}
      <span class="module-slider-value">{{ displayValue }}</span>
    </label>
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      @input="onInput"
      class="module-slider-input nodrag nopan"
      :style="{ '--slider-color': color ?? 'var(--orange)' }"
    />
  </div>
</template>

<style scoped>
.module-slider {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.module-slider-label {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-soft);
}

.module-slider-value {
  color: var(--ink);
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}

.module-slider-input {
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

.module-slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--slider-color);
  border: 2px solid var(--ink);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.module-slider-input::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--slider-color);
  border: 2px solid var(--ink);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}
</style>
