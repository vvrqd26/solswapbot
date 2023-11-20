import { CallbackQuery, KeyboardButton, Message, SendMessageOptions } from "npm:@types/node-telegram-bot-api";
import { getKeypair } from "../models/account.ts";
import { CallbackHandler, MessageHandler } from "basebot";
import {Keypair} from 'npm:@solana/web3.js';

export const StartView = (keypair:Keypair|null) => {
    const node =<div>
        😀 Welcome to use Solana Trading Bot!<br/>
        <div>🔗 Please enter the token address to query tokens and transactions.</div>
        {
            keypair == null ?
            <div>💵 You do not have a wallet yet<br/> click Create wallet Button to create a wallet.</div>:
            <div></div>
        }
    </div>

    const btns = [
        [
            {
                text: keypair == null ? "💰 Create Wallet" : "💰 Wallet",
                callback_data: "/wallet:false"
            },
        ]
    ]

    return {
        node,
        btns
    }    
}
export const Start:MessageHandler = async (msg:Message)=> {
    const keypair = await getKeypair(msg.from?.id ?? msg.chat.id);
    return StartView(keypair)
}
export const StartQuery:CallbackHandler = async (msg:CallbackQuery)=> {
    const keypair = await getKeypair(msg.from.id);
    return StartView(keypair)
}
