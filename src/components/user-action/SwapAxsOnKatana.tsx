"use client"

import { Label } from "@radix-ui/react-label"
import { BigNumber, constants } from "ethers"
import { parseUnits } from "ethers/lib/utils"
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
import { ADDRESS_CONFIG } from "src/config/address"
import { KatanaRouter__factory } from "src/contracts"
import { useEthersWeb3Provider } from "src/hooks/useEthersWeb3Provider"
import { useWrapToast } from "src/hooks/useWrapToast"
import { debugError } from "src/utils/debug"
import { useAccount } from "wagmi"

import { LoadingSpinner } from "../LoadingSpinner"
import { Result } from "../Result"

export const SwapAxsOnKatana = () => {
  const { address } = useAccount()
  const walletProvider = useEthersWeb3Provider()
  const { toastError, toastConsoleError, toastSuccess } = useWrapToast()

  const [amount, setAmount] = useState<string>("0.1")
  const [txHash, setTxHash] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  const handleSwapAxsToRon = async () => {
    if (!walletProvider || !address) {
      toastError("Please connect your wallet first!")
      return
    }

    setLoading(true)

    try {
      const katanaRouter = KatanaRouter__factory.connect(
        ADDRESS_CONFIG.KATANA,
        walletProvider.getSigner(),
      )

      const slippageTolerance = parseUnits("2", 18)
      const amountToSwap = parseUnits(amount, 18)
      const slippageAmount = amountToSwap.mul(slippageTolerance).div(constants.WeiPerEther)

      let amountOutMin = amountToSwap.sub(slippageAmount)
      if (amountOutMin.lt(0)) {
        amountOutMin = BigNumber.from(0)
      }

      const deadline = Math.floor(Date.now() / 1000) + 60 * 10
      const path = [ADDRESS_CONFIG.AXS, ADDRESS_CONFIG.WRON]

      const unsignedTx = await katanaRouter.populateTransaction.swapExactTokensForRON(
        amountToSwap,
        amountOutMin,
        path,
        address,
        deadline,
      )

      const signer = walletProvider.getSigner()
      const txHash = await signer.sendUncheckedTransaction(unsignedTx)

      setTxHash(txHash)
      toastSuccess(`Swap ${amount} AXS submitted!`)
    } catch (error) {
      debugError("handleSwapAxsToRon", error)
      toastConsoleError()
    } finally {
      setLoading(false)
    }
  }

  const handleSwapRonToAxs = async () => {
    if (!walletProvider || !address) {
      toastError("Please connect your wallet first!")
      return
    }

    setLoading(true)

    try {
      const katanaRouter = KatanaRouter__factory.connect(
        ADDRESS_CONFIG.KATANA,
        walletProvider.getSigner(),
      )

      const slippageTolerance = parseUnits("2", 18)
      const amountToSwap = parseUnits(amount, 18)
      const slippageAmount = amountToSwap.mul(slippageTolerance).div(constants.WeiPerEther)

      let amountOutMin = amountToSwap.sub(slippageAmount)
      if (amountOutMin.lt(0)) {
        amountOutMin = BigNumber.from(0)
      }

      const deadline = Math.floor(Date.now() / 1000) + 60 * 10
      const path = [ADDRESS_CONFIG.WRON, ADDRESS_CONFIG.AXS]

      const unsignedTx = await katanaRouter.populateTransaction.swapExactRONForTokens(
        amountOutMin,
        path,
        address,
        deadline,
        { value: amountToSwap },
      )

      const signer = walletProvider.getSigner()
      const txHash = await signer.sendUncheckedTransaction(unsignedTx)

      setTxHash(txHash)
      toastSuccess(`Swap ${amount} RON submitted!`)
    } catch (error) {
      debugError("handleSwapRonToAxs", error)
      toastConsoleError()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Swap on Katana</CardTitle>
        <CardDescription>Swap AXS to RON or RON to AXS on Katana.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid items-center w-full gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                placeholder="Swap amount"
                value={amount}
                onChange={event => {
                  setAmount(event.target.value)
                }}
                type="number"
                min={0}
                max={999999999}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="result">Result</Label>
              <Result placeholder="Your transaction hash" value={txHash} type="transaction_hash" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-1">
        <Button onClick={handleSwapAxsToRon} disabled={!address || loading} className="gap-1">
          {loading && <LoadingSpinner />}
          Swap to RON
        </Button>

        <Button onClick={handleSwapRonToAxs} disabled={!address || loading} className="gap-1">
          {loading && <LoadingSpinner />}
          Swap to AXS
        </Button>
      </CardFooter>
    </Card>
  )
}
