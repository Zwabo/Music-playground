<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

export interface ContextMenuItem {
  label: string
  icon?: string
  shortcut?: string
  action: () => void
  disabled?: boolean
  separator?: boolean
}

const props = defineProps<{
  x: number
  y: number
  items: ContextMenuItem[]
}>()

const emit = defineEmits<{
  close: []
}>()

function onItemClick(item: ContextMenuItem) {
  if (item.disabled) return
  item.action()
  emit('close')
}

function handleOutsideEvent() {
  emit('close')
}

onMounted(() => {
  setTimeout(() => {
    window.addEventListener('pointerdown', handleOutsideEvent)
    window.addEventListener('contextmenu', handleOutsideEvent)
  }, 0)
})

onUnmounted(() => {
  window.removeEventListener('pointerdown', handleOutsideEvent)
  window.removeEventListener('contextmenu', handleOutsideEvent)
})
</script>

<template>
  <Teleport to="body">
    <div class="context-menu" :style="{ left: `${x}px`, top: `${y}px` }">
      <template v-for="(item, i) in items" :key="i">
        <div v-if="item.separator" class="context-menu-separator" />
        <button
          v-else
          class="context-menu-item"
          :class="{ disabled: item.disabled }"
          @pointerdown.stop
          @click.stop="onItemClick(item)"
        >
          <span class="context-menu-left">
            <span v-if="item.icon" class="context-menu-icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </span>
          <span v-if="item.shortcut" class="context-menu-shortcut">{{ item.shortcut }}</span>
        </button>
      </template>
    </div>
  </Teleport>
</template>

<style scoped>
.context-menu {
  position: fixed;
  z-index: 1000;
  min-width: 200px;
  background: var(--bg-cream);
  border: var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 6px;
  font-family: var(--font-body);
}

.context-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-family: var(--font-body);
  color: var(--ink);
  text-align: left;
  transition: background 0.1s;
}

.context-menu-item:hover:not(.disabled) {
  background: var(--bg-warm);
}

.context-menu-item.disabled {
  opacity: 0.4;
  cursor: default;
}

.context-menu-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.context-menu-icon {
  font-size: 15px;
  width: 20px;
  text-align: center;
}

.context-menu-shortcut {
  font-size: 11px;
  color: var(--ink-muted);
  font-family: var(--font-body);
  margin-left: 24px;
}

.context-menu-separator {
  height: 1px;
  background: var(--ink-muted);
  margin: 4px 8px;
  opacity: 0.3;
}
</style>
