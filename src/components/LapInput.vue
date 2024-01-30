<script lang="ts" setup>
const model = defineModel({ type: Number, default: 0 })

const up = () => {
  model.value = model.value + 1
}
const down = () => {
  model.value = Math.max(0, model.value - 1)
}
</script>

<template>
  <div class="p-6 is-flex-direction-column is-justify-content-center">
    <button class="button is-size-4" @click="up()">
      <font-awesome-icon icon="fa-solid fa-arrow-up" />
    </button>
    <input class="input is-large is-rounded has-text-centered my-6" v-model="model" />

    <button class="button is-size-4" @click="down()">
      <font-awesome-icon icon="fa-solid fa-arrow-down" />
    </button>
  </div>
</template>

<style scoped></style>
