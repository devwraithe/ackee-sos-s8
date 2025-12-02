# Euergetes - Frontend

This folder contains the NextJS-based frontend application for the Euergetes tipping dApp.

## Live Demo

**Deployed URL**: https://euergetes.vercel.app

## Structure

```
frontend/
├── app/
│   ├── components/        # Reusable React components
│   ├── hooks/             # Custom React hooks
│   ├── idl/               # Solana program IDLs
│   ├── lib/               # Utility functions (solana utils, constants, helpers)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout wrapper
│   ├── provider.tsx       # Context & provider setup (wallet, theme, etc.)
│   └── page.tsx           # Main entry page (homepage)
├── public/                # Static assets (icons, images, fonts)
└── package.json           # Project dependencies & scripts
```

## What's Inside

- **Wallet Integration**: Solana wallet adapter for connecting Phantom, Solflare, etc.
- **Tipping Interface**: Form to input recipient address and tip amount
- **Stats Display**: Shows user's tipping statistics (total tips, total amount, biggest tip)
- **Responsive Design**: Mobile-friendly UI built with modern React

## Development

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build
```
