import { Message } from "npm:@types/node-telegram-bot-api";

export const social = async (msg: Message) => {
  return {
    node: (
      <div>
        📧 Contact us: <br />
        ----- https://twitter.com/SOLANA_BOT_ <br />
        ----- https://t.me/SOLBOTPORTAL <br />
        ----- http://docs.solbot.io/
        <br />
        ----- https://www.solbot.io <br />
      </div>
    ),
  };
};
