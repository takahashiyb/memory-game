export interface Player {
  name: string
  nickname: string
  index: number
  points: number
  turn: number
  isWinner: boolean
}

export interface Button {
  name: string
  index: number
  pairId: number
  row: number
  col: number
  colRow: string
  icon: string
  open: boolean
  found: boolean
}
