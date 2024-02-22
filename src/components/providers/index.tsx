'use client'

import { MainProvider } from "@/components/providers/main.provider"
import { PlayersProvider } from "@/components/providers/players-provider"
import { SocketProvider } from "@/components/providers/socket-provider"
import { ChakraProvider } from "@chakra-ui/react"

export function Providers({ children }: { children: React.ReactNode}) {
  return (
    <ChakraProvider>
      <MainProvider>
        <PlayersProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </PlayersProvider>
      </MainProvider>
    </ChakraProvider>
  )
}