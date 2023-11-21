import { CallbackHandler, bot, router } from "basebot";
import { CallbackQuery } from "npm:@types/node-telegram-bot-api";
import { getBalance, getBalanceById, search } from "../api/token.ts";
import { getPrice } from "../api/pricev4.ts";
import { execTx, getSwapTx } from "../api/swapv6.ts";
import { getSlippage } from "../models/account.ts";

export const Swap: CallbackHandler = async (msg: CallbackQuery) => {
  const { args } = router.parseCommand(msg.data!);
  const swapType = args[0];
  const tokenAddress = args[1] ?? "";
  const amount = Number(args[2] ?? "1");
  const custom = args[3] ?? false;
  const tokenInfo = await search(tokenAddress);
  const balance = await getBalanceById(msg.from.id);
  const slippage = (await getSlippage(msg.from.id)).value ?? 0.5;
  if (args[4]) {
    if (balance < amount) {
      bot.answerCallbackQuery(msg.id, {
        text: "⚠️ You don't have enough balance",
        show_alert: true,
      });
    } else {
      const [inputMint, outputMint] =
        swapType == "buy"
          ? ["So11111111111111111111111111111111111111112", tokenAddress]
          : [tokenAddress, "So11111111111111111111111111111111111111112"];
      const tx = await getSwapTx(
        msg.from.id,
        inputMint,
        outputMint,
        amount,
        slippage * 100
      );
      const txid = execTx(tx);
      bot.sendMessage(msg.from.id, `✅ Swap transaction sent, TXID: ${txid}`);
    }
  }
  if (!tokenInfo) {
    return {
      node: (
        <div>🔴 Token not found, please confirm the token address or name</div>
      ),
      btns: [
        [
          {
            text: "↩️ Main Menu",
            callback_data: "/start",
          },
        ],
      ],
    };
  }

  const { price, vsTokenSymbol } = await getPrice(tokenInfo?.address);

  return {
    node: (
      <div>
        {swapType} Tokens <br />
        <div>
          🪙 Name: {tokenInfo?.name} [{tokenInfo?.symbol}]{" "}
        </div>
        <div>💻 Decimals: {tokenInfo?.decimals}</div>
        <div>
          🤑 Price: {price} {vsTokenSymbol}{" "}
        </div>
        <br />
        <div>⬩ Balance: {balance} SOL</div>⬩ {swapType} Amount: {amount} SOL{" "}
        <br />
      </div>
    ),
    btns: [
      [
        {
          text: "↩️ Cancel",
          callback_data: "/start",
        },
      ],
      [
        {
          text: `💵 ${swapType} Amount 💵`,
          callback_data: `noaction`,
        },
      ],

      [
        {
          text: (amount == 0.5 ? "✅" : " ") + "0.5 SOL",
          callback_data: `/swap:${swapType}:${tokenAddress}:5`,
        },
        {
          text: (amount == 1 ? "✅" : " ") + "1 SOL",
          callback_data: `/swap:${swapType}:${tokenAddress}:1`,
        },
        {
          text: (amount == 5 ? "✅" : " ") + "5 SOL",
          callback_data: `/swap:${swapType}:${tokenAddress}:5`,
        },
      ],
      [
        {
          text: (amount == 10 ? "✅" : " ") + "10 SOL",
          callback_data: `/swap:${swapType}:${tokenAddress}:10`,
        },
        {
          text: "custom",
          callback_data: `/swap:${swapType}:${tokenAddress}:0:t`,
        },
      ],
      [
        {
          text: "🛒 Confirm",
          callback_data: `/swap:${swapType}:${tokenAddress}:${amount}:${
            custom == "t" ? "t" : "f"
          }:t`,
        },
      ],
    ],
  };
};
