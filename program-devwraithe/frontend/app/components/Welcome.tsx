'use client';

import FeatureCard from "./FeatureCard";

export function Welcome() {
    return (
        <div className="text-center py-12 md:py-20 px-4 max-w-3xl mx-auto">
            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                Welcome to Euergetes
            </h2>

            {/* Description */}
            <p className="text-md md:text-xl text-neutral-400 leading-relaxed">
                A decentralized tipping platform built on Solana to send tips instantly with low fees and lightning-fast transactions.
            </p>

            {/* Feature Highlights */}
            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <FeatureCard icon="⚡" title="Lightning Fast" value="Transactions confirmed in seconds" />
                <FeatureCard icon="💰" title="Low Fees" value="Pay fractions of a cent per transaction" />
                <FeatureCard icon="🔒" title="Secure" value="Non-custodial and fully decentralized" />
            </div>
        </div>
    );
}