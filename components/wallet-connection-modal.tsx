"use client";
import { useWallet } from "@/context/wallet-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAccount, useConnect } from "wagmi";

export function WalletConnectionModal() {
  const { isModalOpen, closeConnectModal } = useWallet();
  const { isConnected } = useAccount();
  const { connectors, connect } = useConnect();

  return (
    <Dialog open={!isConnected && isModalOpen} onOpenChange={closeConnectModal}>
      <DialogContent
        className="web3-card-featured web3-card-glow sm:max-w-md max-h-[90vh] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 will-change-transform"
        style={{ transform: "translate(-50%, -50%) translateZ(0)" }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center web3-gradient-text">
            Connect Your Wallet
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-center text-muted-foreground mb-6">
            Connect your wallet to join waitlists, access exclusive content, and
            participate in the WAGA ecosystem
          </p>
          <div className="space-y-3">
            {connectors.map((connector) => (
              <Button
                key={connector.id}
                variant="outline"
                className="w-full justify-between border-purple-500/30 hover:border-purple-500/60 bg-black/30 backdrop-blur py-6"
                onClick={() => connect({ connector })}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <img
                      src={connector.icon || "/placeholder.svg"}
                      alt={connector.name}
                      className="h-6 w-6"
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{connector.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {/* {connector.discription} */}
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </Button>
            ))}
          </div>
        </div>
        <div className="text-xs text-center text-muted-foreground">
          By connecting your wallet, you agree to our Terms of Service and
          Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
}
