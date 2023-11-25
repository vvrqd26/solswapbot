import { CallbackHandler, MessageHandler } from "basebot";
import { getMyTokens } from "../models/account.ts";
import { CallbackQuery, Message } from "npm:@types/node-telegram-bot-api";
import { getBalanceById } from "../api/token.ts";

export const MyTokensView = async (id: number) => {
  const tokens = await getMyTokens(id);
  const balance = await getBalanceById(id);
  return {
    node: (
      <div>
        <div>SOL Balance: {balance}</div>
      </div>
    ),
    btns: [
      [
        {
          text: "↩️ Main Menu",
          callback_data: "/start",
        },
      ],
      [
        {
          text: "⬇️ My Tokens ⬇️",
          callback_data: "_",
        },
      ],
      ...tokens.map((token) => {
        return [
          {
            text: `${token.name} [${token.balance}] `,
            callback_data: `-`,
          },
          {
            text: "↔️ Sell",
            callback_data: `/swap:sell:${token.address}`,
          },
        ];
      }),
    ],
  };
};

export const MyTokens: MessageHandler = async (msg: Message) => {
  return await MyTokensView(msg.chat.id);
};
export const MyTokensQuery: CallbackHandler = async (query: CallbackQuery) => {
  return await MyTokensView(query.from.id);
};
