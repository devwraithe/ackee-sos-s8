use anchor_lang::prelude::*;

#[event]
pub struct TipSentEvent {
    pub tipper: Pubkey,
    pub receiver: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}
