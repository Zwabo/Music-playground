<script setup lang="ts">
import { onMounted } from 'vue'
import PlaygroundCanvas from '@/components/canvas/PlaygroundCanvas.vue'
import ModuleToolbar from '@/components/ui/ModuleToolbar.vue'
import TransportBar from '@/components/ui/TransportBar.vue'
import AudioGate from '@/components/ui/AudioGate.vue'
import ShareButton from '@/components/ui/ShareButton.vue'
import { usePlaygroundStore } from '@/stores/playgroundStore'
import { loadFromUrl } from '@/utils/serialize'
import { createDefaultCanvas } from '@/utils/defaultCanvas'

const store = usePlaygroundStore()

onMounted(() => {
  const saved = loadFromUrl()
  if (saved) {
    store.loadState(saved)
  } else {
    store.loadState(createDefaultCanvas())
  }
})
</script>

<template>
  <div class="app-container">
    <AudioGate />
    <PlaygroundCanvas />
    <ModuleToolbar />
    <TransportBar />
    <ShareButton />
  </div>
</template>
