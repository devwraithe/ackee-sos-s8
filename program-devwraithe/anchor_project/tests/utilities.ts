import * as anchor from "@coral-xyz/anchor";
import { web3 } from "@coral-xyz/anchor";

// Constants
export const MIN_TIP_AMOUNT = 1_000_000; // 0.001 SOL
export const MAX_TIP_AMOUNT = 1_000_000_000; // 1 SOL
export const TIPPER_STATS_SEED = "tipper-stats";

// PDA
export function getTipperStatsPda(
  tipperPubkey: web3.PublicKey,
  programId: web3.PublicKey
) {
  return web3.PublicKey.findProgramAddressSync(
    [Buffer.from(TIPPER_STATS_SEED), tipperPubkey.toBuffer()],
    programId
  );
}

// Functions
export async function airdropSol(
  connection: anchor.web3.Connection,
  keypair: anchor.web3.Keypair
) {
  const txn = await connection.requestAirdrop(
    keypair.publicKey,
    2 * anchor.web3.LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(txn, "confirmed");
}

export async function getBalance(
  connection: anchor.web3.Connection,
  publicKey: anchor.web3.PublicKey
): Promise<number> {
  return await connection.getBalance(publicKey);
}
