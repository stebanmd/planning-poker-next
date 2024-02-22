'use client'

import { useSocket } from "@/components/providers/socket-provider"
import { Badge } from "@chakra-ui/react"

export const SocketIndicator = () => {
  const { isConnected} = useSocket()

  if (!isConnected) {
    return (
      <Badge colorScheme='red'>Disconnected</Badge>      
    )
  }

  return (<Badge colorScheme="green">Connected</Badge>)
}