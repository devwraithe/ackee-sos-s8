"use client";

import { useCallback, useState } from "react";
import { BN } from "@coral-xyz/anchor";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useEuergetes } from "./useEuergetes";
import { connection } from "../lib/connection";
import {
  COMMITMENT_LEVEL,
  getTipperStatsPda,
  performTipAmountChecks,
} from "../lib/utilities";
import { toast } from "sonner";

export function useSendTip() {
  const { program, wallet, provider } = useEuergetes();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const sendTip = useCallback(
    async (receiverAddress: string, tipAmount: number) => {
      setStatus(null);
      setSignature(null);

      // Check wallet connection
      if (!wallet?.publicKey) {
        toast.warning("Connect your wallet first.");
        return;
      }

      // Check program initialization
      if (!program) {
        toast.warning("Program must be initialized.");
        return;
      }

      const tipper = wallet.publicKey;
      let receiver: PublicKey;

      try {
        receiver = new PublicKey(receiverAddress);
        console.log("Receiver address is ", receiver);
      } catch {
        toast.error("Invalid receiver address");
        return;
      }

      performTipAmountChecks(tipAmount);

      if (receiver.equals(tipper)) {
        toast.error("You cannot send tips to yourself");
        return;
      }

      const tipAmountInLamports = Math.floor(tipAmount * LAMPORTS_PER_SOL);

      try {
        const tipperBalance = await connection.getBalance(tipper);
        const feeBuffer = 5000;

        if (tipperBalance < tipAmountInLamports + feeBuffer) {
          toast.error("Insufficient balance for tip + fee.");
          return;
        }
      } catch {
        toast.error("Failed to fetch wallet balance.");
        return;
      }

      const [tipperStatsPda] = getTipperStatsPda(tipper, program.programId);

      try {
        setLoading(true);
        setStatus(`🔄 Sending ${tipAmount} SOL tip...`);

        const ixn = await program.methods
          .sendTip(new BN(tipAmountInLamports))
          .accountsStrict({
            tipper,
            receiver,
            tipperStats: tipperStatsPda,
            systemProgram: SystemProgram.programId,
          })
          .instruction();

        const txn = new Transaction().add(ixn);
        txn.feePayer = tipper;
        const signature = await provider.sendAndConfirm(txn, [], {
          commitment: COMMITMENT_LEVEL,
        });
        await connection.confirmTransaction(signature, COMMITMENT_LEVEL);

        setSignature(signature);
        toast.success(
          `Tip sent! ${tipAmount} SOL to ${receiverAddress.slice(
            0,
            4
          )}...${receiverAddress.slice(-4)}`
        );
        setStatus(`✅ ${tipAmount} SOL tip sent!`);
      } catch (err: any) {
        toast.error(`SendTip error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [wallet?.publicKey, program, connection]
  );

  return { sendTip, status, loading, signature };
}
