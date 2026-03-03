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
    >
      <button class="button__menu" @click="resetBoard">Restart</button>
    </RouterLink>
    <RouterLink :to="{ name: 'startPage' }">
      <button class="button__menu" @click="resetGame">New Game</button>
    </RouterLink>
    <button class="button__menu" @click="$emit('closeDialog')">Resume Game</button>
  </section>
</template>
<style scoped lang="scss">
@import '@/styles/main.scss';

.section__menu {
  background-color: rgba($white, 100%);

  display: grid;
  row-gap: $spacing-0200;

  padding: $spacing-0300;

  border-radius: 10px;
}
</style>
