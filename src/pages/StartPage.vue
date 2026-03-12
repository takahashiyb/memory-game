<script lang="ts" setup>
import { useBoardStore } from '@/stores/board'
import { usePlayersStore } from '@/stores/players'
import { computed, ref } from 'vue'

const board = useBoardStore()
const players = usePlayersStore()

let boardTheme = ref<string>()
let playerCount = ref<number>()
let boardSize = ref<number>()

const isReady = computed(() => {
  if (boardTheme.value && playerCount.value && boardSize.value) {
    return true
  } else {
    return false
  }
})

// default
board.theme = 'numbers'
players.countPlayers = 0
board.size = 0

board.createButtons()
players.createPlayers()
</script>
<template>
  <main>
    <section class="section section__logo">
      <img src="/assets/icons/logo.svg" alt="logo" />
    </section>

    <div class="inputs">
      <section class="section section__input">
        <article>Select Theme</article>
        <div>
          <button :class="{ selected: boardTheme === 'numbers' }" @click="boardTheme = 'numbers'">
            Numbers
          </button>
          <button :class="{ selected: boardTheme === 'icons' }" @click="boardTheme = 'icons'">
            Icons
          </button>
        </div>
      </section>

      <section class="section section__input">
        <article>Number of Players</article>
        <div>
          <button :class="{ selected: playerCount === 1 }" @click="playerCount = 1">1</button>
          <button :class="{ selected: playerCount === 2 }" @click="playerCount = 2">2</button>
          <button :class="{ selected: playerCount === 3 }" @click="playerCount = 3">3</button>
          <button :class="{ selected: playerCount === 4 }" @click="playerCount = 4">4</button>
        </div>
      </section>

      <section class="section section__input">
        <article>Grid Size</article>
        <div>
          <button :class="{ selected: boardSize === 4 }" @click="boardSize = 4">4 x 4</button>
          <button :class="{ selected: boardSize === 6 }" @click="boardSize = 6">6 x 6</button>
        </div>
      </section>

      <section class="section section__route">
        <RouterLink
          :to="{
            name: 'gamePage',
            query: { theme: boardTheme, players: playerCount, size: boardSize },
          }"
          :disabled="!isReady"
          class="button__link"
          :class="{ ready: isReady }"
          >Start Game</RouterLink
        >
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use '@/styles/_functions.scss' as f;
@use '@/styles/main.scss' as v;

main {
  min-height: 100%;
  background-color: rgba(v.$blue-950, 100%);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: v.$spacing-0600;

  padding: v.$spacing-0300;
}

img {
  filter: brightness(100);
}

.inputs {
  display: flex;
  flex-direction: column;
  gap: v.$spacing-0300;

  background-color: rgba(v.$grey-050, 100%);
  width: 100%;
  max-width: 654px;
  padding: v.$spacing-0300;
  border-radius: 10px;
}

.section__logo {
  align-self: center;
}

.section div {
  display: flex;
  gap: 8px;
}

.section article {
  color: rgba(v.$blue-400, 100%);
  padding-bottom: v.$spacing-0100;
  font-size: v.$fsize-11;
}

.section button,
.button__link {
  background-color: rgba(v.$blue-400, 100%);
  color: rgba(v.$grey-050, 100%);
  width: 100%;
  height: v.$spacing-0500;
  border: none;
  border-radius: 9em;
  font-size: v.$fsize-10;
  cursor: pointer;
}

.button__link {
  display: grid;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background-color: rgba(v.$blue-300, 100%);
  cursor: default;
}

@media (min-width: f.em(700)) {
  .section article {
    font-size: v.$fsize-06;
  }
  .section button,
  .button__link {
    font-size: v.$fsize-05;
  }
}

.section button:hover {
  background-color: rgba(v.$blue-350, 100%);
}

.section button.selected {
  background-color: rgba(v.$blue-800, 100%);
}

.section__route .button__link.ready {
  background-color: rgba(v.$orange-400, 100%);
  cursor: pointer;
}

.section__route .button__link.ready:hover {
  background-color: rgba(v.$orange-300, 100%);
}
</style>
