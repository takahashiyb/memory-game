import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Player } from '@/types/types'

export const usePlayersStore = defineStore('players', () => {
  const countPlayers = ref(0)

  const players = ref<Player[]>([])

  const isLoaded = ref(0)

  function createPlayers() {
    if (!countPlayers.value || countPlayers.value === 0) {
      players.value = []
    }

    if (players.value.length > 0) {
      return
    }

    for (let i = 1; i <= countPlayers.value; i++) {
      players.value.push({
        name: 'Player ' + i,
        nickname: 'P' + i,
        index: i - 1,
        points: 0,
        turn: i === 1 ? 1 : 0,
        isWinner: false,
      })
    }
    isLoaded.value = 1
  }

  function switchPlayer() {
    const playerCurrent = players.value.find((player) => player.turn === 1)

    if (playerCurrent) {
      const nextPlayer =
        players.value.length !== playerCurrent.index + 1
          ? (players.value[playerCurrent.index + 1] as Player)
          : (players.value[0] as Player)

      playerCurrent.turn = 0
      nextPlayer.turn = 1
    }
  }

  function resetSettings() {
    players.value = []
    countPlayers.value = 0
  }

  function resetBoard() {
    players.value = []
    createPlayers()
  }

  return { countPlayers, players, isLoaded, createPlayers, switchPlayer, resetSettings, resetBoard }
})
