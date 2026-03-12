<script lang="ts" setup>
import { usePlayersStore } from '@/stores/players'

import { useBoardStore } from '@/stores/board'

import { useRoute } from 'vue-router'
import EndDialog from '@/components/EndDialog.vue'
import { ref, onMounted } from 'vue'
import MenuDialog from '@/components/MenuDialog.vue'

const icons = import.meta.glob('@/assets/icons/*.svg', { eager: true }) as Record<
  string,
  { default: string }
>

const board = useBoardStore()

const players = usePlayersStore()

const route = useRoute()

board.theme = route.query.theme as string
players.countPlayers = Number(route.query.players)
board.size = Number(route.query.size)

board.createButtons()

players.createPlayers()

const isDesktop = ref(false)

onMounted(() => {
  board.resetTimer()
  if (players.countPlayers === 1) {
    board.startTimer()
  }

  const mq = window.matchMedia('(min-width: 43.75em)')
  isDesktop.value = mq.matches
  mq.addEventListener('change', (e) => (isDesktop.value = e.matches))
})

const isOpenMenu = ref<boolean>(false)

function switchButtonMenu() {
  isOpenMenu.value ? (isOpenMenu.value = false) : (isOpenMenu.value = true)
}

function resetGame() {
  board.resetSettings()
  players.resetSettings()
}

function resetBoard() {
  board.resetBoard()
  players.resetBoard()
}
</script>
<template>
  <dialog :open="board.finished || isOpenMenu">
    <EndDialog v-if="board.finished" />
    <MenuDialog v-if="isOpenMenu" @closeDialog="switchButtonMenu()" />
  </dialog>
  <main>
    <header>
      <img src="/assets/icons/logo.svg" alt="logo" />

      <button class="button button__menu" @click="switchButtonMenu()">Menu</button>
      <div>
        <RouterLink
          :to="{
            name: 'gamePage',
            query: { theme: board.theme, players: players.countPlayers, size: board.size },
          }"
        >
          <button class="button__menu" @click="resetBoard">Restart</button>
        </RouterLink>

        <RouterLink :to="{ name: 'startPage' }">
          <button class="button__menu button__new-game" @click="resetGame">New Game</button>
        </RouterLink>
      </div>
    </header>
    <section class="section section__board" :class="`grid${board.size}`">
      <button
        v-for="button in board.buttons"
        @click="board.pressedButton(button.index)"
        :class="{ found: button.found, open: button.open }"
        :disabled="board.phase === 'pairing' || button.open"
      >
        <p v-if="board.theme === 'numbers' && button.open">
          {{ button.pairId }}
        </p>
        <img
          v-if="board.theme === 'icons' && button.open"
          :src="icons[`${button.icon}`]!.default"
        />
      </button>
    </section>
    <section class="section section__players multiplayer" v-if="players.countPlayers > 1">
      <div v-for="player in players.players" :class="{ playing: player.turn }">
        <article v-if="isDesktop">{{ player.name }}</article>
        <article v-else>{{ player.nickname }}</article>
        <p>{{ player.points }}</p>
      </div>
    </section>
    <section v-else class="section section__players solo">
      <div>
        <article>Time</article>
        <p>{{ board.time }}</p>
      </div>
      <div>
        <article>Moves</article>
        <p>{{ board.moves }}</p>
      </div>
    </section>
  </main>
</template>
<style scoped lang="scss">
@use '@/styles/_functions' as f;
@import '@/styles/main.scss';

main {
  min-height: 100%;
  background-color: hsl(var(--white));

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: $spacing-0300;
}

dialog {
  min-height: 100%;
  min-width: 100%;
  background-color: rgba($black, 50%);

  align-items: center;

  padding: $spacing-0300;

  z-index: 1;
}

dialog[open] {
  display: grid;
}

button {
  border: none;
  padding: $spacing-0100;
  border-radius: 9em;
}

header {
  width: 100%;
  max-width: 1110px;

  align-self: center;

  display: grid;
  grid-template-columns: repeat(2, min-content);
  align-items: center;
  justify-content: space-between;
}

header > button {
  display: block;
}

header div {
  display: none;
}

@media (min-width: f.em(700)) {
  header > button {
    display: none;
  }
  header div {
    display: flex;
    gap: $spacing-0200;
  }
}

.button__menu {
  color: rgba($white, 100%);
  font-size: $fsize-10;
  background-color: rgba($orange-400, 100%);
  padding-inline: $spacing-0200;
}

.button__new-game {
  white-space: nowrap;
  background-color: rgba($blue-100, 100%);
  color: rgba($blue-950, 100%);
}

.section__board {
  width: 100%;
  max-width: 544px;

  align-self: center;

  display: grid;
  align-items: start;
  gap: $spacing-0100;

  padding-bottom: $spacing-0600;
}

.section__board button {
  aspect-ratio: 1;
  background-color: $blue-800;

  display: grid;
  place-content: center;

  border-radius: 50%;
}

.section__board p {
  color: rgba($grey-050, 100%);
  font-size: $fsize-07;
}

@media (min-width: f.em(700)) {
  .section__board p {
    font-size: $fsize-01;
  }
}

.section__board button img {
  width: 35px;
  filter: brightness(0) invert(1);
}

@media (min-width: f.em(700)) {
  .section__board button img {
    width: $fsize-01;
  }
}

.section__board button:hover {
  background-color: rgba($blue-350, 100%);
}

.section__board button.open {
  background-color: rgba($orange-300, 100%);
}

.section__board button.found {
  background-color: rgba($blue-300, 100%);
}

.section__board.grid4 {
  grid-template-columns: repeat(4, 1fr);
}

.section__board.grid6 {
  grid-template-columns: repeat(6, 1fr);
}

.section__players {
  display: flex;
  align-items: flex-end;
  gap: $spacing-0300;
  justify-content: center;

  min-width: 100%;
}

.section__players div {
  flex: 1;
  text-align: center;

  background-color: rgba($blue-100, 100%);
  max-width: 255px;

  padding: $spacing-0100;

  border-radius: 5px;

  article {
    color: rgba($blue-400, 100%);
    font-size: $fsize-11;
  }

  p {
    color: rgba($blue-800, 100%);
    font-size: $fsize-07;
  }
}

@media (min-width: f.em(700)) {
  .section__players.multiplayer div {
    text-align: start;
    padding: $spacing-0200;
  }

  .section__players.solo div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-0200;
  }
}

@media (min-width: f.em(1000)) {
  .section__players.multiplayer div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .section__players div article {
    font-size: $fsize-09;
  }

  .section__players div p {
    font-size: $fsize-05;
  }
}

.section__players .playing {
  background-color: rgba($orange-400, 100%);

  position: relative;

  article {
    color: rgba($white, 100%);
  }

  p {
    color: rgba($white, 100%);
  }

  ::before {
    content: '';
    height: 16px;
    aspect-ratio: 1;
    background-color: rgba($orange-400, 100%);

    position: absolute;
    top: 0;
    left: 50%;
    translate: -50% -50%;
    rotate: 45deg;
  }

  .button__menu {
    border: solid black 4px;
  }
}

@media (min-width: f.em(700)) {
  .button__menu {
    font-size: $fsize-08;
  }
}

@media (min-width: f.em(1000)) {
  .section__players {
    margin-bottom: $spacing-0200;
  }

  .section__players .playing::after {
    content: 'CURRENT TURN';
    white-space: nowrap;
    height: 16px;
    aspect-ratio: 1;

    position: absolute;
    bottom: 0;
    left: 50%;
    translate: -50% 150%;
  }
}
</style>
