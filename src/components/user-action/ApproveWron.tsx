"use client"

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
import { Label } from "src/@/components/ui/label"
import { ADDRESS_CONFIG } from "src/config/address"
import { WRON__factory } from "src/contracts"
import { useEthersWeb3Provider } from "src/hooks/useEthersWeb3Provider"
import { useWrapToast } from "src/hooks/useWrapToast"
import { fromFracAmount } from "src/utils/currency"
import { debugError } from "src/utils/debug"
import { useAccount } from "wagmi"

import { LoadingSpinner } from "../LoadingSpinner"
import { Result } from "../Result"

export const ApproveWron = () => {
  const { address } = useAccount()
  const walletProvider = useEthersWeb3Provider()
  const { toastError, toastSuccess, toastConsoleError } = useWrapToast()

  const [loading, setLoading] = useState<boolean>(false)
  const [spender, setSpender] = useState<string>("0x17Ff618150517D784d92af8D54Bb38c9f7B2F6d4")
  const [wronAmount, setWronAmount] = useState<string>("0.1")
  const [txHash, setTxHash] = useState<string>()

  const handleApproveWron = async () => {
    if (!walletProvider || !address) {
      toastError("Please connect your wallet first!")
      return
    }

    setLoading(true)

    try {
      const rawAmount = fromFracAmount(wronAmount, 18)
      const contract = WRON__factory.connect(ADDRESS_CONFIG.WRON, walletProvider.getSigner())
      const unsignedTx = await contract.populateTransaction.approve(spender, rawAmount)
      const signer = walletProvider.getSigner()
      const hash = await signer.sendUncheckedTransaction(unsignedTx)

      setTxHash(hash)
      toastSuccess(`Approve ${wronAmount} WRON successfully!`)
      setLoading(false)
    } catch (error) {
      debugError("handleApproveWron", error)
      toastConsoleError()

      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approve WRON</CardTitle>
        <CardDescription>Approve for other contracts to use your WRON.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid items-center w-full gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="wronAmount">Amount</Label>
              <Input
                id="wronAmount"
                placeholder="Your WRON amount"
                value={wronAmount}
                onChange={event => {
                  setWronAmount(event.target.value)
                }}
                type="number"
                min={0}
                max={999999999}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="spenderAddress">Spender</Label>
              <Input
                id="spenderAddress"
                placeholder="Spender's address"
                value={spender}
                onChange={event => {
                  setSpender(event.target.value)
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
        <Button onClick={handleApproveWron} disabled={!address || loading} className="gap-1">
          {loading && <LoadingSpinner />}
          Send transaction
        </Button>
      </CardFooter>
    </Card>
  )
}
