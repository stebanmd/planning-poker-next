'use client';

import { createContext, useContext, useState } from 'react';

type MainContextType = {
  name?: string;
  room?: string;
  setName: (val: string) => void;
  setRoom: (val: string) => void;
};

const MainContext = createContext<MainContextType>({
  setName: () => {},
  setRoom: () => {},
});

export const useMainContext = () => {
  return useContext(MainContext);
};

export const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  return <MainContext.Provider value={{ name, room, setName, setRoom }}>{children}</MainContext.Provider>;
};
