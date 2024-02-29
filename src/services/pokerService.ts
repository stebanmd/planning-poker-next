import { Player, Room } from '@/models/types';

type BaseResponse = {
  data?: Player | Room;
  error?: string;
};

const players: Player[] = [];
const rooms: Room[] = [];

export const createRoom = (roomId: string, roomName: string): BaseResponse => {
  const newRoom: Room = {
    id: roomId,
    name: roomName,
    running: true,
  };

  rooms.push(newRoom);
  return { data: newRoom };
};

export const removeRoom = (id: string): Room | undefined => {
  const index = rooms.findIndex((r) => r.id === id);
  if (index !== -1) return rooms.splice(index, 1)[0];
};

export const getRoom = (roomId: string): Room | undefined => {
  const room = rooms.find((r) => r.id == roomId);
  return room;
};

export const addPlayer = (playerId: string, name: string, roomId: string, spectator: boolean): BaseResponse => {
  const existingPlayer = players.find((p) => p.id === playerId);
  if (existingPlayer) return { error: 'There was an error in our server, please refresh the page and try again' };

  if (!name || !roomId) return { error: 'Username and room are required' };

  let room = rooms.find((r) => r.id === roomId);
  if (!room) {
    room = createRoom(roomId, 'New room').data as Room;
  }

  const player = {
    id: playerId,
    name,
    room,
    spectator,
  };
  players.push(player);

  return { data: player };
};

export const getPlayer = (playerId: string): Player | undefined => {
  const player = players.find((p) => p.id == playerId);
  return player;
};

export const removePlayer = (playerId: string): Player | undefined => {
  const index = players.findIndex((p) => p.id === playerId);
  if (index !== -1) return players.splice(index, 1)[0];
};

export const getPlayers = (roomId: string): Player[] => {
  return players.filter((p) => p.room.id === roomId);
};

export const updatePlayerCard = (player: Player, card?: string): boolean => {
  const index = players.indexOf(player);
  players[index].card = card;
  return true;
};

export const finishGame = (roomId: string): void => {
  const index = rooms.findIndex((x) => x.id === roomId);
  if (index >= 0) {
    rooms[index].running = false;
  }
};

export const restartGame = (roomId: string): void => {
  const index = rooms.findIndex((x) => x.id === roomId);
  if (index >= 0) {
    rooms[index].running = true;

    for (let i = 0; i < players.length; i++) {
      if (players[i].room.id === roomId) {
        players[i].card = undefined;
      }
    }
  }
};
