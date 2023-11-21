import { CallbackHandler, router } from "basebot";
import { CallbackQuery } from "npm:@types/node-telegram-bot-api";

export const InputAmount: CallbackHandler = async (msg: CallbackQuery) => {
  // 提示输入amount
  const { args } = router.parseCommand(msg.data ?? "");
  const [swapType, address, inamount] = args;

  return {
    node: (
      <div>
        🍍 Input Amount 🍍
        <br />
        <div>
          <strong>Amount:</strong>
          {inamount}
        </div>
      </div>
    ),
    btns: [
      [
        {
          text: "1",
          callback_data: `/ia:${swapType}:${address}:${inamount}1`,
        },
        {
          text: "2",
          callback_data: `/ia:${swapType}:${address}:${inamount}2`,
        },
        {
          text: "3",
          callback_data: `/ia:${swapType}:${address}:${inamount}3`,
        },
      ],
      [
        {
          text: "4",
          callback_data: `/ia:${swapType}:${address}:${inamount}4`,
        },
        {
          text: "5",
          callback_data: `/ia:${swapType}:${address}:${inamount}5`,
        },
        {
          text: "6",
          callback_data: `/ia:${swapType}:${address}:${inamount}6`,
        },
      ],
      [
        {
          text: "7",
          callback_data: `/ia:${swapType}:${address}:${inamount}7`,
        },
        {
          text: "8",
          callback_data: `/ia:${swapType}:${address}:${inamount}8`,
        },
        {
          text: "9",
          callback_data: `/ia:${swapType}:${address}:${inamount}9`,
        },
      ],
      [
        {
          text: ".",
          callback_data: `/ia:${swapType}:${address}:${inamount}.`,
        },
        {
          text: "0",
          callback_data: `/ia:${swapType}:${address}:${inamount}0`,
        },
        {
          text: "delete",
          callback_data: `/ia:${swapType}:${address}:${inamount
            .toString()
            .slice(0, inamount.toString().length - 1)}`,
        },
      ],
      [
        {
          text: "Confirm",
          callback_data: `/swap:${swapType}:${address}:${inamount}`,
        },
      ],
    ],
  };
};
