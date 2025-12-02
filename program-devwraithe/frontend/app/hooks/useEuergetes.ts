"use client";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { getProgram } from "../lib/program";
import { connection } from "../lib/connection";

export function useEuergetes() {
  const wallet = useAnchorWallet();

  if (!wallet) {
    console.log("No wallet. Return 'null'.");
    return { program: null, provider: null, wallet: null };
  }

  const { program, provider } = getProgram(wallet, connection);

  return { program, provider, wallet };
}
