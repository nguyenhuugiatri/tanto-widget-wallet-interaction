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
import { useWrapToast } from "src/hooks/useWrapToast"
import { debugError } from "src/utils/debug"
import { Hex, parseSignature, serializeSignature, verifyMessage } from "viem"

import { useEthersWeb3Provider } from "src/hooks/useEthersWeb3Provider"
import { useAccount } from "wagmi"
import { LoadingSpinner } from "../LoadingSpinner"
import { Result } from "../Result"

export const PersonalSign = () => {
  const { address } = useAccount()
  const walletProvider = useEthersWeb3Provider()
  const { toastSuccess, toastError, toastConsoleError } = useWrapToast()

  const [signMessage, setSignMessage] = useState<string>("Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore ullam impedit nemo fugiat sed laudantium placeat a, in veniam laboriosam suscipit error quas nesciunt assumenda sint reprehenderit, asperiores dolorum ad?")
  const [signResult, setSignResult] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  const handlePersonalSign = async () => {
    if (!walletProvider || !address) {
      toastError("Please connect your wallet first!")
      return
    }

    setLoading(true)

    try {
      const sig = await walletProvider.getSigner().signMessage(signMessage) as Hex
      const ethSig = serializeSignature(parseSignature(sig))
      const isSignatureValid = await verifyMessage({
        address,
        message: signMessage,
        signature: ethSig,
      })

      if (isSignatureValid) {
        setSignResult(ethSig)
        toastSuccess("Signature is valid!")
      } else {
        toastError("Signature is invalid!")
      }

      setLoading(false)
    } catch (error) {
      debugError("handlePersonalSign", error)
      toastConsoleError()

      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Sign</CardTitle>
        <CardDescription>
          Presents a plain text signature challenge to the user and returns the signed response.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid items-center w-full gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="signMessage">Message</Label>
              <Input
                id="signMessage"
                placeholder="Sign message"
                value={signMessage}
                onChange={event => {
                  setSignMessage(event.target.value)
                }}
                type="string"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="result">Result</Label>
              <Result placeholder="Your signature" value={signResult} />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handlePersonalSign} disabled={!address || loading} className="gap-1">
          {loading && <LoadingSpinner />}
          Sign message
        </Button>
      </CardFooter>
    </Card>
  )
}
