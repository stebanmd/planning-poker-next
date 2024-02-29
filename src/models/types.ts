export type Player = {
  id: string
  name: string
  room: Room
  card?: string
  spectator: boolean
}

export type Room = {
  id: string
  name: string
  running: boolean
}