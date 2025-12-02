//-------------------------------------------------------------------------------
use crate::events::ToggleLockEvent;
use crate::state::Vault;
///
/// TASK: Implement the toggle lock functionality for the on-chain vault
///
/// Requirements:
/// - Toggle the locked state of the vault (locked becomes unlocked, unlocked becomes locked)
/// - Only the vault authority should be able to toggle the lock
/// - Emit a toggle lock event after successful state change
///
///-------------------------------------------------------------------------------
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct ToggleLock<'info> {
    // TODO: Add required accounts and constraints
    #[account(mut)]
    pub vault_authority: Signer<'info>,
    // 'has_one' makes only thee vault authority toggle the lock
    #[account(mut, has_one = vault_authority)]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

pub fn _toggle_lock(ctx: Context<ToggleLock>) -> Result<()> {
    // TODO: Implement toggle lock functionality
    // todo!()

    let vault = &mut ctx.accounts.vault;
    let vault_authority = &mut ctx.accounts.vault_authority;

    // Toggle the locked state of the vault
    vault.locked = !vault.locked;

    // Emit toggle lock event
    emit!(ToggleLockEvent {
        vault: vault.key(),
        vault_authority: vault_authority.key(),
        locked: vault.locked,
    });

    Ok(())
}
