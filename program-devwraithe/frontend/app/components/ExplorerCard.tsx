type Props = {
    txnStatus: string,
    txnSignature: string,
}

export default function ExplorerCard({ txnStatus, txnSignature }: Props) {
    const status = txnStatus;
    const signature = txnSignature;

    return (
        <div className="w-full mt-6">
            {status?.includes("✅") || status?.includes("❌") ? (
                <a
                    href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                >
                    {signature && (
                        <div className="px-5 py-4 rounded-lg border-2 border-neutral-700 bg-neutral-800 flex items-center justify-center gap-2">
                            <span className="text-white text-sm">View on Explorer</span>
                            <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </div>
                    )}
                </a>
            ) : null}
        </div>

    );
}