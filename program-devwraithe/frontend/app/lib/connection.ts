import { Connection } from "@solana/web3.js";
import { COMMITMENT_LEVEL, LOCAL_RPC_URL } from "./utilities";

export const connection = new Connection(LOCAL_RPC_URL, COMMITMENT_LEVEL);
