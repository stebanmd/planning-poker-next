'use client';

import { useMainContext } from '@/components/providers/main-provider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSocket } from '@/components/providers/socket-provider';
import { useEffect, useState } from 'react';
import { Player } from '@/models/types';
import { usePlayersContext } from '@/components/providers/players-provider';
import { Button, Card, CardBody, CardFooter, CardHeader, Center, Input, Stack, useToast } from '@chakra-ui/react';

export default function Login() {
  const { setPlayer } = useMainContext();
  const { setPlayers } = usePlayersContext();

  const router = useRouter();
  const search = useSearchParams();

  const toast = useToast()

  const [room, setRoom] = useState<string>('');
  const [name, setName] = useState<string>('');

  const { socket, isConnected } = useSocket();
  const roomId = search?.get('wr');

  useEffect(() => {
    if (socket) {
      socket.on('players-in-room', (data: Player[]) => {
        setPlayers(data);
      });
    }
  }, [socket, setPlayers]);

  const handleSubmitForm = (e: any) => {
    e.preventDefault();
    if (!isConnected) {
      console.log('Socket is not connected');
      return;
    }

    if (!roomId) {
      createRoomAndJoin();
    } else {
      joinGame(roomId);
    }
  };

  const createRoomAndJoin = () => {
    socket.emit('create-room', { roomName: room }, (res: any) => {
      if (res.error) {
        toast({
          title: 'Could not create room.',
          description: res.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      } else {
        console.log(`Join room: ${res.id}`);
        joinGame(res.id);
      }
    });
  };

  const joinGame = (roomId: string) => {
    socket.emit(
      'join-game',
      {
        name,
        room: roomId,
      },
      (res: any) => {
        if (res.error) {
          toast({
            title: 'Could not join game.',
            description: res.error,
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }

        if (res.data) {
          const playerCreated = res.data as Player;
          setPlayer(playerCreated);
          router.replace(`/poker?r=${playerCreated.room.id}`);
        }
      }
    );
  };

  return (
    <Center h="90vh">
      <Card>
        <form onSubmit={handleSubmitForm}>
          <CardHeader>Login</CardHeader>
          <CardBody gap={'1.5rem'} display={'flex'} flexDirection={'column'}>
            <Stack direction={'row'}>
              <Input w="300px" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            </Stack>

            {!roomId && (
              <Stack direction={'row'}>
                <Input
                  w="300px"
                  type="text"
                  placeholder="Enter a name for your room"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </Stack>
            )}
          </CardBody>
          <CardFooter>
            <Button type="submit" variant="outline" colorScheme="navy">
              Join
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Center>
  );
}
