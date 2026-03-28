<script setup lang="ts">
import { ref } from 'vue'
import { usePlaygroundStore } from '@/stores/playgroundStore'
import { saveToUrl, copyShareUrl } from '@/utils/serialize'

const store = usePlaygroundStore()
const copied = ref(false)

async function share() {
  saveToUrl({
    nodes: store.nodes,
    edges: store.edges,
    transport: store.transport,
  })

  const ok = await copyShareUrl()
  if (ok) {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}
</script>

<template>
  <button class="share-btn" @click="share" :class="{ copied }">
    {{ copied ? '✓ Copied!' : '🔗 Share' }}
  </button>
</template>

<style scoped>
.share-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 10;
  padding: 10px 18px;
  background: var(--bg-cream);
  border: var(--border);
  border-radius: var(--radius);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: all 0.1s;
}

.share-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow-hover);
}

.share-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0px var(--ink);
}

.share-btn.copied {
  background: var(--green-light);
}
</style>
