'use client';

import { useMainContext } from '@/components/providers/main-provider';
import { usePlayersContext } from '@/components/providers/players-provider';
import { useSocket } from '@/components/providers/socket-provider';
import GameCard from '@/components/ui/game-card';
import GameScore from '@/components/ui/game-score';
import PlayerBox from '@/components/ui/player-box';
import { Box, Button, Center, Flex, Heading, Img, Spinner, Stack, Tooltip } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Poker() {
  const { player } = useMainContext();
  const { socket } = useSocket();

  const { players } = usePlayersContext();
  const [selectedCard, setSelectedCard] = useState<string | undefined>(undefined);

  const [running, setRunning] = useState<boolean>(!!player?.room.running);
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState<number>(-1);

  const router = useRouter();
  const search = useSearchParams();

  const roomId = search?.get('r');

  useEffect(() => {
    if (!player || !roomId) {
      let path = '/login';
      if (roomId) {
        path += `?wr=${roomId}`
      }
      router.replace(path);
    } else {
      setLoading(false);
    }
  }, [player, router, roomId]);

  useEffect(() => {
    if (socket) {
      socket.on('reveal', () => {
        setCounter(3);
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

  useEffect(() => {
    counter === 0 && setRunning(false);
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  const handleSelectCard = (card: string) => {
    if (!running || counter > 0) return;
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
    <Flex flexDirection={'column'} gap={'2rem'} marginTop={'3rem'}>
      <Center>
        <Box>
          <Heading as="h1">Planning Poker</Heading>
          <Heading textAlign={'center'} as={'h2'} size="md">
            {player?.room?.name}
          </Heading>
        </Box>
      </Center>

      <Center>
        <Stack direction={'row'} gap={'.5rem'}>
          {players.map((player) => (
            <PlayerBox key={player.id} player={player} running={running} />
          ))}
        </Stack>
      </Center>

      <Center>
        {running ? (
          <Button w="10rem" onClick={() => handleRevealCards()} isDisabled={counter > 0}>
            {counter > 0 ? `Revealing in ${counter}...` : 'Reveal cards'}
          </Button>
        ) : (
          <Button w="10rem" onClick={() => handleRestart()}>
            Restart
          </Button>
        )}
      </Center>

      {!player?.spectator && (
        <Center>
          <Stack direction={'row'} gap={'.5rem'}>
            {cards.map((card) => (
              <GameCard key={card} onSelect={handleSelectCard} selected={selectedCard === card} value={card} />
            ))}
          </Stack>
        </Center>
      )}

      <Center>
        <GameScore running={running} />
      </Center>
    </Flex>
  );
}
