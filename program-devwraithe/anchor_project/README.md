# Euergetes - Anchor Program

This folder contains the Solana program (smart contract) for the Euergetes tipping dApp, built using the Anchor framework.

## Program ID

**Devnet**: `EjYxegxKpBLxr1cZfbVzkGKWdD31F4w23kd5x2AMeB11`

## Structure

```
anchor_project/
├── programs/
│   └── euergetes/
│       └── src/
│           ├── instructions/      # All instruction handlers
│           │   ├── mod.rs
│           │   └── send_tip.rs
│           ├── constants.rs       # Program-wide constants
│           ├── events.rs          # Emitted program events
│           ├── states.rs          # Account state definitions (e.g., TipperStats)
│           ├── errors.rs          # Custom error definitions
│           └── lib.rs             # Program entry point & module exports
├── tests/
│   ├── euergetes.test.ts          # Main test suite
│   └── utilities.ts               # Test helper functions
├── Anchor.toml                    # Anchor configuration file
└── Cargo.toml                     # Rust dependencies for the program
```

## What's Inside

- **Program Logic**: The `send_tip` instruction that handles SOL transfers and tipper statistics tracking
- **State Management**: `TipperStats` account structure that stores user tipping data
- **Validation**: Min/max tip limits, zero amount checks, and self-tipping prevention
- **Tests**: 8 comprehensive tests covering happy and unhappy paths

## Build and Test

```bash
# Build the program
anchor build

# Run tests
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet
```
