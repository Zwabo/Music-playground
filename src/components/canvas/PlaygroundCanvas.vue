<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { VueFlow, useVueFlow, type Connection } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { usePlaygroundStore } from '@/stores/playgroundStore'
import ContextMenu from '@/components/ui/ContextMenu.vue'
import type { ContextMenuItem } from '@/components/ui/ContextMenu.vue'
import type { ModuleType } from '@/types'
import SynthModule from '@/components/modules/SynthModule.vue'
import DrumGridModule from '@/components/modules/DrumGridModule.vue'
import DelayModule from '@/components/modules/DelayModule.vue'
import FilterModule from '@/components/modules/FilterModule.vue'
import OscilloscopeModule from '@/components/modules/OscilloscopeModule.vue'
import OutputModule from '@/components/modules/OutputModule.vue'
import GatoModule from '@/components/modules/GatoModule.vue'

const store = usePlaygroundStore()

const { onConnect, onEdgesChange, getSelectedNodes, getSelectedEdges, screenToFlowCoordinate } = useVueFlow()

// Context menu state
const contextMenu = ref<{ x: number; y: number; items: ContextMenuItem[] } | null>(null)

// Track last known mouse position for CMD+V paste
const lastMouseEvent = ref<{ clientX: number; clientY: number }>({ clientX: 400, clientY: 300 })

const addModuleEntries: { type: ModuleType; icon: string; label: string }[] = [
  { type: 'synth', icon: '🎹', label: 'Synth' },
  { type: 'drumGrid', icon: '🥁', label: 'Drums' },
  { type: 'delay', icon: '🎛️', label: 'Delay' },
  { type: 'filter', icon: '🔻', label: 'Filter' },
  { type: 'oscilloscope', icon: '📊', label: 'Scope' },
  { type: 'output', icon: '🔊', label: 'Output' },
  { type: 'gato', icon: '🐱', label: 'Gato' },
]

onConnect((connection: Connection) => {
  if (connection.source === connection.target) return
  const exists = store.edges.some(
    (e) => e.source === connection.source && e.target === connection.target,
  )
  if (exists) return
  store.connectModules(connection)
})

onEdgesChange((changes) => {
  changes.forEach((change) => {
    if (change.type === 'remove') {
      store.disconnectModules(change.id)
    }
  })
})

// Context menu handlers
function onNodeContextMenu({ event, node }: { event: MouseEvent | TouchEvent; node: { id: string } }) {
  event.preventDefault()
  if (!(event instanceof MouseEvent)) return
  closeContextMenu()
  const items: ContextMenuItem[] = [
    { label: 'Copy', icon: '📋', shortcut: '⌘C', action: () => store.copyModule(node.id) },
    { label: 'Cut', icon: '✂️', shortcut: '⌘X', action: () => store.cutModule(node.id) },
    { separator: true, label: '', action: () => {} },
    { label: 'Delete', icon: '🗑️', shortcut: '⌫', action: () => store.removeModule(node.id) },
  ]
  contextMenu.value = { x: event.clientX, y: event.clientY, items }
}

function onEdgeContextMenu({ event, edge }: { event: MouseEvent | TouchEvent; edge: { id: string } }) {
  event.preventDefault()
  if (!(event instanceof MouseEvent)) return
  closeContextMenu()
  const items: ContextMenuItem[] = [
    { label: 'Delete Connection', icon: '🗑️', shortcut: '⌫', action: () => store.disconnectModules(edge.id) },
  ]
  contextMenu.value = { x: event.clientX, y: event.clientY, items }
}

function onPaneContextMenu(event: MouseEvent) {
  event.preventDefault()
  closeContextMenu()
  const flowPos = screenToFlowCoordinate({ x: event.clientX, y: event.clientY })

  const items: ContextMenuItem[] = [
    {
      label: 'Paste',
      icon: '📋',
      shortcut: '⌘V',
      action: () => store.pasteModule(flowPos),
      disabled: !store.clipboard,
    },
    { separator: true, label: '', action: () => {} },
    ...addModuleEntries.map((m) => ({
      label: `Add ${m.label}`,
      icon: m.icon,
      action: () => store.addModule(m.type, flowPos),
    })),
  ]
  contextMenu.value = { x: event.clientX, y: event.clientY, items }
}

function closeContextMenu() {
  contextMenu.value = null
}

function onMouseMove(event: MouseEvent) {
  lastMouseEvent.value = { clientX: event.clientX, clientY: event.clientY }
}

// Keyboard shortcuts
function onKeyDown(event: KeyboardEvent) {
  const isMeta = event.metaKey || event.ctrlKey
  const target = event.target as HTMLElement

  // Don't intercept when typing in inputs
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return

  if (isMeta && event.key === 'c') {
    const selected = getSelectedNodes.value
    if (selected.length > 0) {
      event.preventDefault()
      store.copyModule(selected[0].id)
    }
  }

  if (isMeta && event.key === 'x') {
    const selected = getSelectedNodes.value
    if (selected.length > 0) {
      event.preventDefault()
      store.cutModule(selected[0].id)
    }
  }

  if (isMeta && event.key === 'v') {
    if (store.clipboard) {
      event.preventDefault()
      const flowPos = screenToFlowCoordinate({
        x: lastMouseEvent.value.clientX,
        y: lastMouseEvent.value.clientY,
      })
      store.pasteModule(flowPos)
    }
  }

  if (event.key === 'Delete' || event.key === 'Backspace') {
    event.preventDefault()
    const selectedEdges = getSelectedEdges.value
    const selectedNodes = getSelectedNodes.value
    selectedEdges.forEach((edge) => store.disconnectModules(edge.id))
    selectedNodes.forEach((node) => store.removeModule(node.id))
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <VueFlow
    v-model:nodes="store.nodes"
    v-model:edges="store.edges"
    :default-edge-options="{ animated: true, selectable: true }"
    :snap-to-grid="true"
    :snap-grid="[20, 20]"
    :delete-key-code="null"
    :multi-selection-key-code="'Shift'"
    :edges-selectable="true"
    :fit-view-on-init="true"
    class="playground-canvas"
    @node-context-menu="onNodeContextMenu"
    @edge-context-menu="onEdgeContextMenu"
    @pane-context-menu="onPaneContextMenu"
    @mousemove="onMouseMove"
  >
    <template #node-synth="nodeProps">
      <SynthModule v-bind="nodeProps" />
    </template>
    <template #node-drumGrid="nodeProps">
      <DrumGridModule v-bind="nodeProps" />
    </template>
    <template #node-delay="nodeProps">
      <DelayModule v-bind="nodeProps" />
    </template>
    <template #node-filter="nodeProps">
      <FilterModule v-bind="nodeProps" />
    </template>
    <template #node-oscilloscope="nodeProps">
      <OscilloscopeModule v-bind="nodeProps" />
    </template>
    <template #node-output="nodeProps">
      <OutputModule v-bind="nodeProps" />
    </template>
    <template #node-gato="nodeProps">
      <GatoModule v-bind="nodeProps" />
    </template>
  </VueFlow>

  <ContextMenu
    v-if="contextMenu"
    :x="contextMenu.x"
    :y="contextMenu.y"
    :items="contextMenu.items"
    @close="closeContextMenu"
  />
</template>

<style>
.playground-canvas {
  width: 100%;
  height: 100%;
  background-color: var(--bg-cream);
  /* Dot-grid craft paper feel */
  background-image: radial-gradient(circle, var(--ink-muted) 0.8px, transparent 0.8px);
  background-size: 24px 24px;
}

.vue-flow__edge-path {
  stroke: var(--ink);
  stroke-width: 2.5;
}

.vue-flow__edge.selected .vue-flow__edge-path {
  stroke: var(--orange);
  stroke-width: 3.5;
}

.vue-flow__edge:hover:not(.selected) .vue-flow__edge-path {
  stroke: var(--ink-soft);
  stroke-width: 3;
  cursor: pointer;
}

.vue-flow__edge.animated .vue-flow__edge-path {
  stroke-dasharray: 8 4;
  animation: flowDash 0.6s linear infinite;
}

@keyframes flowDash {
  to {
    stroke-dashoffset: -12;
  }
}

.vue-flow__connection-line {
  stroke: var(--orange);
  stroke-width: 2.5;
  stroke-dasharray: 6 4;
}

.vue-flow__handle {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--orange);
  border: 2.5px solid var(--ink);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.15s;
}

.vue-flow__handle:hover {
  background: var(--yellow);
  box-shadow: var(--shadow);
}

.vue-flow__background {
  background: var(--bg-cream);
}

.vue-flow__minimap {
  background: var(--bg-warm);
  border: var(--border);
  border-radius: var(--radius);
}

/* Override Vue Flow default theme colors */
.vue-flow__node {
  border: none;
  background: none;
  box-shadow: none;
  padding: 0;
}

.vue-flow__node.selected {
  box-shadow: none;
}
</style>
