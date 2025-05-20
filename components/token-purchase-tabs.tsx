"use client"

import type React from "react"
import { useState } from "react"
import { Info } from "lucide-react"
import Web3Button from "@/components/web3-button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

interface TokenPurchaseTabsProps {
  ethUsdPrice: number
  ethAmount: string
  usdcAmount: string
  tokenAmount: string
  minPurchaseUsd: number
  isConnected: boolean
  onEthAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUsdcAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBuyWithEth: () => void
  onBuyWithUsdc: () => void
  openConnectModal: () => void
}

export function TokenPurchaseTabs({
  ethUsdPrice,
  ethAmount,
  usdcAmount,
  tokenAmount,
  minPurchaseUsd,
  isConnected,
  onEthAmountChange,
  onUsdcAmountChange,
  onBuyWithEth,
  onBuyWithUsdc,
  openConnectModal,
}: TokenPurchaseTabsProps) {
  const [activeTab, setActiveTab] = useState<"eth" | "usdc">("eth")

  return (
    <div className="w-full">
      {/* Custom Tab List */}
      <div className="grid w-full grid-cols-2 mb-6 bg-black/30 border border-emerald-500/20 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("eth")}
          className={`rounded-md py-2 transition-all duration-200 ${
            activeTab === "eth"
              ? "bg-gradient-to-b from-emerald-600/30 to-emerald-700/30 text-emerald-300 border border-emerald-500/50"
              : "bg-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-emerald-900/50 flex items-center justify-center mr-2">
              <img src="/placeholder.svg?height=16&width=16" alt="ETH" className="w-4 h-4" />
            </div>
            Buy with ETH
          </div>
        </button>
        <button
          onClick={() => setActiveTab("usdc")}
          className={`rounded-md py-2 transition-all duration-200 ${
            activeTab === "usdc"
              ? "bg-gradient-to-b from-emerald-600/30 to-emerald-700/30 text-emerald-300 border border-emerald-500/50"
              : "bg-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-purple-900/50 flex items-center justify-center mr-2">
              <img src="/placeholder.svg?height=16&width=16" alt="USDC" className="w-4 h-4" />
            </div>
            Buy with USDC
          </div>
        </button>
      </div>

      {/* ETH Tab Content */}
      {activeTab === "eth" && (
        <div className="space-y-4">
          <div className="bg-black/40 rounded-lg p-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">Current ETH Price</div>
            <div className="text-emerald-400 font-bold">${ethUsdPrice.toFixed(2)}</div>
          </div>
          <div className="text-xs text-amber-400/80 italic mt-1 flex items-center">
            <div className="mr-1 flex-shrink-0">⚠️</div>
            <div>Demo only: Price shown is simulated and not actual market data</div>
          </div>

          <div className="space-y-2">
            <label htmlFor="eth-amount" className="text-sm text-gray-300 flex items-center">
              ETH Amount
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="ml-2 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Minimum purchase: ${minPurchaseUsd}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <div className="relative group">
              <input
                id="eth-amount"
                type="text"
                value={ethAmount}
                onChange={onEthAmountChange}
                placeholder="0.0"
                className="flex h-10 w-full rounded-lg border border-emerald-500/30 bg-black/40 px-3 py-2 pl-10 text-sm text-gray-200 placeholder:text-gray-600 focus:border-emerald-400 focus:outline-none group-hover:border-emerald-400/50 transition-all"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-900/50">
                  <img src="/placeholder.svg?height=16&width=16" alt="ETH" className="w-4 h-4" />
                </div>
              </div>
            </div>
            {ethAmount && (
              <div className="text-xs text-gray-400 flex justify-between">
                <span>≈ ${(Number.parseFloat(ethAmount || "0") * ethUsdPrice).toFixed(2)} USD</span>
                <span>{tokenAmount} WAGA</span>
              </div>
            )}
          </div>

          <div className="pt-2">
            {isConnected ? (
              <Web3Button
                onClick={onBuyWithEth}
                className="w-full py-3 relative overflow-hidden group"
                variant="gradient"
              >
                <span className="relative z-10">Buy WAGA Tokens</span>
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Web3Button>
            ) : (
              <Button
                onClick={openConnectModal}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-medium transition-all duration-200"
              >
                Connect Wallet to Buy
              </Button>
            )}
          </div>
        </div>
      )}

      {/* USDC Tab Content */}
      {activeTab === "usdc" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="usdc-amount" className="text-sm text-gray-300 flex items-center">
              USDC Amount
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="ml-2 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Minimum purchase: ${minPurchaseUsd}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <div className="relative group">
              <input
                id="usdc-amount"
                type="text"
                value={usdcAmount}
                onChange={onUsdcAmountChange}
                placeholder="0.0"
                className="flex h-10 w-full rounded-lg border border-purple-500/30 bg-black/40 px-3 py-2 pl-10 text-sm text-gray-200 placeholder:text-gray-600 focus:border-purple-400 focus:outline-none group-hover:border-purple-400/50 transition-all"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-900/50">
                  <img src="/placeholder.svg?height=16&width=16" alt="USDC" className="w-4 h-4" />
                </div>
              </div>
            </div>
            {usdcAmount && (
              <div className="text-xs text-gray-400 flex justify-end">
                <span>{tokenAmount} WAGA</span>
              </div>
            )}
          </div>

          <div className="pt-2">
            {isConnected ? (
              <Web3Button
                onClick={onBuyWithUsdc}
                className="w-full py-3 relative overflow-hidden group"
                variant="gradient"
              >
                <span className="relative z-10">Buy WAGA Tokens</span>
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Web3Button>
            ) : (
              <Button
                onClick={openConnectModal}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-medium transition-all duration-200"
              >
                Connect Wallet to Buy
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
