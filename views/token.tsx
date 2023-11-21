import { MessageHandler, utils, router, CallbackHandler } from "basebot";
import { CallbackQuery, Message } from "npm:@types/node-telegram-bot-api";
import { getQuote } from "../api/swapv6.ts";
import { getPrice } from "../api/pricev4.ts";
import { search ,getBalance} from "../api/token.ts";
type SwapType = 'Buy' | 'Sell' | 'Unknow';
const TokenView = async (query: string,swapType:SwapType) => {
    const tokenInfo = await search(query)

    if (!tokenInfo) {
        return {
            node: <div>🔴 Token not found, please confirm the token address or name</div>,
            btns: [
                [
                    {
                        text: "↩️ Main Menu",
                        callback_data: "/start"
                    }
                ]
            ]
        }
    }

    const {price,vsTokenSymbol} = await getPrice(tokenInfo?.address||query)

    
    // console.log(banlance)
    return {
        node: <div>
            <div>🪙 Token: {tokenInfo?.name} [{tokenInfo?.symbol}] </div>
            <div>💻 Decimals: {tokenInfo?.decimals}</div>
            <div>🤑 Price: {price} {vsTokenSymbol} </div>
        </div>,
        btns: [
            [
                {
                    text: '📈 Buy Token',
                    callback_data:'/swap:buy:' + tokenInfo.address
                }
                ,
                {
                    text: '📉 Sell Token',
                    callback_data: '/swap:sell:' + tokenInfo.address
                }
            ],
            [
                {
                    text: '↩️ Main Menu',
                    callback_data: "/start"
                }
            ]
        ]
    }
}
export const Token:MessageHandler = async (msg:Message)=> {
    return TokenView(msg.text!,'Unknow')
}