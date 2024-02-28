import { Box } from '@chakra-ui/react';

type Props = {
  selected?: boolean;
  onSelect?: (v: string) => void;
  value?: string;
};
export default function GameCard({ selected = false, onSelect, value = '' }: Props) {
  const handleClick = () => {
    onSelect?.(value);
  };

  return (
    <Box
      w={'4rem'}
      h={'7rem'}
      borderWidth={selected ? '5px' : '3px'}
      backgroundColor={selected ? '#96e4f9' : ''}
      borderStyle={'solid'}
      borderRadius={'5px'}
      borderColor={'navy'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      cursor={'pointer'}
      onClick={() => handleClick()}
    >
      <strong>{value}</strong>
    </Box>
  );
}
