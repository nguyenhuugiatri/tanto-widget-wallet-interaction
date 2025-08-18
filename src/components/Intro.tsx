"use client"

import { TantoConnectButton } from "@sky-mavis/tanto-widget"

export const Intro = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <TantoConnectButton label="Connect Wallet" />
    </div>
  )
}
