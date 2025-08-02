import { http, createConfig } from "wagmi";
import { base, mainnet, baseSepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [],
  transports: {
    // [mainnet.id]: http(),
    // [base.id]: http(),
    [baseSepolia.id]: http(
      process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA_RPC_URL
    ),
  },
});
