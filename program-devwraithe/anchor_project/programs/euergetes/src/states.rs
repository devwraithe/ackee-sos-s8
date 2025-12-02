use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct TipperStats {
    pub tipper: Pubkey,
    pub total_tips: u64,
    pub total_amount: u64,
    pub biggest_tip: u64,
    pub last_tip: i64,
}
