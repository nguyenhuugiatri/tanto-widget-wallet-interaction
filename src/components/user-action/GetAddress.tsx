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
import { useWrapToast } from "src/hooks/useWrapToast"
import { debugError } from "src/utils/debug"

import { LoadingSpinner } from "../LoadingSpinner"
import { Result } from "../Result"
import { useEthersWeb3Provider } from "src/hooks/useEthersWeb3Provider"
import { useAccount } from "wagmi"

export const GetAddress = () => {
  const { address } = useAccount()
  const walletProvider = useEthersWeb3Provider()
  const { toastError, toastSuccess, toastConsoleError } = useWrapToast()

  const [loading, setLoading] = useState<boolean>(false)

  const handleGetAddress = async () => {
    setLoading(true)

    if (!walletProvider || !address) {
      toastError("Please connect your wallet first!")
      return
    }

    try {
      toastSuccess("Get your address successfully!")
      setLoading(false)
    } catch (error) {
      debugError("handleGetAddress", error)
      toastConsoleError()

      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>eth_requestAccounts</CardTitle>
        <CardDescription>Get the address from your current wallet.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid items-center w-full gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="result">Result</Label>
              <Result placeholder="Your current address" value={address} />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button onClick={handleGetAddress} disabled={!address || loading} className="gap-1">
          {loading && <LoadingSpinner />}
          Get address
        </Button>
      </CardFooter>
    </Card>
  )
}
