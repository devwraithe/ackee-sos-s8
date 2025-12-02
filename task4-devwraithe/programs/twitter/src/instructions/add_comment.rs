//-------------------------------------------------------------------------------
///
/// TASK: Implement the add comment functionality for the Twitter program
///
/// Requirements:
/// - Validate that comment content doesn't exceed maximum length
/// - Initialize a new comment account with proper PDA seeds
/// - Set comment fields: content, author, parent tweet, and bump
/// - Use content hash in PDA seeds for unique comment identification
///
///-------------------------------------------------------------------------------
use anchor_lang::prelude::*;
use anchor_lang::solana_program::hash::hash;

use crate::errors::TwitterError;
use crate::states::*;

pub fn add_comment(ctx: Context<AddCommentContext>, comment_content: String) -> Result<()> {
    // TODO: Implement add comment functionality
    // todo!()

    let tweet = &mut ctx.accounts.tweet;
    let comment = &mut ctx.accounts.comment;
    let comment_author = &mut ctx.accounts.comment_author;

    // Validate that comment content don't exceed maximum length
    let compare_comm_len = comment_content.len() <= COMMENT_LENGTH;
    require!(compare_comm_len, TwitterError::CommentTooLong);

    // Set comment fields
    comment.comment_author = comment_author.key();
    comment.parent_tweet = tweet.key();
    comment.content = comment_content.clone();
    comment.bump = ctx.bumps.comment;

    Ok(())
}

#[derive(Accounts)]
#[instruction(comment_content: String)]
pub struct AddCommentContext<'info> {
    // TODO: Add required account constraints
    #[account(mut)]
    pub comment_author: Signer<'info>,

    // Initialize a new comment account
    #[account(
        init,
        payer = comment_author,
        space = 8 + Tweet::INIT_SPACE,
        seeds = [
            COMMENT_SEED.as_bytes(),
            comment_author.key().as_ref(),
            // Use content hash in PDA seeds
            {hash(comment_content.as_bytes()).to_bytes().as_ref()},
            tweet.key().as_ref()
        ],
        bump,
    )]
    pub comment: Account<'info, Comment>,

    #[account(mut)]
    pub tweet: Account<'info, Tweet>,

    pub system_program: Program<'info, System>,
}
