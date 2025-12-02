#![allow(deprecated, unexpected_cfgs)]
use anchor_lang::prelude::*;

mod constants;
mod errors;
mod events;
mod instructions;
mod states;

use instructions::*;

declare_id!("EjYxegxKpBLxr1cZfbVzkGKWdD31F4w23kd5x2AMeB11");

#[program]
pub mod euergetes {
    use super::*;

    pub fn send_tip(ctx: Context<SendTip>, amount: u64) -> Result<()> {
        send_tip::handler(ctx, amount)
    }
}
