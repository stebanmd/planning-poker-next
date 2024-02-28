import BackCard from '@/components/ui/back-card';
import GameCard from '@/components/ui/game-card';
import { Player } from '@/models/types';
import { Box, Center, Flex } from '@chakra-ui/react';
import ReactCardFlip from 'react-card-flip';

type Props = {
  player: Player;
  running: boolean;
};
export default function PlayerBox({ player, running }: Props) {
  return (
    <Flex flexDirection="column" gap={'1rem'} border={'1px solid navy'} padding={'1rem'} borderRadius={'10px'} maxW={'8rem'}>
      <Center>
        <ReactCardFlip isFlipped={!running}>
          <BackCard selected={!!player.card} />
          <Box>{running ? <span /> : <GameCard value={player.card || '🦆'} />}</Box>
        </ReactCardFlip>
      </Center>

      <Center overflowWrap={'break-word'} textAlign={'center'}>
        {player.name}
      </Center>
    </Flex>
  );
}
