"use client";

import { useTipperStats } from "@/hooks/useTipperStats";
import { useWallet } from "@solana/wallet-adapter-react";
import ProfileCard from "./ProfileCard";
import { formatReadableDate } from "../lib/utilities";
import ProfileCardTwo from "./ProfileCardTwo";

export function TipperDashboard() {
    const { publicKey } = useWallet();
    const { stats } = useTipperStats();

    return (
        <div className="p-6 lg:p-8 bg-neutral-900 border border-neutral-800 rounded-xl space-y-4 lg:max-w-md text-white">
            <h3 className="text-xl font-semibold mb-6">Your Tipper Statistics 📊</h3>

            {!publicKey ? (
                <div className="p-6 bg-neutral-900 rounded-xl text-center text-neutral-400">
                    Connect wallet to see your stats
                </div>
            )
                :
                (
                    <div>
                        <div className="grid grid-cols-2 gap-3 lg:gap-6">
                            <ProfileCard title="Wallet Balance" value={`${(stats?.walletBalance ?? 0).toFixed(3)} SOL`} />
                            <ProfileCard title="Total Tips" value={stats?.totalTips ?? 0} />
                            <ProfileCard title="Total Tipped" value={`${(stats?.totalTipAmountInSol ?? 0).toFixed(3)} SOL`} />
                            <ProfileCard title="Biggest Tip" value={`${(stats?.biggestTipInSol ?? 0).toFixed(3)} SOL`} />
                        </div>
                        <ProfileCardTwo title="Last Tip Date" value={formatReadableDate(stats?.lastTipISO!)} />
                        <ProfileCardTwo title="Tipper Stats Public Key" value={(stats?.pda ?? "Not Available")} />
                    </div>
                )
            }
        </div>
    );
}
