"use client";

import { useCallback, useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEuergetes } from "./useEuergetes";
import { toast } from "sonner";
import { getTipperStatsPda } from "../lib/utilities";
import { connection } from "../lib/connection";

export interface TipperStatsView {
  walletBalance: number;
  totalTips: number;
  totalTipAmountInSol: number;
  biggestTipInSol: number;
  lastTipISO: string | null;
  pda: string;
  exists: boolean;
}

export function useTipperStats() {
  const { program, wallet } = useEuergetes();

  const [stats, setStats] = useState<TipperStatsView | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!program) {
      return;
    }

    const tipperPubkey = wallet?.publicKey;

    if (!tipperPubkey) {
      setStats(null);
      setError("No tipper public key available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [tipperStatsPda] = getTipperStatsPda(
        tipperPubkey,
        program.programId
      );

      try {
        const tipperBalance = await connection.getBalance(tipperPubkey);
        const account = await program.account.tipperStats.fetch(tipperStatsPda);
        const totalTips = Number(account.totalTips);
        const totalTipAmount = Number(account.totalAmount);
        const biggestTip = Number(account.biggestTip);
        const lastTip = Number(account.lastTip);
        const lastTipTs = new Date(lastTip * 1000).toISOString();

        setStats({
          walletBalance: tipperBalance / LAMPORTS_PER_SOL,
          totalTips: totalTips,
          totalTipAmountInSol: totalTipAmount / LAMPORTS_PER_SOL,
          biggestTipInSol: biggestTip / LAMPORTS_PER_SOL,
          lastTipISO: lastTip === 0 ? null : lastTipTs,
          pda: tipperStatsPda.toBase58(),
          exists: true,
        });
      } catch (e) {
        console.log("Error fetching tipper stats:", e);
        const tipperBalance = await connection.getBalance(tipperPubkey);
        setStats({
          walletBalance: tipperBalance / LAMPORTS_PER_SOL,
          totalTips: 0,
          totalTipAmountInSol: 0,
          biggestTipInSol: 0,
          lastTipISO: null,
          pda: tipperPubkey.toBase58(),
          exists: false,
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch fan stats");
      toast.error(`Failed to fetch tipper stats: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [program, wallet?.publicKey]);

  useEffect(() => {
    fetchStats();
  }, [stats]);

  return { stats, loading, error, refetch: fetchStats };
}
