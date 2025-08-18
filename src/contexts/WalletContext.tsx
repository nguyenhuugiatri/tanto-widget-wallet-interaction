"use client"

import { getDefaultConfig, TantoProvider } from "@sky-mavis/tanto-widget"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FC, ReactNode } from "react"
import { WagmiProvider } from "wagmi"

interface IProviderProps {
  children: ReactNode
}

const queryClient = new QueryClient()

const wagmiConfig = getDefaultConfig({
  keylessWalletConfig: {
    clientId: "dbe1e3ff-e145-422f-84c4-e0beb4972f69",
    waypointOrigin: "https://id.skymavis.one",
    headless: true,
    chainId: 2021,
  },
  coinbaseWalletConfig: {
    enable: true,
  },
})

export const WalletContext: FC<IProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <TantoProvider
          config={{
            initialChainId: 2021,
            clientId: "dbe1e3ff-e145-422f-84c4-e0beb4972f69",
            __internal_waypointBaseUrl: "https://waypoint-api.skymavis.one/v1/rpc/public",
            __internal_mpcBaseUrl:
              "https://growing-narwhal-infinitely.ngrok-free.app/v1/public/rpc",
            __internal_mpcSocketUrl: "wss://project-x.skymavis.one",
            createAccountOnConnect: true,
            showConfirmationModal: true,
          }}
        >
          {children}
        </TantoProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
