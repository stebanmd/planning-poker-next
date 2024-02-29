import { Box } from '@chakra-ui/react';

export default function SpectatorCard() {
  return (
    <Box
      w={'4rem'}
      h={'7rem'}
      backgroundColor={'#d2d2d2'}
      borderStyle={'solid'}
      borderRadius={'5px'}
      boxShadow={'#a3a3a3 1px 1px 4px 2px'}
    >
      <Box 
        backgroundImage={'eye.svg'}
        backgroundRepeat={'round'}
        w={'3rem'}
        h={'7rem'}
        margin={'auto'}
      />
    </Box>
  );
}
