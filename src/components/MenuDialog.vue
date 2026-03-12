<script setup lang="ts">
import { useBoardStore } from '@/stores/board'
import { usePlayersStore } from '@/stores/players'

const board = useBoardStore()
const players = usePlayersStore()

const emit = defineEmits(['closeDialog'])

function resetGame() {
  board.resetSettings()
  players.resetSettings()
}

function resetBoard() {
  board.resetBoard()
  players.resetBoard()
  emit('closeDialog')
}
</script>
<template>
  <section class="dialog section__menu">
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
    <RouterLink :to="{ name: 'startPage' }" class="link__menu button__menu" @click="resetGame">
      New Game<span class="sr-only">returns to the start page</span>
    </RouterLink>
    <button class="button__menu" @click="$emit('closeDialog')">
      Resume Game<span class="sr-only">returns to the game screen</span>
    </button>
  </section>
</template>
<style scoped lang="scss">
@use '@/styles/main.scss' as v;

.section__menu {
  background-color: rgba(v.$white, 100%);

  display: grid;
  row-gap: v.$spacing-0200;

  padding: v.$spacing-0300;

  border-radius: 10px;
}
</style>
