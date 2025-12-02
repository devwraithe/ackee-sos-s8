'use client';

import { WalletMultiButton } from "../lib/utilities";

export default function HeaderSection() {
    return (
        <header className="border-b border-neutral-800 bg-black/40 ">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-white select-none">Euergetes 🏺</h1>
                <WalletMultiButton />
            </div>
        </header>
    );
}