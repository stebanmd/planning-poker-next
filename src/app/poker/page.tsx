'use client';

import { useMainContext } from '@/components/providers/main-provider';
import { usePlayersContext } from '@/components/providers/players-provider';
import { useSocket } from '@/components/providers/socket-provider';
import GameCard from '@/components/ui/game-card';
import PlayerBox from '@/components/ui/player-box';
import { SocketIndicator } from '@/components/ui/socket-indicator';
import { Box, Button, Spinner, Stack } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Poker() {
  const { player } = useMainContext();
  const { socket } = useSocket();

  const { players } = usePlayersContext();
  const [selectedCard, setSelectedCard] = useState<string | undefined>(undefined);

  const [running, setRunning] = useState<boolean>(!!player?.room.running);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const search = useSearchParams();

  const roomId = search?.get('r');

  useEffect(() => {
    if (!player) {
      router.replace(`/login?wr=${roomId}`);
    }
    setLoading(false);
  }, [player, router, roomId]);

  useEffect(() => {
    if (socket) {
      socket.on('reveal', () => {
        setRunning(false);
      });

      socket.on('restart', () => {
        setRunning(true);
        setSelectedCard(undefined);
      });

      return () => {
        socket.off('reveal');
        socket.off('restart');
      };
    }
  }, [socket]);

  const handleSelectCard = (card: string) => {
    const newCard = card === selectedCard ? undefined : card;

    socket.emit('select-card', newCard);
    setSelectedCard(newCard);
  };

  const handleRevealCards = () => {
    socket.emit('reveal-cards');
  };

  const handleRestart = () => {
    socket.emit('restart-game');
  };

  const cards = ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '☕', '?'];

  if (loading) {
    return <Spinner />;
  }
  return (
    <Stack direction={'column'} gap={'2rem'} margin={'10rem'}>
      <Stack direction={'row'}>
        <h1>Poker table</h1>
        <SocketIndicator />
      </Stack>
      {running ? (
        <Button onClick={() => handleRevealCards()}>Reveal Cards</Button>
      ) : (
        <Button onClick={() => handleRestart()}>Restart</Button>
      )}

      <Stack direction={'row'} gap={'.5rem'}>
        {players.map((player) => (
          <PlayerBox key={player.id} player={player} running={running} />
        ))}
      </Stack>

      <Box>
        <h2>Select your card</h2>
        <Stack direction={'row'} gap={'.5rem'}>
          {cards.map((card) => (
            <GameCard key={card} onSelect={handleSelectCard} selected={selectedCard === card} value={card} />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
