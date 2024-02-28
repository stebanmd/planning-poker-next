import { Box } from '@chakra-ui/react';

type Props = {
  selected: boolean;
};
export default function BackCard({ selected }: Props) {
  return (
    <Box
      w={'4rem'}
      h={'7rem'}
      borderWidth={'1px'}
      backgroundImage={selected ? 'back.jpg' : ''}
      backgroundRepeat={'round'}
      borderStyle={'solid'}
      borderRadius={'5px'}
      borderColor={'navy'}
      boxShadow={selected ? '#a3a3e3 3px 3px 5px 2px' : ''}
    />
  );
}
