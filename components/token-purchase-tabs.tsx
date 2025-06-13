"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import Web3Button from "@/components/web3-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { CoffeeSvg } from "./ui/coffeeSVG";
import { useToast } from "@/hooks/use-toast"; // Ensure this import is correct based on your file structure
import { useWallet } from "@/context/wallet-context";

interface TokenPurchaseTabsProps {
  ethUsdPrice: number;
  ethAmount: string;
  usdcAmount: string;
  tokenAmount: string;
  lastTransactionTokenAmount: string;
  minPurchaseUsd: number;
  isConnected: boolean;
  isPendingEth: boolean; // Indicates if a transaction is pending (sent to network)
  isConfirmingBuyEth: boolean; // Indicates if transaction is being confirmed on blockchain
  isConfirmedBuyEth: boolean; // Indicates if transaction is confirmed successful
  onEthAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUsdcAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBuyWithEth: () => void;
  onBuyWithUsdc: () => void;
}

export default function TokenPurchaseTabs({
  ethUsdPrice,
  ethAmount,
  usdcAmount,
  tokenAmount,
  lastTransactionTokenAmount,
  minPurchaseUsd,
  isConnected,
  isPendingEth,
  isConfirmingBuyEth,
  isConfirmedBuyEth,
  onEthAmountChange,
  onUsdcAmountChange,
  onBuyWithEth,
  onBuyWithUsdc,
}: TokenPurchaseTabsProps) {
  const [activeTab, setActiveTab] = useState<"eth" | "usdc">("eth");
  const { openConnectModal } = useWallet();
  const { address } = useAccount();
  const { toast } = useToast();

  useEffect(() => {
    if (isConfirmedBuyEth && parseFloat(lastTransactionTokenAmount) > 0) {
      toast({
        title: "Transaction Confirmed!",
        description: `Your purchase of ${lastTransactionTokenAmount} WAGA tokens is complete.`,
        variant: "default",
      });
    }
  }, [isConfirmedBuyEth, toast]);
  /**
   * Handles the buy with ETH action, including validation and toast notifications.
   */
  const handleBuyWithEthWithToast = () => {
    if (!isConnected) {
      openConnectModal();
      return;
    }

    const ethValue = parseFloat(ethAmount);
    const usdValue = ethValue * ethUsdPrice;

    if (usdValue < minPurchaseUsd) {
      toast({
        title: "Error",
        description: `Minimum purchase is $${minPurchaseUsd} USD.`,
        variant: "destructive",
      });
      return;
    }

    // Call the original buy function (which should trigger the transaction)
    onBuyWithEth();

    // Show pending toast immediately after the transaction is initiated
    if (ethValue > 0) {
      toast({
        title: "Transaction Submitted",
        description:
          "Your purchase request has been submitted to the network. Waiting for confirmation...",
        variant: "default",
      });
    }
    if (isConfirmedBuyEth) {
      toast({
        title: "Transaction Confirmed!",
        description: `Your purchase of ${tokenAmount} WAGA tokens is complete.`,
        variant: "default",
      });
    }
  };

  /**
   * Handles the buy with USDC action, including validation and toast notifications.
   */
  const handleBuyWithUsdcWithToast = () => {
    if (!isConnected) {
      openConnectModal();
      return;
    }

    const usdcValue = parseFloat(usdcAmount);

    if (usdcValue < minPurchaseUsd) {
      toast({
        title: "Error",
        description: `Minimum purchase is $${minPurchaseUsd} USD.`,
        variant: "destructive",
      });
      return;
    }

    // Call the original buy function (which should trigger the transaction)
    onBuyWithUsdc();

    // Show pending toast immediately after the transaction is initiated
    if (usdcValue > 0) {
      toast({
        title: "Transaction Submitted",
        description:
          "Your purchase request has been submitted to the network. Waiting for confirmation...",
        variant: "default",
      });
    }
  };

  return (
    <div className="w-full">
      {/* Custom Tab List for ETH and USDC */}
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
              <CoffeeSvg />
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
              <CoffeeSvg />
            </div>
            Buy with USDC
          </div>
        </button>
      </div>

      {/* ETH Tab Content */}
      {activeTab === "eth" && (
        <div className="space-y-4">
          {/* Display current ETH price */}
          <div className="bg-black/40 rounded-lg p-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">Current ETH Price</div>
            <div className="text-emerald-400 font-bold">
              ${ethUsdPrice.toFixed(2)}
            </div>
          </div>
          {/* Warning for demo-only price */}
          <div className="text-xs text-amber-400/80 italic mt-1 flex items-center">
            <div className="mr-1 flex-shrink-0">(Warning)</div>
            <div>
              Demo only: Price shown is simulated and not actual market data
            </div>
          </div>

          {/* ETH Amount Input */}
          <div className="space-y-2">
            <label
              htmlFor="eth-amount"
              className="text-sm text-gray-300 flex items-center"
            >
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
                  <CoffeeSvg />
                </div>
              </div>
            </div>
            {/* Display approximated USD and WAGA token amount */}
            {ethAmount && (
              <div className="text-xs text-gray-400 flex justify-between">
                <span>
                  Approximately $
                  {(Number.parseFloat(ethAmount || "0") * ethUsdPrice).toFixed(
                    2
                  )}{" "}
                  USD
                </span>
                <span>{tokenAmount} WAGA</span>
              </div>
            )}
          </div>
          {/* Transaction status messages */}
          <div className="min-h-[24px] text-center">
            {isPendingEth && (
              <div className="mt-4 text-yellow-500 animate-pulse">
                Transaction submitted...
              </div>
            )}
            {isConfirmingBuyEth && (
              <div className="mt-4 text-yellow-500 animate-pulse">
                Waiting for confirmation...
              </div>
            )}
          </div>
          {/* Buy ETH Button */}
          <div className="pt-2">
            {isConnected ? (
              <Web3Button
                onClick={handleBuyWithEthWithToast}
                className="w-full py-3 relative overflow-hidden group"
                variant="gradient"
                disabled={isPendingEth || isConfirmingBuyEth}
              >
                <span className="relative z-10">
                  {isPendingEth || isConfirmingBuyEth
                    ? "Processing..."
                    : "Buy WAGA Token"}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Web3Button>
            ) : (
              <Button
                onClick={handleBuyWithEthWithToast}
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
          {/* USDC Amount Input */}
          <div className="space-y-2">
            <label
              htmlFor="usdc-amount"
              className="text-sm text-gray-300 flex items-center"
            >
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
                  <CoffeeSvg />
                </div>
              </div>
            </div>
            {/* Display WAGA token amount */}
            {usdcAmount && (
              <div className="text-xs text-gray-400 flex justify-end">
                <span>{tokenAmount} WAGA</span>
              </div>
            )}
          </div>
          {/* Transaction status messages */}
          <div className="min-h-[24px] text-center">
            {isPendingEth && (
              <div className="mt-4 text-yellow-500 animate-pulse">
                Transaction submitted...
              </div>
            )}
            {isConfirmingBuyEth && (
              <div className="mt-4 text-yellow-500 animate-pulse">
                Waiting for confirmation...
              </div>
            )}
          </div>

          {/* Buy USDC Button */}
          <div className="pt-2">
            {address ? (
              <Web3Button
                onClick={handleBuyWithUsdcWithToast}
                className="w-full py-3 relative overflow-hidden group"
                variant="gradient"
                disabled={isPendingEth || isConfirmingBuyEth}
              >
                <span className="relative z-10">Buy WAGA Tokens</span>
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Web3Button>
            ) : (
              <Button
                onClick={handleBuyWithUsdcWithToast}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-medium transition-all duration-200"
              >
                Connect Wallet to Buy
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
