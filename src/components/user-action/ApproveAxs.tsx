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
import { AXS__factory } from "src/contracts"
import { useWrapToast } from "src/hooks/useWrapToast"
import { fromFracAmount } from "src/utils/currency"
import { debugError } from "src/utils/debug"

import { useEthersWeb3Provider } from "src/hooks/useEthersWeb3Provider"
import { useAccount } from "wagmi"
import { LoadingSpinner } from "../LoadingSpinner"
import { Result } from "../Result"

export const ApproveAxs = () => {
  const { toastError, toastSuccess, toastConsoleError } = useWrapToast()
  const { address } = useAccount()
  const walletProvider = useEthersWeb3Provider()

  const [loading, setLoading] = useState<boolean>(false)
  const [spender, setSpender] = useState<string>("0x17Ff618150517D784d92af8D54Bb38c9f7B2F6d4")
  const [axsAmount, setAxsAmount] = useState<string>("0.1")
  const [txHash, setTxHash] = useState<string>()

  const handleApproveAxs = async () => {
    if (!walletProvider || !address) {
      toastError("Please connect your wallet first!")
      return
    }

    setLoading(true)

    try {
      const rawAmount = fromFracAmount(axsAmount, 18)
      const contract = AXS__factory.connect(ADDRESS_CONFIG.AXS, walletProvider.getSigner())
      const unsignedTx = await contract.populateTransaction.approve(spender, rawAmount)
      const signer = walletProvider.getSigner()
      const hash = await signer.sendUncheckedTransaction(unsignedTx)

      setTxHash(hash)
      toastSuccess(`Approve ${axsAmount} AXS successfully!`)
      setLoading(false)
    } catch (error) {
      debugError("handleApproveAxs", error)
      toastConsoleError()

      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approve AXS</CardTitle>
        <CardDescription>Approve for other contracts to use your AXS.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid items-center w-full gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="axsAmount">Amount</Label>
              <Input
                id="axsAmount"
                placeholder="Your AXS amount"
                value={axsAmount}
                onChange={event => {
                  setAxsAmount(event.target.value)
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
        <Button onClick={handleApproveAxs} disabled={!address || loading} className="gap-1">
          {loading && <LoadingSpinner />}
          Send transaction
        </Button>
      </CardFooter>
    </Card>
  )
}
