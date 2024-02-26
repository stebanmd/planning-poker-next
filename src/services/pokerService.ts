import { Player, Room } from '@/models/types';
import { ulid } from 'ulid';

type BaseResponse = {
  data?: Player | Room;
  error?: string;
};

const players: Player[] = [];
const rooms: Room[] = [];

export const createRoom = (roomName: string): BaseResponse => {
  const existingRoom = rooms.find((r) => r.name.trim().toLowerCase() === roomName.trim().toLowerCase())
  if (existingRoom) return { error: 'Room already exists' }

  const newRoom: Room = {
    id: ulid(),
    name: roomName,
    running: true,
  }

  rooms.push(newRoom)
  return { data: newRoom }
}

export const removeRoom = (id: string): Room | undefined => {
  const index = rooms.findIndex((r) => r.id === id);
  if (index !== -1) return rooms.splice(index, 1)[0];
};

export const addPlayer = (id: string, name: string, room: string): BaseResponse => {
  const existingUser = players.find((user) => user.name.trim().toLowerCase() === name.trim().toLowerCase());

  if (existingUser) return { error: 'Username has already been taken' };
  if (!name || !room) return { error: 'Username and room are required' };

  let existingRoom = rooms.find((r) => r.id === room);
  if (!existingRoom) {
    return { error: 'Room not found' }
  }

  const user = {
    id,
    name,
    room: existingRoom,
  };
  players.push(user);

  return { data: user };
};

export const getPlayer = (id: string): Player | undefined => {
  const user = players.find((user) => user.id == id);
  return user;
};

export const removePlayer = (id: string): Player | undefined => {
  const index = players.findIndex((user) => user.id === id);
  if (index !== -1) return players.splice(index, 1)[0];
};

export const getPlayers = (room: string): Player[] => {
  return players.filter((user) => user.room.id === room);
};

export const updatePlayerCard = (player: Player, card?: string): boolean => {
  const index = players.indexOf(player);
  players[index].card = card;
  return true;
};

export const finishGame = (room: string): void => {
  const index = rooms.findIndex((x) => x.id === room);
  if (index >= 0) {
    rooms[index].running = false;
  }
};

export const restartGame = (room: string): void => {
  const index = rooms.findIndex((x) => x.id === room);
  if (index >= 0) {
    rooms[index].running = true;

    for (let i = 0; i < players.length; i++) {
      if (players[i].room.id === room) {
        players[i].card = undefined;
      }
    }
  }
};
