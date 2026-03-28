<script setup lang="ts">
import { usePlaygroundStore } from '@/stores/playgroundStore'

const props = defineProps<{
  id: string
  label: string
  color?: string
}>()

const store = usePlaygroundStore()

function onDelete() {
  store.removeModule(props.id)
}
</script>

<template>
  <div class="base-module" :style="{ '--module-color': color ?? '#10b981' }">
    <div class="module-header">
      <span class="module-label">{{ label }}</span>
      <button class="module-delete" @click.stop="onDelete" title="Delete module">×</button>
    </div>
    <div class="module-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.base-module {
  background: var(--bg-cream);
  border: var(--border);
  border-radius: var(--radius);
  min-width: 180px;
  box-shadow: var(--shadow);
  font-family: var(--font-body);
  color: var(--ink);
  transition: box-shadow 0.15s, transform 0.15s;
}

.base-module:hover {
  box-shadow: var(--shadow-hover);
  transform: translate(-1px, -1px);
}

.module-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--module-color);
  border-bottom: var(--border);
  border-radius: 10px 10px 0 0;
  cursor: grab;
}

.module-label {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--ink);
}

.module-delete {
  background: var(--bg-cream);
  border: 2px solid var(--ink);
  border-radius: 50%;
  color: var(--ink);
  font-size: 14px;
  width: 22px;
  height: 22px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s;
  box-shadow: var(--shadow-sm);
}

.module-delete:hover {
  background: var(--red);
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0px var(--ink);
}

.module-body {
  padding: 10px 12px;
}
</style>