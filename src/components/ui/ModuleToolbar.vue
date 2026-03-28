<script setup lang="ts">
import { usePlaygroundStore } from '@/stores/playgroundStore'
import type { ModuleType } from '@/types'

const store = usePlaygroundStore()

const modules: { type: ModuleType; icon: string; label: string }[] = [
  { type: 'synth', icon: '🎹', label: 'Synth' },
  { type: 'drumGrid', icon: '🥁', label: 'Drums' },
  { type: 'delay', icon: '🎛️', label: 'Delay' },
  { type: 'filter', icon: '🔻', label: 'Filter' },
  { type: 'oscilloscope', icon: '📊', label: 'Scope' },
  { type: 'output', icon: '🔊', label: 'Output' },
]

function addModule(type: ModuleType) {
  // Place at a reasonable position with some randomness to avoid stacking
  const x = 200 + Math.random() * 400
  const y = 150 + Math.random() * 300
  store.addModule(type, { x, y })
}
</script>

<template>
  <div class="module-toolbar">
    <button
      v-for="m in modules"
      :key="m.type"
      class="toolbar-btn"
      @click="addModule(m.type)"
      :title="`Add ${m.label}`"
    >
      <span class="toolbar-icon">{{ m.icon }}</span>
      <span class="toolbar-label">{{ m.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.module-toolbar {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 10;
  display: flex;
  gap: 8px;
  background: var(--bg-cream);
  padding: 10px;
  border-radius: var(--radius);
  border: var(--border);
  box-shadow: var(--shadow);
}

.toolbar-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  background: var(--bg-warm);
  border: var(--border);
  border-radius: 8px;
  color: var(--ink);
  cursor: pointer;
  transition: all 0.1s;
  box-shadow: var(--shadow-sm);
}

.toolbar-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow-hover);
}

.toolbar-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0px var(--ink);
}

.toolbar-icon {
  font-size: 22px;
}

.toolbar-label {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ink-soft);
}
</style>
