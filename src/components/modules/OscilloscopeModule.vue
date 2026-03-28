<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import BaseModule from './BaseModule.vue'
import type { OscilloscopeNodeData } from '@/types'
import { audioEngine } from '@/audio/AudioEngine'

const props = defineProps<{
  id: string
  data: OscilloscopeNodeData
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height

  // Clear
  ctx.fillStyle = '#2D2A26'
  ctx.fillRect(0, 0, width, height)

  // Grid lines
  ctx.strokeStyle = '#4A4640'
  ctx.lineWidth = 0.5
  for (let i = 1; i < 4; i++) {
    const y = (height / 4) * i
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
  for (let i = 1; i < 6; i++) {
    const x = (width / 6) * i
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  // Waveform
  const data = audioEngine.getAnalyserData(props.id)
  if (!data) {
    animationId = requestAnimationFrame(draw)
    return
  }

  ctx.strokeStyle = '#7CB886'
  ctx.lineWidth = 2
  ctx.beginPath()

  const sliceWidth = width / data.length
  let x = 0

  for (let i = 0; i < data.length; i++) {
    const v = (data[i] + 1) / 2
    const y = v * height

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
    x += sliceWidth
  }

  ctx.stroke()

  animationId = requestAnimationFrame(draw)
}

onMounted(() => {
  animationId = requestAnimationFrame(draw)
})

onUnmounted(() => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<template>
  <Handle type="target" :position="Position.Left" id="audio-in" />
  <Handle type="source" :position="Position.Right" id="audio-out" />
  <BaseModule :id="id" :label="'📊 ' + data.label" color="var(--green-light)">
    <div class="oscilloscope-display">
      <canvas ref="canvasRef" width="200" height="100" class="scope-canvas"></canvas>
    </div>
  </BaseModule>
</template>

<style scoped>
.oscilloscope-display {
  min-width: 200px;
}

.scope-canvas {
  width: 100%;
  height: 100px;
  border: 1.5px solid var(--ink);
  border-radius: 6px;
  display: block;
}
</style>
