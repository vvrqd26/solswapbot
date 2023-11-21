import { CallbackQuery, KeyboardButton, Message, SendMessageOptions } from "npm:@types/node-telegram-bot-api";
import { getKeypair } from "../models/account.ts";
import { CallbackHandler, MessageHandler } from "basebot";
import {Keypair} from 'npm:@solana/web3.js';
import { getBalance } from "../api/token.ts";

export const StartView = async (keypair:Keypair|null) => {
    let balance = 0
    if (keypair) {
        balance = await getBalance(keypair?.publicKey)        
    }

    const node =<div>
        😀 Welcome to use SOLBot!<br/>
        <div>💰 Your Wallet Address:</div>
        {keypair && <code>{keypair.publicKey.toBase58()}</code>}
        {keypair && <div>🏦 Balance: {balance} SOL</div>  }      
        <div>🔗 Please enter the token address or token name to query tokens and transactions.</div>
    </div>

    const btns = [
        [
            // {
            //     text: '📈 Buy Token',
            //     callback_data: '/swap:buy'
            // },
            // {
            //     text: '📉 Sell Token',
            //     callback_data: '/swap:sell'                
            // }
            {
                text: '💫 Swap',
                callback_data: '/inputToken'
            }
        ],
        [
            {
                text: '💱 Dollar Cost Average',
                callback_data: '/soon'
            },
            {
                text: '🤠 Limits Orders',
                callback_data: '/soon'
            }            
        ],
        [
            {
                text: '📜 Perpetual contract',
                callback_data: '/soon'
            },
            {
                text: '🏹 Token sniper',
                callback_data: '/soon'
            }            
        ],        
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
    return await StartView(keypair)
}
export const StartQuery:CallbackHandler = async (msg:CallbackQuery)=> {
    const keypair = await getKeypair(msg.from.id);
    return await StartView(keypair)
}
