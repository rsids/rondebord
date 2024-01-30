<script setup lang="ts">
import { onMounted, ref } from 'vue'

type displaymode = 'single' | 'pair' | 'quartet' | 'quartet-simple'
const ip = ref('localhost')
const mode = ref<displaymode>('quartet')
const r1 = ref(1)
const r2 = ref(2)
const r3 = ref(3)
const r4 = ref(4)
const refs = [r1, r2, r3, r4]
let socket: WebSocket
onMounted(() => connect())

const onModeChange = () => {
  socket.send(JSON.stringify({ type: 'mode', data: mode.value }))
}

const onIpChange = () => {
  connect()
}

const resetLaps = (laps) => {
  if (!socket) {
    // Show error
  }
  refs.forEach((r) => (r.value = laps))
  socket.send(JSON.stringify({ type: 'laps', data: refs.map((r) => r.value) }))
}

const up = (which) => set(which, 1)

const down = (which) => set(which, -1)

const set = (which, dir) => {
  refs[0].value = Math.max(0, refs[0].value + dir)
  socket.send(JSON.stringify({ type: 'laps', data: refs.map((r) => r.value) }))
}

const connect = () => {
  if (socket) {
    socket.close()
  }
  socket = new WebSocket(`ws://${ip.value}:3030`)
  socket.onmessage = (evt) => {
    const data = JSON.parse(evt.data)
    console.log('onmessage', data)
    switch (data.type) {
      case 'ip':
        socket.send(JSON.stringify({ type: 'connection', data: 'server' }))
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
}
</script>
<template>
  <div class="settings">
    <h1 class="is-size-1">Rondebord bediening</h1>
    <div class="columns">
      <div class="column">
        <section class="box">
          <h2 class="is-size-2">Reset naar</h2>
          <button class="button is-medium is-fullwidth" @click="resetLaps(1)">500m</button>
          <button class="button is-medium is-fullwidth" @click="resetLaps(1)">700m</button>
          <button class="button is-medium is-fullwidth" @click="resetLaps(2)">1000m</button>
          <button class="button is-medium is-fullwidth" @click="resetLaps(3)">1500m</button>
          <button class="button is-medium is-fullwidth" @click="resetLaps(7)">3000m</button>
          <button class="button is-medium is-fullwidth" @click="resetLaps(12)">5000m</button>
          <button class="button is-medium is-fullwidth" @click="resetLaps(25)">10000m</button>
        </section>
        <section class="box">
          <h2 class="is-size-2">Modus</h2>
          <div class="control">
            <div class="field">
              <label class="radio">
                <input
                  type="radio"
                  name="mode"
                  value="single"
                  v-model="mode"
                  @change="onModeChange"
                />
                Enkel (marathon e.d.)
              </label>
            </div>
            <div class="field">
              <label class="radio">
                <input
                  type="radio"
                  name="mode"
                  value="pair"
                  v-model="mode"
                  @change="onModeChange"
                />
                Enkele paren
              </label>
              <div class="field"></div>
              <label class="radio">
                <input
                  type="radio"
                  name="mode"
                  value="quartet-simple"
                  v-model="mode"
                  @change="onModeChange"
                />
                Kwartet - 2 invoeren
              </label>
              <div class="field"></div>
              <label class="radio">
                <input
                  type="radio"
                  name="mode"
                  value="quartet"
                  v-model="mode"
                  @change="onModeChange"
                />
                Kwartet - 4 invoeren
              </label>
            </div>
          </div>
        </section>
        <section class="box">
          <h2 class="is-size-2">Instellingen</h2>
          <div class="field">
            <label class="label">IP Adres</label>
            <div class="control">
              <input class="input" type="text" placeholder="IP adres" v-model.trim="ip" />
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-link" @click="onIpChange">(Opnieuw) verbinden</button>
            </div>
          </div>
        </section>
      </div>
      <div class="column is-four-fifths">
        <section class="box">
          <h2 class="is-size-2">Rondes</h2>
          <div class="grid-container">
            <main class="grid grid--server" :class="`is-${mode}`">
              <div class="p-6 ronde ronde--1">
                <button @click="up(0)">
                  <span class="icon">
                    <i class="fas fa-arrow-right"></i>
                  </span>
                </button>
                <input class="input is-large is-rounded has-text-centered" v-model="r1" />

                <button @click="down(0)">
                  <span class="icon">
                    <i class="fas fa-arrow-right"></i>
                  </span>
                </button>
              </div>
              <div class="p-6 ronde ronde--2">
                <input class="input is-large is-rounded has-text-centered" v-model="r2" />
              </div>
              <div class="p-6 ronde ronde--3">
                <input class="input is-large is-rounded has-text-centered" v-model="r3" />
              </div>
              <div class="p-6 ronde ronde--4">
                <input class="input is-large is-rounded has-text-centered" v-model="r4" />
              </div>
            </main>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
