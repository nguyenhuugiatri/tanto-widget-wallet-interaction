"use client"

import { Label } from "@radix-ui/react-label"
import { useState } from "react"
import { Button } from "src/@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/@/components/ui/card"
import { ADDRESS_CONFIG } from "src/config/address"
import { AtiaShrine__factory } from "src/contracts"
import { useWrapToast } from "src/hooks/useWrapToast"
import { debugError } from "src/utils/debug"

import { LoadingSpinner } from "../LoadingSpinner"
import { Result } from "../Result"
import { useAccount } from "wagmi"
import { useEthersWeb3Provider } from "src/hooks/useEthersWeb3Provider"

export const AtiaActivation = () => {
  const { address } = useAccount()
  const walletProvider = useEthersWeb3Provider()
  const { toastError, toastSuccess, toastConsoleError } = useWrapToast()
  const [txHash, setTxHash] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  const handleActivateAtia = async () => {
    if (!walletProvider || !address) {
      toastError("Please connect your wallet first!")
      return
    }

    setLoading(true)

    try {
      const contract = AtiaShrine__factory.connect(
        ADDRESS_CONFIG.ATIA_SHRINE,
        walletProvider.getSigner(),
      )
      const unsignedTx = await contract.populateTransaction.activateStreak(address)
      const signer = walletProvider.getSigner()
      const hash = await signer.sendUncheckedTransaction(unsignedTx)

      setTxHash(hash)
      toastSuccess(`Atia has blessed you`)
      setLoading(false)
    } catch (error) {
      debugError("handleActivateAtia", error)
      toastConsoleError()

      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activate Atia</CardTitle>
        <CardDescription>Activate Atia to complete daily bounty</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid items-center w-full gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="result">Result</Label>
              <Result placeholder="Your transaction hash" value={txHash} type="transaction_hash" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button onClick={handleActivateAtia} disabled={!address || loading} className="gap-1">
          {loading && <LoadingSpinner />}
          Pray to Atia
        </Button>
      </CardFooter>
    </Card>
  )
}
