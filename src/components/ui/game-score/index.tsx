import { usePlayersContext } from '@/components/providers/players-provider';
import { Stack, StackItem } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

type Props = {
  running: boolean;
};
export default function GameScore({ running }: Props) {
  const { players } = usePlayersContext();
  const [average, setAverage] = useState(0);
  const [unanimous, setUnanimous] = useState(false);

  useEffect(() => {
    if (running) {
      setAverage(0);
      setUnanimous(false);
    } else {
      const cards = [];
      for (const player of players) {
        if (!player.spectator && player.card && !isNaN(+player.card)) {
          cards.push(parseInt(player.card));
        }
      }

      const sum = cards.reduce((a, b) => a + b, 0);
      const avg = parseFloat((sum / cards.length).toFixed(2)) || 0;
      setAverage(avg);

      const allPlayersAgreed = players
        .filter((p) => !p.spectator)
        .every((v, i, arr) => v.card && v.card === arr[0].card);
      setUnanimous(allPlayersAgreed);
    }
  }, [running, players]);

  if (running) {
    return <></>;
  }

  return (
    <Stack textAlign={'center'}>
      <StackItem fontWeight={'700'}>{unanimous ? 'All players agreed 🎉' : 'Average'}</StackItem>
      {!unanimous && <StackItem fontSize={'1.75rem'}>{average}</StackItem>}
      {unanimous && <ConfettiExplosion />}
    </Stack>
  );
}
