import { Message, CallbackQuery } from "npm:@types/node-telegram-bot-api";
import React from "npm:react";
import {
  createKeypair,
  getKeypair,
  getSlippage,
  setSlippage,
} from "../models/account.ts";
import { binary_to_base58 } from "https://esm.sh/base58-js@2.0.0";
import { CallbackHandler, MessageHandler, router } from "basebot";
import { Keypair } from "npm:@solana/web3.js";
import { getBalance } from "../api/token.ts";

const WalletView = async (
  keypair: Keypair,
  showPrivateKey: boolean,
  isNewAccount: boolean,
  userId: number
) => {
  const balance = await getBalance(keypair.publicKey);
  const slipRes = await getSlippage(userId);
  const slippage = slipRes.value ?? 0.5;
  return {
    node: (
      <div>
        {isNewAccount ? (
          <div>✅ Create Wallet Success</div>
        ) : (
          <div>✅ Load Wallet Success</div>
        )}
        <div>💰 Your Wallet Address:</div>
        <code>{keypair.publicKey.toBase58()}</code>
        <div>🏦 Balance: {balance} SOL</div>
        <div>Tap to copy the address and send SOL to deposit </div>
        {showPrivateKey ? (
          <div>
            <div>🔑 Your Private Key:</div>
            <address>{binary_to_base58(keypair.secretKey)}</address>
          </div>
        ) : (
          ""
        )}
        <div></div>
      </div>
    ),
    btns: [
      [
        {
          text: " ↩️Main Menu",
          callback_data: "/start",
        },
      ],
      [
        {
          text: "-- SLIPPAEG --",
          callback_data: "/wallet:true",
        },
      ],
      [
        {
          text: (slippage == 0.5 ? "✅" : "") + "Low(0.5%)",
          callback_data: "/wallet:false:0.5",
        },
        {
          text: (slippage == 2.5 ? "✅" : "") + "Medium(2.5%)",
          callback_data: "/wallet:false:2.5",
        },
        {
          text: (slippage == 5 ? "✅" : "") + "High(5%)",
          callback_data: "/wallet:false:5",
        },
      ],
      [
        {
          text: "🌐 View on Solscan",
          url: "https://solscan.io/account/" + keypair.publicKey.toBase58(),
        },
      ],
      [
        showPrivateKey
          ? {
              text: "📜 Hide Private Key",
              callback_data: "/wallet:false",
            }
          : {
              text: "📜 Show Private Key",
              callback_data: "/wallet:true",
            },
      ],
    ],
  };
};

export const Wallet: MessageHandler = async (msg: Message) => {
  const userId = msg.from?.id ?? msg.chat.id;
  let keypair = await getKeypair(userId);
  let isNewAccount = false;

  if (keypair == null) {
    isNewAccount = true;
    keypair = await createKeypair(userId);
  }
  return await WalletView(keypair, false, isNewAccount, userId);
};

export const WalletQuery: CallbackHandler = async (msg: CallbackQuery) => {
  const { args } = router.parseCommand(msg.data ?? "");
  const userId = msg.from.id;
  const keypair = await getKeypair(userId);
  if (keypair == null)
    return {
      node: (
        <div>
          You do not have a wallet yet, click /wallet to create a wallet.
        </div>
      ),
    };
  console.log(args);
  if (args[1]) {
    await setSlippage(userId, Number(args[1]));
  }
  return await WalletView(keypair, args[0] == "true", false, userId);
};
