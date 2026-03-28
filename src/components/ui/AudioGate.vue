<script setup lang="ts">
import { usePlaygroundStore } from '@/stores/playgroundStore'

const store = usePlaygroundStore()

async function start() {
  await store.startAudio()
}
</script>

<template>
  <Teleport to="body">
    <div v-if="!store.audioStarted" class="audio-gate" @click="start">
      <div class="gate-content">
        <div class="gate-icon">🎵</div>
        <h2 class="gate-title">Music Playground</h2>
        <p class="gate-subtitle">drag, connect, make weird sounds</p>
        <p class="gate-text">Click to start ▶</p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.audio-gate {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: var(--bg-cream);
  /* Dot-grid craft paper background */
  background-image: radial-gradient(circle, var(--ink-muted) 0.8px, transparent 0.8px);
  background-size: 24px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.gate-content {
  text-align: center;
  color: var(--ink);
}

.gate-icon {
  font-size: 64px;
  margin-bottom: 20px;
  animation: bounce 2s ease-in-out infinite;
  filter: drop-shadow(3px 3px 0px var(--ink));
}

.gate-title {
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 900;
  margin: 0 0 8px;
  color: var(--ink);
  letter-spacing: -0.02em;
}

.gate-subtitle {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--ink-soft);
  margin: 0 0 32px;
}

.gate-text {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  background: var(--green-light);
  border: var(--border);
  border-radius: 999px;
  padding: 12px 28px;
  box-shadow: var(--shadow);
  animation: wiggle 3s ease-in-out infinite;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.gate-pulse {
  display: none;
}

/* Decorative circles */
.gate-content::before,
.gate-content::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  border: var(--border);
  opacity: 0.15;
}

.gate-content::before {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 5%;
  background: var(--orange-light);
}

.gate-content::after {
  width: 200px;
  height: 200px;
  bottom: 10%;
  right: 8%;
  background: var(--blue-light);
}

@keyframes bounce {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-10px) rotate(3deg); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-1deg); }
  50% { transform: rotate(1deg); }
}
</style>
