<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { usePlayersStore } from '@/stores/players'
import { useBoardStore } from '@/stores/board'

import EndDialog from '@/components/EndDialog.vue'
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

      <button class="button button__menu" @click="switchButtonMenu()">
        Menu<span class="sr-only">opens the menu dialog box</span>
      </button>
      <div>
        <RouterLink
          :to="{
            name: 'gamePage',
            query: { theme: board.theme, players: players.countPlayers, size: board.size },
          }"
          class="link__menu button__menu"
          @click="resetBoard"
        >
          Restart
          <span class="sr-only">creates a new game with the same game settings</span>
        </RouterLink>

        <RouterLink
          :to="{ name: 'startPage' }"
          class="link__menu button__menu button__new-game"
          @click="resetGame"
        >
          New Game<span class="sr-only">returns to the start page</span>
        </RouterLink>
      </div>
    </header>
    <section class="section section__board" :class="`grid${board.size}`">
      <button
        v-for="button in board.buttons"
        @click="!button.open && board.pressedButton(button.index)"
        :class="{ found: button.found, open: button.open }"
        :disabled="board.phase === 'pairing'"
      >
        <p v-if="board.theme === 'numbers' && button.open">
          {{ button.pairId }}
        </p>
        <img
          v-if="board.theme === 'icons' && button.open"
          :src="icons[`${button.icon}`]!.default"
        />
        <span class="sr-only">{{
          `row ${button.row}, column ${button.col} ${button.open ? 'is open and showing numer: ' + button.pairId + '.' : 'is closed, click to open'} ${button.found ? `The pair for this is in ${board.getPair(button)}` : ''} ${button.open && !button.found ? 'Go find its pair.' : ''}`
        }}</span>
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
@use '@/styles/main.scss' as v;

main {
  min-height: 100%;
  background-color: hsl(var(--white));

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: v.$spacing-0300;
}

dialog {
  min-height: 100%;
  min-width: 100%;
  background-color: rgba(v.$black, 50%);

  align-items: center;

  padding: v.$spacing-0300;

  z-index: 1;
}

dialog[open] {
  display: grid;
}

button {
  border: none;
  padding: v.$spacing-0100;
  border-radius: 9em;
  cursor: pointer;
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

.button__menu {
  color: rgba(v.$white, 100%);
  font-size: v.$fsize-10;
  background-color: rgba(v.$orange-400, 100%);
  padding-inline: v.$spacing-0200;
}

.button__new-game {
  white-space: nowrap;
  background-color: rgba(v.$blue-100, 100%);
  color: rgba(v.$blue-950, 100%);
}

.section__board {
  width: 100%;
  max-width: 544px;

  align-self: center;

  display: grid;
  align-items: start;
  gap: v.$spacing-0100;

  padding-bottom: v.$spacing-0600;
}

.section__board button {
  aspect-ratio: 1;
  background-color: v.$blue-800;

  display: grid;
  place-content: center;

  border-radius: 50%;
}

.section__board button:focus-visible {
  outline: 4px rgba(v.$orange-400, 100%) solid;
}

.section__board p {
  color: rgba(v.$grey-050, 100%);
  font-size: v.$fsize-07;
}

.section__board button img {
  width: 35px;
  filter: brightness(0) invert(1);
}

.section__board button:hover {
  background-color: rgba(v.$blue-350, 100%);
}

.section__board button.open {
  background-color: rgba(v.$orange-300, 100%);
  cursor: default;
}

.section__board button.found {
  background-color: rgba(v.$blue-300, 100%);
  cursor: default;
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
  gap: v.$spacing-0300;
  justify-content: center;

  min-width: 100%;
}

.section__players div {
  flex: 1;
  text-align: center;

  background-color: rgba(v.$blue-100, 100%);
  max-width: 255px;

  padding: v.$spacing-0100;

  border-radius: 5px;

  article {
    color: rgba(v.$blue-400, 100%);
    font-size: v.$fsize-11;
  }

  p {
    color: rgba(v.$blue-800, 100%);
    font-size: v.$fsize-07;
  }
}

.section__players .playing {
  background-color: rgba(v.$orange-400, 100%);

  position: relative;

  article {
    color: rgba(v.$white, 100%);
  }

  p {
    color: rgba(v.$white, 100%);
  }

  ::before {
    content: '';
    height: 16px;
    aspect-ratio: 1;
    background-color: rgba(v.$orange-400, 100%);

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
  header > button {
    display: none;
  }

  header div {
    display: flex;
    gap: v.$spacing-0200;
  }

  .section__board p {
    font-size: v.$fsize-01;
  }

  .section__players.multiplayer div {
    text-align: start;
    padding: v.$spacing-0200;
  }

  .section__players.solo div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: v.$spacing-0200;
  }

  .button__menu {
    font-size: v.$fsize-08;
  }
}

@media (min-width: f.em(1000)) {
  .section__board button img {
    width: v.$fsize-01;
  }

  .section__players.multiplayer div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .section__players div article {
    font-size: v.$fsize-09;
  }

  .section__players div p {
    font-size: v.$fsize-05;
  }

  .section__players {
    margin-bottom: v.$spacing-0200;
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
