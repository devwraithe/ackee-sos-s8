import { PublicKey } from "@solana/web3.js";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Constants
export const LOCAL_RPC_URL = "http://127.0.0.1:8899";
export const DEV_RPC_URL = "https://api.devnet.solana.com";
export const MAIN_RPC_URL = "https://api.mainnet-beta.solana.com";
export const MAX_TIP_AMOUNT = 1; // 1 SOL
export const MIN_TIP_AMOUNT = 0.001; // 0.001 SOL
export const TIPPER_STATS_SEED = "tipper-stats";
export const COMMITMENT_LEVEL = "confirmed";

// Imports
export const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

// Functions
export function getTipperStatsPda(
  tipperPubkey: PublicKey,
  programId: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(TIPPER_STATS_SEED), tipperPubkey.toBuffer()],
    programId
  );
}

export function performTipAmountChecks(amount: number) {
  if (amount <= 0) {
    toast.error("Tip amount must be greater than 0.");
    return;
  }
  if (amount < MIN_TIP_AMOUNT) {
    toast.error(`Minimum tip amount is ${MIN_TIP_AMOUNT} SOL.`);
    return;
  }
  if (amount > MAX_TIP_AMOUNT) {
    toast.error(`Maximum tip amount is ${MAX_TIP_AMOUNT} SOL.`);
    return;
  }
}

export function formatReadableDate(isoString?: string) {
  if (!isoString) return "Not Available";

  const date = new Date(isoString);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  const hour = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${day}${suffix} ${month} ${year} at ${hour}`;
}
