import { createPublicClient, http } from "viem";
import { worldchain } from "viem/chains";

export const publicClient = createPublicClient({
  chain: worldchain,
  transport: http(),
});