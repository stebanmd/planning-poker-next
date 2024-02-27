import GameCard from '@/components/ui/game-card';
import { Player } from '@/models/types';
import { Box, Card, CardBody, CardFooter, Center, Flex } from '@chakra-ui/react';

type Props = {
  player: Player;
  running: boolean;
};
export default function PlayerBox({ player, running }: Props) {
  return (
    <Flex flexDirection="column" gap={'1rem'} border={'1px solid navy'} padding={'1rem'} borderRadius={'10px'} maxW={'8rem'}>
      <Center>
        <Box>
          {running && player.card && <Box w={'4rem'} h={'7rem'} backgroundColor={'navy'}></Box>}
          {running && !player.card && <GameCard />}
          {!running && <GameCard value={player.card || '🦆'} />}
        </Box>

      </Center>
      <Center overflowWrap={'break-word'} textAlign={'center'}>{player.name}</Center>
    </Flex>
  );
}
