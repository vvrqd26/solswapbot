import { Message,CallbackQuery } from "npm:@types/node-telegram-bot-api";
import React from 'npm:react'
import { createKeypair, getKeypair } from "../models/account.ts";
import { binary_to_base58 } from "https://esm.sh/base58-js@2.0.0"
import { CallbackHandler, MessageHandler,router } from "basebot";
import {Keypair} from 'npm:@solana/web3.js'

const WalletView = (keypair:Keypair,showPrivateKey:boolean,isNewAccount:boolean)=>{
    return {
        node: <div>
            {isNewAccount ? <div>✅ Create Wallet Success</div> : <div>✅ Load Wallet Success</div>}
            <div>💰 Your Wallet Public:</div>
            <code>{keypair.publicKey.toBase58()}</code>
            
            {
                showPrivateKey? <div><div>🔑 Your Private Key:</div><address>{binary_to_base58(keypair.secretKey)}</address></div>:""
            }
            <div></div>
        </div>,
        btns: [
            [
                showPrivateKey ?
                {
                    text: "📜 Hide Private Key",
                    callback_data: "/wallet:false"}
                :{
                    text: "📜 Show Private Key",
                    callback_data: "/wallet:true"
                }
            ],
            [
                {
                    text: " ↩️Main Menu",
                    callback_data: "/start"
                }
            ]
        ]        
    }
}

export const Wallet:MessageHandler = async (msg:Message)=> {
    const userId = msg.from?.id ?? msg.chat.id
    let keypair = await getKeypair(userId);
    let isNewAccount = false

    if (keypair == null) {
        isNewAccount = true
        keypair = await createKeypair(userId);
    }
    return WalletView(keypair,false,isNewAccount)
}

export const WalletQuery:CallbackHandler = async (msg:CallbackQuery)=>{
    const {args} = router.parseCommand(msg.data ?? '')
    const userId = msg.from.id
    const keypair = await getKeypair(userId);
    if (keypair == null) return {
        node: <div>You do not have a wallet yet, click /wallet to create a wallet.</div>
    }
    return WalletView(keypair,args[0] == 'true',false)
}