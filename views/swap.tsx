import { CallbackHandler, bot, router } from "basebot";
import { CallbackQuery } from "npm:@types/node-telegram-bot-api";
import {
  getBalance,
  getBalanceById,
  search,
  getBalanceByTokenAddressAndId,
} from "../api/token.ts";
import { getPrice } from "../api/pricev4.ts";
import { execTx, getSwapTx } from "../api/swapv6.ts";
import { IMyTokenInfo, getSlippage, saveMyTokens } from "../models/account.ts";

const confirmSwap = async (
  balance: number,
  amount: number,
  tokenAddress: string,
  swapType: string,
  msgId: string,
  chatId: number
) => {
  const slippage = (await getSlippage(chatId)).value ?? 0.5;

  if (balance < amount) {
    bot.answerCallbackQuery(msgId, {
      text: "⚠️ You don't have enough balance",
      show_alert: true,
    });
  } else {
    const [inputMint, outputMint] =
      swapType == "buy"
        ? ["So11111111111111111111111111111111111111112", tokenAddress]
        : [tokenAddress, "So11111111111111111111111111111111111111112"];
    const tx = await getSwapTx(
      chatId,
      inputMint,
      outputMint,
      amount * 1e9,
      slippage * 10
    );

    const txid = await execTx(tx);
    bot.sendMessage(chatId, `✅ Swap transaction sent, TXID: ${txid}`, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "↩️ Main Menu",
              callback_data: "/start",
            },
          ],
          [
            {
              text: "📔 My Tokens",
              callback_data: "/my_tokens",
            },
          ],
        ],
      },
    });
  }
};

export const Swap: CallbackHandler = async (msg: CallbackQuery) => {
  const { args } = router.parseCommand(msg.data!);
  const swapType = args[0];
  const tokenAddress = args[1] ?? "";
  const amount = Number(args[2] ?? "1");
  const custom = args[3] ?? "f";
  const confirm = args[4] ?? "f";
  const tokenInfo = await search(tokenAddress);
  const balance =
    swapType == "buy"
      ? await getBalanceById(msg.from.id)
      : await getBalanceByTokenAddressAndId(tokenAddress, msg.from.id);

  const tokenSymbol = swapType == "buy" ? "SOL" : tokenInfo?.symbol;

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

  const { price, vsTokenSymbol } = await getPrice(tokenInfo.address);
  if (confirm == "t") {
    confirmSwap(balance, amount, tokenAddress, swapType, msg.id, msg.from.id);
    if (tokenInfo && swapType == "buy") {
      const _balance = await getBalanceByTokenAddressAndId(
        tokenAddress,
        msg.from.id
      );
      saveMyTokens(msg.from.id, tokenAddress, {
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        balance: _balance,
        price: price,
      });
    }
  }

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
        <div>
          ⬩ Balance: {balance} {tokenSymbol}
        </div>
        ⬩ {swapType} Amount: {amount}
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
          text: `💵 ${swapType.toLocaleUpperCase()} Amount 💵`,
          callback_data: `noaction`,
        },
      ],

      [
        {
          text: (amount == 0.5 ? "✅" : " ") + "0.5 SOL",
          callback_data: `/swap:${swapType}:${tokenAddress}:0.5`,
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
          text: "Custom",
          callback_data: `/ia:${swapType}:${tokenAddress}:${amount}`,
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
