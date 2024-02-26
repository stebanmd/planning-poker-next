export type Player = {
  id: string
  name: string
  room: Room
  card?: string
}

export type Room = {
  id: string
  name: string
  running: boolean
}