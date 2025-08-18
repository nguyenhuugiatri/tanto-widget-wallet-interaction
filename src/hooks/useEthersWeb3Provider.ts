import { providers } from 'ethers'
import { useMemo } from 'react'
import type { Account, Chain, Client, Transport } from 'viem'
import type { Config } from 'wagmi'
import { useConnectorClient } from 'wagmi'

function clientToWeb3Provider(client: Client<Transport, Chain, Account>) {
  const { chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  return new providers.Web3Provider(transport, network)
}

/** Hook to convert a Viem Client to an ethers.js Web3Provider. */
export function useEthersWeb3Provider({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId })
  return useMemo(
    () => (client ? clientToWeb3Provider(client) : undefined),
    [client]
  )
}
