import { Player, Room } from '@/models/types';

type JoinResponse = {
  user?: Player;
  error?: string;
};

const players: Player[] = [];
const rooms: Room[] = [];

export const addPlayer = (id: string, name: string, room: string): JoinResponse => {
  const existingUser = players.find((user) => user.name.trim().toLowerCase() === name.trim().toLowerCase());

  if (existingUser) return { error: 'Username has already been taken' };
  if (!name && !room) return { error: 'Username and room are required' };
  if (!name) return { error: 'Username is required' };
  if (!room) return { error: 'Room is required' };

  const existingRoom = rooms.find((r) => r.id === room)
  if (!existingRoom) {
    rooms.push({
      id: room,
      name: room,
      running: true
    })
  }

  const user = { id, name, room };  
  players.push(user);

  return { user };
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
  return players.filter((user) => user.room === room);
}

export const updatePlayerCard = (player: Player, card?: string): boolean => {
  const index = players.indexOf(player)
  players[index].card = card;
  return true
}

export const finishGame = (room: string): void => {
  const index = rooms.findIndex(x => x.id === room)
  if (index >= 0) {
    rooms[index].running = false;
  }
}

export const restartGame = (room: string): void => {
  const index = rooms.findIndex(x => x.id === room)
  if (index >= 0) {
    rooms[index].running = true;

    for(let i = 0; i < players.length; i++) {
      if (players[i].room === room) {
        players[i].card = undefined
      }
    }    
  }
}
