import { http, createConfig } from "wagmi";
import { base, mainnet, baseSepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [],
  transports: {
    // [mainnet.id]: http(),
    // [base.id]: http(),
    [baseSepolia.id]: http(
      "https://base-sepolia.g.alchemy.com/v2/_F1cwvEd3qO1dogdpKRhYZzsnB55S0uy"
    ),
  },
});
