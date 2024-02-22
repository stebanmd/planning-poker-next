'use client';

import { Player } from '@/models/types';
import { createContext, useContext, useState } from 'react';

type PlayersContextType = {
  players: Player[]
  setPlayers: (val: any[]) => void
}

const PlayersContext = createContext<PlayersContextType>({
  players: [],
  setPlayers: () => {}
});

export const usePlayersContext = () => {
  return useContext(PlayersContext);
} 

export const PlayersProvider = ({ children }: { children: React.ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>([]);

  return (
    <PlayersContext.Provider value={{ players, setPlayers }}>
      {children}
    </PlayersContext.Provider>
  );
};

