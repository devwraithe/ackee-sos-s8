//-------------------------------------------------------------------------------
///
/// TASK: Implement the remove reaction functionality for the Twitter program
///
/// Requirements:
/// - Verify that the tweet reaction exists and belongs to the reaction author
/// - Decrement the appropriate counter (likes or dislikes) on the tweet
/// - Close the tweet reaction account and return rent to reaction author
///
///-------------------------------------------------------------------------------
use anchor_lang::prelude::*;

use crate::errors::TwitterError;
use crate::states::*;

pub fn remove_reaction(ctx: Context<RemoveReactionContext>) -> Result<()> {
    // TODO: Implement remove reaction functionality
    // todo!()

    let tweet = &mut ctx.accounts.tweet;
    let tweet_reaction = &mut ctx.accounts.tweet_reaction;

    // Decrement the appropriate counter (likes or dislikes) on the tweet
    match tweet_reaction.reaction {
        ReactionType::Like => tweet.likes -= 1,
        ReactionType::Dislike => tweet.dislikes -= 1,
    }

    Ok(())
}

#[derive(Accounts)]
pub struct RemoveReactionContext<'info> {
    // TODO: Add required account constraints
    #[account(mut)]
    pub reaction_author: Signer<'info>,

    #[account(
        mut,
        // Verify tweet reaction exists and belongs to the reaction author
        has_one = reaction_author,
        // Close tweet reaction account and return rent to reaction author
        close = reaction_author,
        seeds = [
            TWEET_REACTION_SEED.as_bytes(),
            reaction_author.key().as_ref(),
            tweet.key().as_ref(),
        ],
        bump = tweet_reaction.bump,
    )]
    pub tweet_reaction: Account<'info, Reaction>,

    #[account(
        mut,
        seeds = [
            tweet.topic.as_bytes(),
            TWEET_SEED.as_bytes(),
            tweet.tweet_author.key().as_ref(),
        ],
        bump = tweet.bump,
    )]
    pub tweet: Account<'info, Tweet>,
}
