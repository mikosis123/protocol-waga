// components/token-purchase-tabs.tsx
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
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/context/wallet-context";
import { formatUnits, parseUnits } from "viem"; // Import parseUnits

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
  // --- NEW PROPS ADDED FOR USDC APPROVAL ---
  usdcAllowance: bigint | undefined; // Current USDC allowance for the TokenShop
  isApprovePending: boolean; // Is USDC approval transaction pending?
  isConfirmingApprove: boolean; // Is USDC approval transaction confirming?
  onApproveUsdc: () => void; // Function to trigger USDC approval
}

export default function TokenPurchaseTabs({
  ethUsdPrice,
  ethAmount,
  usdcAmount,
  tokenAmount,
  lastTransactionTokenAmount,
  minPurchaseUsd,
  isConnected,
  isPendingEth, // This refers to ETH buy pending status (for general purchase processing state)
  isConfirmingBuyEth, // This refers to ETH buy confirming status (for general purchase processing state)
  isConfirmedBuyEth,
  onEthAmountChange,
  onUsdcAmountChange,
  onBuyWithEth,
  onBuyWithUsdc,
  // --- NEW PROPS DESTRUCTURED ---
  usdcAllowance,
  isApprovePending,
  isConfirmingApprove,
  onApproveUsdc,
}: TokenPurchaseTabsProps) {
  const [activeTab, setActiveTab] = useState<"eth" | "usdc">("eth");
  const { openConnectModal } = useWallet();
  const { toast } = useToast();
  const { address } = useAccount(); // Ensure address is available

  // State to track if the component has mounted on the client to prevent hydration mismatches
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Toast notification for successful ETH token purchase
  useEffect(() => {
    if (isConfirmedBuyEth && parseFloat(lastTransactionTokenAmount) > 0) {
      toast({
        title: "Transaction Confirmed!",
        description: `Your purchase of ${lastTransactionTokenAmount} WAGA tokens is complete.`,
        variant: "default",
      });
    }
  }, [isConfirmedBuyEth, toast, lastTransactionTokenAmount]);

  /**
   * Handles the buy with ETH action, including validation and toast notifications.
   * This is a straightforward call as ETH does not require prior approval.
   */
  const handleBuyWithEthWithToast = () => {
    if (!isConnected) {
      openConnectModal();
      return;
    }
    onBuyWithEth(); // This triggers the actual ETH transaction logic in page.tsx
  };

  /**
   * Handles the buy with USDC action. This function smartly determines if an
   * approval is needed or if the purchase can proceed directly.
   * The subsequent 'buy' after approval is handled by the useEffect in page.tsx.
   */
  const handleBuyWithUsdcWithToast = async () => {
    if (!isConnected) {
      openConnectModal();
      return;
    }

    const usdcValue = parseFloat(usdcAmount);
    if (isNaN(usdcValue) || usdcValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid USDC amount.",
        variant: "destructive",
      });
      return;
    }

    const currentAllowance = usdcAllowance
      ? parseFloat(formatUnits(usdcAllowance, 6))
      : 0;

    if (currentAllowance < usdcValue) {
      toast({
        title: "Allowance Required",
        description: `Approving TokenShop to spend ${usdcValue} USDC...`,
        variant: "info",
      });
      try {
        await onApproveUsdc();
      } catch (error) {
        toast({
          title: "Approval Failed",
          description:
            (error as Error)?.message ||
            "Something went wrong during approval.",
          variant: "destructive",
        });
        return; // Stop further execution if approval fails
      }
    }

    try {
      await onBuyWithUsdc();
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description:
          (error as Error)?.message ||
          "Something went wrong during the purchase.",
        variant: "destructive",
      });
    }
  };

  // Format the current USDC allowance for display
  const currentUsdcAllowanceFormatted =
    usdcAllowance !== undefined
      ? parseFloat(formatUnits(usdcAllowance, 6)).toLocaleString()
      : "Loading...";

  // Check if the entered USDC amount is valid (non-empty, a number, and greater than 0)
  const usdcAmountValue = parseFloat(usdcAmount);
  const isUsdcAmountValid =
    usdcAmount !== "" && !isNaN(usdcAmountValue) && usdcAmountValue > 0;

  // Convert the user's input USDC amount to BigInt for direct comparison with usdcAllowance
  const usdcAmountBigInt = isUsdcAmountValid
    ? parseUnits(usdcAmount, 6)
    : BigInt(0);

  // Determine if approval is needed: connected, valid amount, and current allowance is less than desired amount
  const isApprovalNeeded =
    isConnected &&
    isUsdcAmountValid &&
    usdcAllowance !== undefined &&
    usdcAllowance < usdcAmountBigInt;

  // Helper function to render the ETH purchase button
  const renderEthButton = () => {
    if (!mounted) {
      // Render a placeholder during server rendering and initial client hydration
      return (
        <div className="h-12 w-full rounded-lg bg-gray-700/50 animate-pulse">
          hydration on waga app
        </div>
      );
    }

    if (isConnected) {
      return (
        <Web3Button
          onClick={handleBuyWithEthWithToast}
          className="w-full py-3 relative overflow-hidden group"
          variant="gradient"
          disabled={isPendingEth || isConfirmingBuyEth}
        >
          <span className="relative z-10">
            {isPendingEth || isConfirmingBuyEth
              ? "Processing ETH Purchase..."
              : "Buy WAGA Token with ETH"}
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </Web3Button>
      );
    } else {
      return (
        <Button
          onClick={handleBuyWithEthWithToast}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-medium transition-all duration-200"
        >
          Connect Wallet to Buy
        </Button>
      );
    }
  };

  // Helper function to render the USDC purchase/approval button
  const renderUsdcButton = () => {
    if (!mounted) {
      // Render a placeholder during server rendering and initial client hydration
      return (
        <div className="h-12 w-full rounded-lg bg-gray-700/50 animate-pulse"></div>
      );
    }

    if (isConnected) {
      return (
        <Web3Button
          onClick={handleBuyWithUsdcWithToast}
          className="w-full py-3 relative overflow-hidden group"
          variant="dual-gradient" // Use a distinct variant
          disabled={
            !isUsdcAmountValid || // Disable if USDC amount is not valid
            isApprovePending ||
            isConfirmingApprove ||
            isPendingEth || // Check for general purchase pending state
            isConfirmingBuyEth // Check for general purchase confirming state
          }
        >
          <span className="relative z-10">
            {isApprovePending
              ? "Approving USDC..." // During approval transaction pending
              : isConfirmingApprove
              ? "Confirming Approval..." // During approval transaction confirmation
              : isPendingEth || isConfirmingBuyEth
              ? "Processing Purchase..." // During USDC buy transaction (pending/confirming)
              : isApprovalNeeded
              ? `Approve & Buy with USDC` // If approval is needed
              : "Buy WAGA Tokens with USDC"}{" "}
            {/* If allowance is sufficient, just buy */}
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </Web3Button>
      );
    } else {
      return (
        <Button
          onClick={handleBuyWithUsdcWithToast}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-medium transition-all duration-200"
        >
          Connect Wallet to Buy
        </Button>
      );
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
          {/* Transaction status messages for ETH */}
          <div className="min-h-[24px] text-center">
            {isPendingEth && (
              <div className="mt-4 text-yellow-500 animate-pulse">
                ETH transaction submitted...
              </div>
            )}
            {isConfirmingBuyEth && (
              <div className="mt-4 text-yellow-500 animate-pulse">
                Waiting for ETH confirmation...
              </div>
            )}
          </div>
          {/* Buy ETH Button */}
          <div className="pt-2">
            {renderEthButton()} {/* Call the helper function */}
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

          {/* Display Current Allowance */}
          {isConnected && (
            <div className="bg-black/40 rounded-lg p-3 text-sm flex justify-between items-center border border-purple-500/20">
              <span className="text-gray-400">Approved for TokenShop:</span>
              <span className="text-purple-300 font-medium">
                {currentUsdcAllowanceFormatted} USDC
              </span>
            </div>
          )}

          {/* Transaction status messages for USDC (approval or buy) */}
          <div className="min-h-[24px] text-center">
            {isApprovePending || isConfirmingApprove ? (
              <div className="mt-4 text-yellow-500 animate-pulse">
                {isApprovePending
                  ? "Approving USDC in wallet..."
                  : "Confirming approval..."}
              </div>
            ) : (
              (isPendingEth || isConfirmingBuyEth) && ( // Reusing these props for USDC buy status
                <div className="mt-4 text-yellow-500 animate-pulse">
                  {isPendingEth
                    ? "USDC purchase submitted..."
                    : "Waiting for USDC purchase confirmation..."}
                </div>
              )
            )}
          </div>

          {/* Combined Approve/Buy USDC Button */}
          <div className="pt-2">
            {renderUsdcButton()} {/* Call the helper function */}
          </div>
        </div>
      )}
    </div>
  );
}
