'use client';

import { useMainContext } from '@/components/providers/main.provider';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/components/providers/socket-provider';
import { useEffect, useState } from 'react';
import { Player } from '@/models/types';
import { usePlayersContext } from '@/components/providers/players-provider';
import { Button, Card, CardBody, CardFooter, CardHeader, Center, Input, Stack } from '@chakra-ui/react';

export default function Login() {
  const { name, setName, room, setRoom } = useMainContext();
  const { setPlayers } = usePlayersContext();

  const router = useRouter();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('players-in-room', (data: Player[]) => {
        setPlayers(data);
      });
    }
  }, [socket, setPlayers]);

  const handleJoinClick = () => {
    if (!isConnected) {
      console.log('Socket is not connected');
      return;
    }

    socket.emit(
      'join-game',
      {
        name,
        room,
      },
      (error: any) => {
        if (!error) {
          router.push(`/poker?r=${room}`);          
        }
      }
    );
  };

  return (
    <Center h="90vh">
      <Card>
        <CardHeader>Login</CardHeader>
        <CardBody gap={'1.5rem'} display={'flex'} flexDirection={'column'}>
          <Stack direction={'row'}>
            <Input w="300px" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          </Stack>
          <Stack direction={'row'}>
            <Input w="300px" type="text" placeholder="Enter a name for your room" value={room} onChange={(e) => setRoom(e.target.value)} />
          </Stack>
        </CardBody>
        <CardFooter>
          <Button onClick={() => handleJoinClick()}>Join</Button>
        </CardFooter>
      </Card>
    </Center>
  );
}
