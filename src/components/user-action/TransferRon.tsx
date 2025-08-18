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
import { Input } from "src/@/components/ui/input"
import { useEthersWeb3Provider } from "src/hooks/useEthersWeb3Provider"
import { useWrapToast } from "src/hooks/useWrapToast"
import { fromFracAmount } from "src/utils/currency"
import { debugError } from "src/utils/debug"
import { useAccount } from "wagmi"

import { LoadingSpinner } from "../LoadingSpinner"
import { Result } from "../Result"

export const TransferRon = () => {
  const { address } = useAccount()
  const walletProvider = useEthersWeb3Provider()
  const { toastSuccess, toastConsoleError, toastError } = useWrapToast()

  const [loading, setLoading] = useState<boolean>(false)
  const [ronAmount, setRonAmount] = useState<string>("0.1")
  const [toAddress, setToAddress] = useState<string>("0x17Ff618150517D784d92af8D54Bb38c9f7B2F6d4")
  const [txHash, setTxHash] = useState<string>()

  const handleTransferRon = async () => {
    if (!walletProvider || !address) {
      toastError("Please connect your wallet first!")
      return
    }

    if (ronAmount) {
      setLoading(true)

      try {
        const rawAmount = fromFracAmount(ronAmount, 18)
        const hash = await walletProvider
          .getSigner()
          .sendUncheckedTransaction({ to: toAddress, value: rawAmount })

        setTxHash(hash)
        setLoading(false)

        toastSuccess(`Transfer ${ronAmount} RON successfully!`)
      } catch (error) {
        debugError("handleFetchRonBalance", error)
        toastConsoleError()

        setLoading(false)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer RON</CardTitle>
        <CardDescription>Transfer your native token to another address.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid items-center w-full gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="ronAmount">Amount</Label>
              <Input
                id="ronAmount"
                placeholder="Your RON amount"
                value={ronAmount}
                onChange={event => {
                  setRonAmount(event.target.value)
                }}
                type="number"
                min={0}
                max={999999999}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="toAddress">To</Label>
              <Input
                id="toAddress"
                placeholder="Destination address"
                value={toAddress}
                onChange={event => {
                  setToAddress(event.target.value)
                }}
                type="string"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="result">Result</Label>
              <Result placeholder="Your transaction hash" value={txHash} type="transaction_hash" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleTransferRon} disabled={!address || loading} className="gap-1">
          {loading && <LoadingSpinner />}
          Send transaction
        </Button>
      </CardFooter>
    </Card>
  )
}
