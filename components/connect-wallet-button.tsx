"use client"

import { cn } from "@/lib/utils"
import { useWallet } from "@/context/wallet-context"
import { Wallet, ChevronDown, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ConnectWalletButton({ className }: { className?: string }) {
  const { address, isConnected, openConnectModal, disconnectWallet } = useWallet()

  // Format address for display (0x71C7...976F)
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Generate avatar fallback from address
  const generateAvatarFallback = (address: string) => {
    return address.slice(2, 4).toUpperCase()
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="account-dropdown-trigger">
            <Avatar className="h-5 w-5 mr-1">
              <AvatarFallback className="bg-emerald-900/50 text-xs">{generateAvatarFallback(address)}</AvatarFallback>
            </Avatar>
            <span className="relative z-10">{formatAddress(address)}</span>
            <ChevronDown className="ml-1 h-3 w-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="web3-card-purple">
          <DropdownMenuItem className="text-red-400 focus:text-red-400 cursor-pointer" onClick={disconnectWallet}>
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <button onClick={openConnectModal} className={cn("connect-wallet-button", className)}>
      <div className="flex items-center">
        <Wallet className="h-4 w-4 mr-2" />
        <span>Connect Wallet</span>
      </div>
    </button>
  )
}
