use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

use crate::constants::{MAX_TIP_AMOUNT, MIN_TIP_AMOUNT, TIPPER_STATS_SEED};
use crate::errors::{MathError, TipError};
use crate::events::TipSentEvent;
use crate::states::TipperStats;

#[derive(Accounts)]
pub struct SendTip<'info> {
    #[account(mut)]
    pub tipper: Signer<'info>,

    #[account(mut)]
    pub receiver: SystemAccount<'info>,

    #[account(
        init_if_needed,
        payer = tipper,
        space = 8 + TipperStats::INIT_SPACE,
        seeds = [TIPPER_STATS_SEED.as_bytes(), tipper.key().as_ref()],
        bump
    )]
    pub tipper_stats: Account<'info, TipperStats>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<SendTip>, amount: u64) -> Result<()> {
    let tipper = &ctx.accounts.tipper;
    let receiver = &ctx.accounts.receiver;

    // Verify tipper cannot tip themselves
    require!(tipper.key() != receiver.key(), TipError::NoSelfTip);

    // Verify tipper has enough funds to tip
    require!(amount <= tipper.lamports(), TipError::InsufficientFunds);

    // Verify tipper inputs a valid amount
    require!(amount > 0, TipError::InvalidAmount);

    // Verify tip amount is within threshold
    require!(amount >= MIN_TIP_AMOUNT, TipError::BelowMinimumTip);
    require!(amount <= MAX_TIP_AMOUNT, TipError::ExceedsMaximumTip);

    let transfer_accounts = Transfer {
        from: tipper.to_account_info(),
        to: receiver.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        transfer_accounts,
    );
    transfer(cpi_ctx, amount)?;

    // Init or update tipper stats
    let tipper_stats = &mut ctx.accounts.tipper_stats;
    if tipper_stats.tipper == Pubkey::default() {
        tipper_stats.tipper = tipper.key();
        tipper_stats.total_tips = 0;
        tipper_stats.total_amount = 0;
        tipper_stats.biggest_tip = 0;
        tipper_stats.last_tip = 0;
    }

    tipper_stats.total_tips = tipper_stats
        .total_tips
        .checked_add(1)
        .ok_or(MathError::Overflow)?;

    tipper_stats.total_amount = tipper_stats
        .total_amount
        .checked_add(amount)
        .ok_or(MathError::Overflow)?;

    if amount > tipper_stats.biggest_tip {
        tipper_stats.biggest_tip = amount;
    }

    tipper_stats.last_tip = Clock::get()?.unix_timestamp;

    // Emit send tip event
    emit!(TipSentEvent {
        tipper: tipper.key(),
        receiver: receiver.key(),
        amount: amount,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}
