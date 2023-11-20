import { MessageHandler, utils, router } from "basebot";
import { Message } from "npm:@types/node-telegram-bot-api";
import { getQuote } from "../api/swapv6.ts";
import { getPrice } from "../api/pricev4.ts";
import { search ,getBalance} from "../api/token.ts";
const SwapView = async (id:number,query: string) => {
    const tokenInfo = await search(query)
    const {price,vsTokenSymbol} = await getPrice(tokenInfo?.address||query)
    if (tokenInfo) {
        const banlance = await getBalance( id,tokenInfo.address)
    }
    
    // console.log(banlance)
    return {
        node: <div>
            <div>🪙 Token: {tokenInfo?.name} [{tokenInfo?.symbol}] </div>
            <div>💻 Decimals: {tokenInfo?.decimals}</div>
            <div>🤑 Price: {price} {vsTokenSymbol} </div>
        </div>,
        btns: [
            
        ]
    }
}
export const Swap:MessageHandler = async (msg:Message)=> {
    return SwapView(msg.chat.id,msg.text!)
}