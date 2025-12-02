import {
  AnchorProvider,
  Program,
  setProvider,
  workspace,
  web3,
  BN,
  AnchorError,
} from "@coral-xyz/anchor";
import { Euergetes } from "../target/types/euergetes";
import {
  airdropSol,
  getBalance,
  getTipperStatsPda,
  MAX_TIP_AMOUNT,
  MIN_TIP_AMOUNT,
} from "./utilities";
import { expect } from "chai";

describe("euergetes", () => {
  const provider = AnchorProvider.env();
  setProvider(provider);

  const program = workspace.Euergetes as Program<Euergetes>;

  const tipper = web3.Keypair.generate();
  const receiver = web3.Keypair.generate();

  let tipperStatsPda: web3.PublicKey;

  before(async () => {
    await airdropSol(provider.connection, tipper);
    [tipperStatsPda] = getTipperStatsPda(tipper.publicKey, program.programId);
  });

  it("should send a valid tip to receiver", async () => {
    const tipAmount = 5_000_000;

    await program.methods
      .sendTip(new BN(tipAmount))
      .accountsStrict({
        tipper: tipper.publicKey,
        receiver: receiver.publicKey,
        tipperStats: tipperStatsPda,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([tipper])
      .rpc();

    const receiverBalance = await getBalance(
      provider.connection,
      receiver.publicKey
    );
    expect(receiverBalance).to.equal(tipAmount);
  });

  it("should successfully update tipper stats after sending tip", async () => {
    const tipAmount = 2_000_000;

    const statsBefore = await program.account.tipperStats.fetchNullable(
      tipperStatsPda
    );
    const tipCountBefore = statsBefore ? statsBefore.totalTips.toNumber() : 0;
    const totalTippedBefore = statsBefore
      ? statsBefore.totalAmount.toNumber()
      : 0;

    await program.methods
      .sendTip(new BN(tipAmount))
      .accountsStrict({
        tipper: tipper.publicKey,
        receiver: receiver.publicKey,
        tipperStats: tipperStatsPda,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([tipper])
      .rpc();

    const statsAfter = await program.account.tipperStats.fetch(tipperStatsPda);

    expect(statsAfter.totalTips.toNumber()).to.equal(tipCountBefore + 1);
    expect(statsAfter.totalAmount.toNumber()).to.equal(
      totalTippedBefore + tipAmount
    );
    expect(statsAfter.tipper.toString()).to.equal(tipper.publicKey.toString());
  });

  it("should send minimum allowed tip amount successfully", async () => {
    const newReceiver = web3.Keypair.generate();
    const receiverBalanceBefore = await getBalance(
      provider.connection,
      newReceiver.publicKey
    );

    await program.methods
      .sendTip(new BN(MIN_TIP_AMOUNT))
      .accountsStrict({
        tipper: tipper.publicKey,
        receiver: newReceiver.publicKey,
        tipperStats: tipperStatsPda,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([tipper])
      .rpc();

    const receiverBalanceAfter = await getBalance(
      provider.connection,
      newReceiver.publicKey
    );

    expect(receiverBalanceAfter).to.equal(
      receiverBalanceBefore + MIN_TIP_AMOUNT
    );
  });

  it("should send maximum allowed tip amount successfully", async () => {
    const richTipper = web3.Keypair.generate();
    await airdropSol(provider.connection, richTipper);
    await airdropSol(provider.connection, richTipper); // Extra airdrop for max tip

    const [richTipperStatsPda] = getTipperStatsPda(
      richTipper.publicKey,
      program.programId
    );
    const newReceiver = web3.Keypair.generate();

    const receiverBalanceBefore = await getBalance(
      provider.connection,
      newReceiver.publicKey
    );

    await program.methods
      .sendTip(new BN(MAX_TIP_AMOUNT))
      .accountsStrict({
        tipper: richTipper.publicKey,
        receiver: newReceiver.publicKey,
        tipperStats: richTipperStatsPda,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([richTipper])
      .rpc();

    const receiverBalanceAfter = await getBalance(
      provider.connection,
      newReceiver.publicKey
    );

    expect(receiverBalanceAfter).to.equal(
      receiverBalanceBefore + MAX_TIP_AMOUNT
    );
  });

  it("should fail when tip amount is zero", async () => {
    try {
      await program.methods
        .sendTip(new BN(0))
        .accountsStrict({
          tipper: tipper.publicKey,
          receiver: receiver.publicKey,
          tipperStats: tipperStatsPda,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([tipper])
        .rpc();

      expect.fail("Should have thrown InvalidAmount error");
    } catch (err: any) {
      expect(err).to.be.instanceOf(AnchorError);
      expect(err.error.errorMessage).to.include(
        "Tip amount must be greater than zero"
      );
    }
  });

  it("should fail when tip is below minimum", async () => {
    try {
      await program.methods
        .sendTip(new BN(MIN_TIP_AMOUNT - 1))
        .accountsStrict({
          tipper: tipper.publicKey,
          receiver: receiver.publicKey,
          tipperStats: tipperStatsPda,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([tipper])
        .rpc();

      expect.fail("Should have thrown BelowMinimumTip error");
    } catch (err: any) {
      expect(err).to.be.instanceOf(AnchorError);
      expect(err.error.errorMessage).to.include(
        "Tip amount is below the allowed minimum"
      );
    }
  });

  it("should fail when tip exceeds maximum", async () => {
    try {
      await program.methods
        .sendTip(new BN(MAX_TIP_AMOUNT + 1))
        .accountsStrict({
          tipper: tipper.publicKey,
          receiver: receiver.publicKey,
          tipperStats: tipperStatsPda,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([tipper])
        .rpc();

      expect.fail("Should have thrown ExceedsMaximumTip error");
    } catch (err: any) {
      expect(err).to.be.instanceOf(AnchorError);
      expect(err.error.errorMessage).to.include(
        "Tip amount exceeds the allowed maximum"
      );
    }
  });

  it("should fail when tipper tries to tip themselves", async () => {
    try {
      await program.methods
        .sendTip(new BN(1_000_000))
        .accountsStrict({
          tipper: tipper.publicKey,
          receiver: tipper.publicKey,
          tipperStats: tipperStatsPda,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([tipper])
        .rpc();

      expect.fail("Should have thrown CannotTipSelf error");
    } catch (err: any) {
      expect(err).to.be.instanceOf(AnchorError);
      expect(err.error.errorMessage).to.include("Cannot send tip to yourself");
    }
  });
});
