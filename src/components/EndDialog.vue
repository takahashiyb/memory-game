<script lang="ts" setup>
import { useBoardStore } from '@/stores/board'
import { usePlayersStore } from '@/stores/players.ts'
import type { Player } from '@/types/types'

const players = usePlayersStore()
const board = useBoardStore()

const playerList = players.players as Player[]

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
  <section class="dialog section__end">
    <section class="section__congrats">
      <article v-if="playerList.length === 1">You did it!</article>
      <article v-else-if="playerList.filter((player) => player.isWinner).length === 1">
        {{ (playerList.find((player) => player.isWinner) as Player).name }} Wins!
      </article>
      <article v-else-if="playerList.filter((player) => player.isWinner).length !== 1">
        It's a tie!
      </article>
      <p v-if="playerList.length === 1">Game over! Here’s how you got on…</p>
      <p v-else>Game over! Here are the results…</p>
    </section>

    <section class="stats" v-if="players.countPlayers === 1">
      <div>
        <article>Time Elapsed</article>
        <p>{{ board.time }}</p>
      </div>
      <div>
        <article>Moves Taken</article>
        <p>{{ board.moves }} Moves</p>
      </div>
    </section>
    <section class="stats" v-else>
      <div
        v-for="player in playerList.sort((a, b) => b.points - a.points)"
        :class="{ winner: player.isWinner }"
      >
        <article>{{ player.name }} {{ player.isWinner ? '(Winner!)' : '' }}</article>
        <p>{{ player.points }} Pair{{ player.points > 1 ? 's' : '' }}</p>
      </div>
    </section>

    <RouterLink
      :to="{
        name: 'gamePage',
        query: { theme: board.theme, players: players.countPlayers, size: board.size },
      }"
    >
      <button class="button__menu" @click="resetBoard">Restart</button>
    </RouterLink>

    <RouterLink :to="{ name: 'startPage' }">
      <button class="button__menu" @click="resetGame">Setup New Game</button>
    </RouterLink>
  </section>
</template>
<style lang="scss" scoped>
@import '@/styles/main.scss';

.section__end {
  background-color: rgba($grey-050, 100%);

  display: grid;
  row-gap: $spacing-0300;

  padding: $spacing-0300;

  border-radius: 10px;
}

div {
  background-color: rgba($blue-100, 100%);
}

.section__congrats {
  display: grid;
  gap: $spacing-0100;
}

.section__congrats article {
  font-size: $fsize-07;
  text-align: center;
  color: rgba($blue-950, 100%);
}

.section__congrats p {
  font-size: $fsize-12;
  text-align: center;
  color: rgba($blue-400, 100%);
}

.stats {
  display: grid;
  gap: $spacing-0100;
}

.stats div {
  padding: $spacing-0200;

  display: flex;
  justify-content: space-between;
  border-radius: 5px;
}

.stats div article {
  color: rgba($blue-400, 100%);
  font-size: $fsize-12;
}

.stats div p {
  color: rgba($blue-800, 100%);
  font-size: $fsize-08;
}

.stats .winner {
  background-color: rgba($blue-950, 100%);
}

.stats .winner article,
.stats .winner p {
  color: rgba($grey-050, 100%);
}
</style>
