use anchor_lang::prelude::*;

#[error_code]
pub enum TipError {
    #[msg("Cannot send tip to yourself")]
    NoSelfTip,
    #[msg("Tip amount must be greater than zero")]
    InvalidAmount,
    #[msg("Tip amount is below the allowed minimum")]
    BelowMinimumTip,
    #[msg("Tip amount exceeds the allowed maximum")]
    ExceedsMaximumTip,
    #[msg("Insufficient funds to process this tip")]
    InsufficientFunds,
}

#[error_code]
pub enum MathError {
    #[msg("Math overflow occurred")]
    Overflow,
}
