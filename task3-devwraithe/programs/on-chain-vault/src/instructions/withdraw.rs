//-------------------------------------------------------------------------------
use crate::errors::VaultError;
use crate::events::WithdrawEvent;
use crate::state::Vault;
///
/// TASK: Implement the withdraw functionality for the on-chain vault
///
/// Requirements:
/// - Verify that the vault is not locked
/// - Verify that the vault has enough balance to withdraw
/// - Transfer lamports from vault to vault authority
/// - Emit a withdraw event after successful transfer
///
///-------------------------------------------------------------------------------
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Withdraw<'info> {
    // TODO: Add required accounts and constraints
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub vault_authority: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", vault_authority.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

pub fn _withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    // TODO: Implement withdraw functionality
    // todo!()

    let vault = &mut ctx.accounts.vault;
    let vault_authority = &mut ctx.accounts.vault_authority;

    // Verify that the vault is not locked
    require!(vault.locked == false, VaultError::VaultLocked);

    // Verify that the vault has enough balance to withdraw
    let vault_balance = vault.get_lamports();
    require!(vault_balance >= amount, VaultError::InsufficientBalance);

    // Transfer lamports from vault to vault_authority
    // Using manual transfer because vault PDA has data allocated to it
    **vault.to_account_info().try_borrow_mut_lamports()? -= amount;
    **vault_authority
        .to_account_info()
        .try_borrow_mut_lamports()? += amount;

    emit!(WithdrawEvent {
        amount,
        vault_authority: vault_authority.key(),
        vault: vault.key(),
    });

    Ok(())
}
