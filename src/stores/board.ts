import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePlayersStore } from './players'
import type { Button, Player } from '@/types/types'

export const useBoardStore = defineStore('board', () => {
  const players = usePlayersStore()

  const phases = ['idle', 'peeking', 'pairing']
  const buttons = ref<Button[]>([])

  const phase = ref('idle')
  const theme = ref('')
  const size = ref(0)
  const moves = ref(0)
  const time = ref('0:00')

  let peeked = ref()
  let paired = ref()

  let interval: ReturnType<typeof setInterval> | null = null

  const finished = ref<boolean>(false)

  function changeTheme(newTheme: string) {
    theme.value = newTheme
  }

  function startTimer() {
    const start = Date.now()

    interval = setInterval(() => {
      const totalSeconds = Math.floor((Date.now() - start) / 1000)

      const minutes = Math.floor(totalSeconds / 60)
      const seconds = (totalSeconds % 60).toString().padStart(2, '0')

      time.value = minutes + ':' + seconds
    }, 1000)
  }

  function stopTimer() {
    if (interval) {
      clearInterval(interval)
      interval = null // back to "no timer"
    }
  }

  function resetTimer() {
    stopTimer()
    time.value = '0:00'
  }

  function switchPhase() {
    const phaseIndex = phases.indexOf(phase.value, 0)

    const nextPhase = phases.length !== phaseIndex + 1 ? phases[phaseIndex + 1] : phases[0]

    phase.value = nextPhase as string
  }

  function checkTurn() {
    const player = players.players.find((player) => player.turn === 1)

    if (peeked.value.pairId === paired.value.pairId && player) {
      peeked.value.open = true
      paired.value.open = true
      peeked.value.found = true
      paired.value.found = true
      player.points++
    }
    if (peeked.value.pairId !== paired.value.pairId && player) {
      players.switchPlayer()
      peeked.value.open = false
      paired.value.open = false
    }

    peeked.value = ''
    paired.value = ''
    moves.value++
  }

  function createButtons() {
    if (!size.value || size.value === 0) {
      buttons.value = []
    }

    if (buttons.value.length > 0) {
      return
    }

    const randomizer: number[] = randomPairs()

    let count = 0
    for (let row = 0; row < size.value; row++) {
      for (let col = 0; col < size.value; col++) {
        buttons.value.push({
          name: 'button' + count,
          index: count,
          pairId: randomizer[count]!,
          row: row,
          col: col,
          colRow: row + 'x' + col,
          icon: '/assets/icons/game-icon' + randomizer[count]! + '.svg',
          open: false,
          found: false,
        })
        count++
      }
    }
  }

  function randomPairs() {
    const buttonCount = size.value * size.value

    let buttonArray = []

    for (let i = 0; i < buttonCount; i++) {
      buttonArray.push({ index: i, pair: Math.floor(i / 2), rand: Math.random() })
    }

    buttonArray.sort((a, b) => a.rand - b.rand)

    return buttonArray.map((button) => button.pair) as number[]
  }

  function changePeeked(index: number) {
    const button = buttons.value.find((button) => button.index === index)
    if (button) {
      peeked.value = button
      button.open = true
    }
  }

  function changePaired(index: number) {
    const button = buttons.value.find((button) => button.index === index)
    if (button) {
      paired.value = button
      button.open = true
    }
  }

  async function pressedButton(index: number) {
    if (phase.value === 'idle') {
      changePeeked(index)
    }
    if (phase.value === 'peeking') {
      changePaired(index)
      switchPhase()

      await new Promise((resolve) => setTimeout(resolve, 1000))

      checkTurn()
    }
    switchPhase()

    checkFinish()
  }

  function checkFinish() {
    const countFound = buttons.value.filter((button) => button.found === false).length

    if (countFound === 0) {
      finished.value = true
      stopTimer()
      checkWinners()
    }
  }

  function checkWinners() {
    const list = players.players

    const maxPoints = list.reduce((max, current) => (current.points > max.points ? current : max))

    for (let i = 0; i < list.length; i++) {
      const currentPlayer = list[i] as Player

      if (currentPlayer.points === maxPoints.points) {
        currentPlayer.isWinner = true
      }
    }
  }

  function resetSettings() {
    buttons.value = []

    theme.value = ''
    size.value = 0
    moves.value = 0
    time.value = '0:00'
    resetTimer()

    finished.value = false
  }

  function resetBoard() {
    buttons.value = []
    createButtons()
    moves.value = 0
    if (players.countPlayers === 1) {
      resetTimer()
      startTimer()
    }
    finished.value = false
  }

  return {
    phase,
    theme,
    size,
    moves,
    time,
    peeked,
    paired,
    startTimer,
    resetTimer,
    changeTheme,
    buttons,
    createButtons,
    pressedButton,
    finished,
    resetSettings,
    resetBoard,
  }
})
