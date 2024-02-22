import GameCard from "@/components/ui/game-card";
import { Player } from "@/models/types"
import { Box, Card, CardBody, CardFooter } from "@chakra-ui/react";

type Props = {
  player: Player,
  running: boolean,
}
export default function PlayerBox({ player, running }: Props) {

  return (
    <Card border={"1px solid navy"}>
      <CardBody>
        {running && player.card && (
          <Box w={"4rem"} h={"7rem"} backgroundColor={"navy"}></Box>
        )}
        {running && !player.card && (
          <GameCard />
        )}
        {!running && player.card && (
          <GameCard value={player.card} />
        )}
        {!running && !player.card && (
          <GameCard value="..." />
        )}
      </CardBody>
      <CardFooter>
        <strong>{player.name}</strong>
      </CardFooter>
    </Card>
  );
}