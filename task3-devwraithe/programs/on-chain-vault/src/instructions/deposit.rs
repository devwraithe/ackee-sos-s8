//-------------------------------------------------------------------------------
use crate::errors::VaultError;
use crate::events::DepositEvent;
use crate::state::Vault;
///
/// TASK: Implement the deposit functionality for the on-chain vault
///
/// Requirements:
/// - Verify that the user has enough balance to deposit
/// - Verify that the vault is not locked
/// - Transfer lamports from user to vault using CPI (Cross-Program Invocation)
/// - Emit a deposit event after successful transfer
///
///-------------------------------------------------------------------------------
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction::transfer;

#[derive(Accounts)]
pub struct Deposit<'info> {
    // TODO: Add required accounts and constraints
    #[account(mut)]
    pub user: Signer<'info>,
    // pub vault_authority: Signer<'info>, // remove vault_authority for deposit
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

pub fn _deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    // TODO: Implement deposit functionality
    // todo!()

    let user = &mut ctx.accounts.user;
    let vault = &mut ctx.accounts.vault;

    // Verify that the user has enough balance to deposit
    let user_balance = user.lamports();
    require!(user_balance >= amount, VaultError::InsufficientBalance);

    // Verify that the vault is not locked
    require!(vault.locked == false, VaultError::VaultLocked);

    // Transfer lamports from user to vault
    let transfer_ix = transfer(&user.key(), &vault.key(), amount);

    invoke(
        &transfer_ix,
        &[
            user.to_account_info(),
            vault.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    // Emit a deposit event
    emit!(DepositEvent {
        user: user.key(),
        vault: vault.key(),
        amount,
    });

    Ok(())
}
