<script setup lang="ts">
import { VueFlow, useVueFlow, type Connection } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { usePlaygroundStore } from '@/stores/playgroundStore'
import SynthModule from '@/components/modules/SynthModule.vue'
import DrumGridModule from '@/components/modules/DrumGridModule.vue'
import DelayModule from '@/components/modules/DelayModule.vue'
import FilterModule from '@/components/modules/FilterModule.vue'
import OscilloscopeModule from '@/components/modules/OscilloscopeModule.vue'
import OutputModule from '@/components/modules/OutputModule.vue'
import GatoModule from '@/components/modules/GatoModule.vue'

const store = usePlaygroundStore()

const { onConnect, onEdgesChange } = useVueFlow()

onConnect((connection: Connection) => {
  // Validate: no self-loops
  if (connection.source === connection.target) return

  // Validate: no duplicate edges
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
</script>

<template>
  <VueFlow
    v-model:nodes="store.nodes"
    v-model:edges="store.edges"
    :default-edge-options="{ animated: true, style: { stroke: '#2D2A26', strokeWidth: 2.5 } }"
    :snap-to-grid="true"
    :snap-grid="[20, 20]"
    :delete-key-code="'Delete'"
    :fit-view-on-init="true"
    class="playground-canvas"
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
