<script setup lang="ts">
defineProps<{
  label?: string
  modelValue: string
  options: { value: string; label: string }[]
  color?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onChange(e: Event) {
  emit('update:modelValue', (e.target as HTMLSelectElement).value)
}
</script>

<template>
  <div class="module-select">
    <label v-if="label" class="module-select-label">{{ label }}</label>
    <select
      :value="modelValue"
      @change="onChange"
      class="module-select-input nodrag nopan"
      :style="{ '--select-focus-color': color ?? 'var(--orange)' }"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
  </div>
</template>

<style scoped>
.module-select {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.module-select-label {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-soft);
}

.module-select-input {
  width: 100%;
  padding: 4px 8px;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: var(--ink);
  background: var(--bg-warm);
  border: var(--border);
  border-radius: 6px;
  cursor: pointer;
  outline: none;
  box-shadow: var(--shadow-sm);
}

.module-select-input:focus {
  border-color: var(--select-focus-color);
}
</style>
