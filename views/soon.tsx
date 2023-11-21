import { CallbackQuery } from "npm:@types/node-telegram-bot-api";
import type { CallbackHandler, } from "basebot";

export const SoonView = ()=> {
    return {
        node: <div>
                🏃‍♀️ 🏃‍♀️ 🏃‍♀️ Coming soon! 🏃‍♂️ 🏃‍♂️ 🏃‍♂️<br />
                <br />
                💓 We are developing this feature, please continue to follow us  
                <br />
                <br />
                📧 Contact us: <br />
                ----- https://twitter.com/SOLANA_BOT_ <br />
                ----- https://t.me/SOLBOTPORTAL
            </div>,
        btns: [
            [
                {
                    text: "↩️ Main Menu",
                    callback_data: '/start'
                }
            ]
        ],
        opts: {
            disable_web_page_preview: true
        }
    }
}

export const SoonQuery:CallbackHandler = async (query:CallbackQuery) => {
    return SoonView();
}