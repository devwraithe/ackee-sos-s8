"use client";

import { useState } from "react";
import { useSendTip } from "@/app/hooks/useSendTip";
import { PublicKey } from "@solana/web3.js";
import { toast } from "sonner";
import { MAX_TIP_AMOUNT, MIN_TIP_AMOUNT } from "../lib/utilities";
import ExplorerCard from "./ExplorerCard";

export default function SendTip() {
    const [receiver, setReceiver] = useState("");
    const [tipAmount, setTipAmount] = useState("");
    const [isValidReceiverAddr, setIsValidReceiverAddr] = useState(false);
    const { sendTip, status, loading, signature } = useSendTip();

    const handleReceiverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();

        setReceiver(value);

        try {
            if (value.length > 0) {
                new PublicKey(value);
                setIsValidReceiverAddr(true);
            } else {
                setIsValidReceiverAddr(false);
            }
        } catch {
            setIsValidReceiverAddr(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidReceiverAddr) {
            toast.error("Please enter a valid receiver address");
            return;
        }

        const tipAmountInSol = parseFloat(tipAmount);
        if (tipAmountInSol < MIN_TIP_AMOUNT || tipAmountInSol > MAX_TIP_AMOUNT) {
            toast.error(`Amount must be between ${MIN_TIP_AMOUNT} and ${MAX_TIP_AMOUNT} SOL`);
            return;
        }
        await sendTip(receiver, tipAmountInSol);
    };

    const quickAmounts = [0.01, 0.05, 0.1, 0.5, 1.0];

    return (
        <div className="lg:w-lg mx-auto p-6 lg:p-8 bg-neutral-900 border border-neutral-800 rounded-xl">
            <div className="mb-7">
                <h2 className="text-3xl font-semibold text-white mb-2">
                    Send a Tip 💸
                </h2>
                <p className="text-base text-gray-400">
                    Show your support with a SOL contribution
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* receiver Address Input */}
                <div>
                    <label className="block mb-3 text-sm font-medium text-gray-200">
                        Recipient Solana Address
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={receiver}
                            onChange={handleReceiverChange}
                            placeholder="Enter receiver wallet address"
                            className={`w-full px-4 py-4 rounded-lg bg-black border-2 transition-all focus:outline-none font-mono text-sm text-white placeholder:text-gray-600 ${receiver.length === 0
                                ? "border-neutral-800 focus:border-white"
                                : isValidReceiverAddr
                                    ? "border-white"
                                    : "border-red-500 focus:border-red-500"
                                }`}
                            required
                        />
                        {receiver.length > 0 && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                {isValidReceiverAddr ? (
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>
                        )}
                    </div>
                    {receiver.length > 0 && !isValidReceiverAddr && (
                        <p className="mt-2 text-xs text-red-400">
                            Invalid receiver address
                        </p>
                    )}
                </div>

                {/* Amount Input */}
                <div>
                    <label className="block mb-3 text-sm font-medium text-gray-200">
                        Amount to Tip (SOL)
                    </label>
                    <input
                        type="number"
                        step="0.001"
                        min="0.001"
                        max="1"
                        value={tipAmount}
                        onChange={(e) => setTipAmount(e.target.value)}
                        placeholder="0.1"
                        className="w-full px-4 py-4 rounded-lg bg-black border-2 border-neutral-800 focus:border-white focus:outline-none transition-all text-sm font-medium text-white placeholder:text-gray-600"
                        required
                    />

                    {/* Quick Amount Buttons */}
                    <div className="mt-4 grid grid-cols-5 gap-2">
                        {quickAmounts.map((amt) => (
                            <button
                                key={amt}
                                type="button"
                                onClick={() => setTipAmount(amt.toString())}
                                className={`py-3 px-2 rounded-lg border-2 text-sm font-medium transition-all hover:border-white hover:bg-white hover:text-black ${tipAmount === amt.toString()
                                    ? "border-white bg-white text-black"
                                    : "border-neutral-800 bg-black text-gray-300"
                                    }`}
                            >
                                {amt}
                            </button>
                        ))}
                    </div>

                    <p className="mt-4 text-sm text-gray-500">
                        Minimum {MIN_TIP_AMOUNT} SOL • Maximum {MAX_TIP_AMOUNT} SOL
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !isValidReceiverAddr || !tipAmount}
                    className="w-full py-4 rounded-lg bg-white text-black font-semibold transition-all hover:bg-gray-200 disabled:bg-neutral-800 disabled:text-gray-600 disabled:cursor-not-allowed active:scale-[0.98] text-base"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending Tip...
                        </span>
                    ) : (
                        "Send Tip"
                    )}
                </button>
            </form>

            <ExplorerCard txnStatus={status!} txnSignature={signature ?? ""} />
        </div >
    );
}