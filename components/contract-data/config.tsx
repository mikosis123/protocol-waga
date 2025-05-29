import { http, createConfig } from "wagmi";
import { base, mainnet, baseSepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, base, baseSepolia],
  connectors: [],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http("https://sepolia.base.org"),
  },
});
