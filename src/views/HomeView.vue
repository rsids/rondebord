<script setup lang="ts">
import { onMounted, ref } from 'vue'
type displaymode = 'single' | 'pair' | 'quartet' | 'quartet-simple'
const ip = ref('')
const mode = ref<displaymode>('quartet')
const serverConnected = ref(false)

const r0 = ref('0')
const r1 = ref('1')
const r2 = ref('2')
const r3 = ref('3')
const refs = [r0, r1, r2, r3]

onMounted(() => {
  const socket = new WebSocket('ws://localhost:3030')
  socket.onmessage = (evt) => {
    const data = JSON.parse(evt.data)
    console.log('onmessage', data)
    switch (data.type) {
      case 'ip':
        ip.value = data.data
        socket.send(JSON.stringify({ type: 'connection', data: 'client' }))
        break
      case 'connection':
        if (data.data === 'server') {
          serverConnected.value = true
        }
        break
      case 'mode':
        mode.value = data.data
        break
      case 'laps':
        refs.forEach((r, i) => (r.value = data.data[i]))
    }
  }
  socket.onerror = (evt) => {
    console.log('onError', evt)
  }

  socket.onclose = (evt) => {
    console.log('onclose', evt)
  }
  socket.onopen = (evt) => {
    console.log('onopen', evt)
  }
})
</script>

<template>
  <main class="grid grid--full" :class="`is-${mode}`">
    <div class="lap lap--0">{{ r0 }}</div>
    <div class="lap lap--1">{{ r1 }}</div>
    <div class="lap lap--2">{{ r2 }}</div>
    <div class="lap lap--3">{{ r3 }}</div>
  </main>
  <div class="connection" :class="{ 'is-connected': serverConnected }"></div>
  <div class="ip">{{ ip }}</div>
</template>
