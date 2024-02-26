'use client';

import { Player } from '@/models/types';
import { createContext, useContext, useState } from 'react';

type MainContextType = {
  player?: Player;
  setPlayer: (val: Player) => void;
};

const MainContext = createContext<MainContextType>({
  setPlayer: () => {},
});

export const useMainContext = () => {
  return useContext(MainContext);
};

export const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const [player, setPlayer] = useState<Player | undefined>(undefined);  

  return <MainContext.Provider value={{ player, setPlayer }}>{children}</MainContext.Provider>;
};
