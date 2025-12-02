# Project Description

**Deployed Frontend URL:** https://euergetes.vercel.app  
**Solana Program ID:** EjYxegxKpBLxr1cZfbVzkGKWdD31F4w23kd5x2AMeB11

## Project Overview

### Description

A decentralized instant tipping application built on Solana that enables users to send tips directly to content creators, service providers, or anyone with a Solana wallet. The dApp streamlines the tipping process by eliminating intermediaries and reducing transaction costs, while maintaining transparency through blockchain records. Users can send SOL tips instantly, and tippers can track their tipping statistics including total tips sent, total amount tipped, and their biggest tip. This dApp demonstrates practical Solana development concepts including SOL transfers, PDA-based user profiles, and real-time transaction processing.

### Key Features

- **Instant Tipping**: Send SOL tips directly to any wallet address with near-instant confirmation
- **Tipper Statistics**: Track your tipping activity including total tips sent, total amount, and biggest tip
- **Min/Max Limits**: Enforced minimum and maximum tip amounts for security and usability
- **Self-Tip Prevention**: Built-in protection against tipping your own wallet
- **Low Fees**: Leverage Solana's low transaction costs for micro-tipping

### How to Use the dApp

1. **Connect Wallet** - Connect your Solana wallet (Phantom, Solflare, etc.)
2. **Send a Tip** - Enter recipient's wallet address and tip amount in SOL
3. **Confirm Transaction** - Approve the transaction in your wallet
4. **View Stats** - Check your tipping statistics including total tips and amounts

## Program Architecture

The Tipping dApp uses a straightforward architecture with tipper profile accounts and a single core instruction for processing tips. The program leverages PDAs to create tipper profiles that track tipping statistics, while SOL transfers are handled through Solana's native system program for security and efficiency.

### PDA Usage

The program uses Program Derived Addresses to create unique tipper profile accounts.

**PDAs Used:**

- **Tipper Stats PDA**: Derived from seeds `["tipper-stats", tipper_wallet_pubkey]` - stores tipping statistics for each user including total tips sent, total amount tipped, biggest tip, and last tip timestamp

### Program Instructions

**Instructions Implemented:**

- **Send Tip**: Transfers SOL from tipper to recipient, creates/updates tipper stats profile, validates tip amount against min/max limits, prevents self-tipping, and records tip metadata (amount, timestamp)

### Account Structure

```rust
#[account]
#[derive(InitSpace)]
pub struct TipperStats {
    pub tipper: Pubkey,       // The wallet sending tips
    pub total_tips: u64,      // Total number of tips sent
    pub total_amount: u64,    // Total amount of SOL tipped (in lamports)
    pub biggest_tip: u64,     // Largest single tip amount sent
    pub last_tip: i64,        // Unix timestamp of most recent tip
}
```

## Testing

### Test Coverage

Comprehensive test suite with 8 tests covering successful tipping operations and error conditions to ensure program security, proper SOL transfers, and data integrity.

**Happy Path Tests (4 tests):**

- **Valid Tip Transfer**: Successfully sends tip to receiver and updates balances correctly
- **Tipper Stats Update**: Properly creates/updates tipper statistics (tip count, total amount, biggest tip)
- **Minimum Tip Amount**: Successfully processes tip at exact minimum allowed amount
- **Maximum Tip Amount**: Successfully processes tip at exact maximum allowed amount

**Unhappy Path Tests (4 tests):**

- **Zero Amount Tip**: Fails when attempting to send a tip of 0 SOL
- **Below Minimum Tip**: Fails when tip amount is below the enforced minimum threshold
- **Exceeds Maximum Tip**: Fails when tip amount exceeds the enforced maximum threshold
- **Self-Tipping Prevention**: Fails when user attempts to tip their own wallet address

### Running Tests

```bash
yarn install    # install dependencies
anchor test     # run tests
```

### Additional Notes for Evaluators

This project taught me a lot about real-world Solana development, particularly around handling native SOL transfers versus token transfers. The biggest challenges were properly implementing the system program CPI for SOL transfers and ensuring tipper profiles updated atomically with the transfer. I also learned the importance of input validation - implementing min/max tip limits and self-tip prevention added crucial security layers. The instant nature of Solana transactions makes this use case particularly compelling - tips arrive in seconds, which is perfect for live streaming or real-time content scenarios.
