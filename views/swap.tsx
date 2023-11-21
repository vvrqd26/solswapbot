import { CallbackHandler, router } from "basebot";
import { CallbackQuery } from "npm:@types/node-telegram-bot-api";
import { search } from "../api/token.ts";
import { getPrice } from "../api/pricev4.ts";

export const Swap:CallbackHandler = async (msg:CallbackQuery) => {

    const {args} = router.parseCommand(msg.data!)
    const swapType = args[0]
    const tokenAddress = args[1] ?? ''
    const amount = Number(args[2] ?? '1')
    const custom = args[3] ?? false
    const tokenInfo = await search(tokenAddress)
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

    const {price,vsTokenSymbol} = await getPrice(tokenInfo?.address)    

    return {
        node: <div>
            {swapType} Tokens <br />
            <div>🪙 Name: {tokenInfo?.name} [{tokenInfo?.symbol}] </div>
            <div>💻 Decimals: {tokenInfo?.decimals}</div>
            <div>🤑 Price: {price} {vsTokenSymbol} </div>            
            <br />
            <div>⬩ Balance: 0 SOL</div> 
            ⬩ {swapType} Amount: {amount} SOL <br />
        </div>,
        btns: [
            [
                {
                    text: "↩️ Cancel",
                    callback_data: "/start"
                }
            ],
            [
                {
                    text: `💵 ${swapType} Amount 💵`,
                    callback_data: `noaction`
                }
            ],
            ...(custom ? 
            [
                [
                    {
                        text: '1',
                        callback_data: `/swap:${swapType}:${tokenAddress}:${amount}1:true`
                    },
                    {
                        text: '2',
                        callback_data: `/swap:${swapType}:${tokenAddress}:${amount}2:true`
                    },
                    {
                        text: '3',
                        callback_data: `/swap:${swapType}:${tokenAddress}:${amount}3:true`
                    },                                
                ],
                [
                    {
                        text: '4',
                        callback_data: `/swap:${swapType}:${tokenAddress}:${amount}4:true`
                    },
                    {
                        text: '5',
                        callback_data: `/swap:${swapType}:${tokenAddress}:${amount}5:true`
                    },
                    {
                        text: '6',
                        callback_data: `/swap:${swapType}:${tokenAddress}:${amount}6:true`
                    },                                
                ],
                [
                    {
                        text: '7',
                        callback_data: `/swap:${swapType}:${tokenAddress}:${amount}7:true`
                    },
                    {
                        text: '8',
                        callback_data: `/swap:${swapType}:${tokenAddress}:${amount}8:true`
                    },
                    {
                        text: '9',
                        callback_data: `/swap:${swapType}:${tokenAddress}:${amount}9:true`
                    },                                
                ],
                [
                    {
                        text: '.',
                        callback_data: `/swap:${swapType}:${tokenAddress}:${amount}\.:true`
                    },
                    {
                        text: '0',
                        callback_data: `/swap:${swapType}:${tokenAddress}:${amount}0:true`
                    },
                    {
                        text: 'Delete',
                        callback_data: `/swap:${swapType}:${tokenAddress}:${amount.toString().slice(0,amount.toString().length-1)}`
                    },                                
                ]                                        
            ]
            :[
                [
                    {
                        text: (amount == 0.5?'✅':' ') + '0.5 SOL',
                        callback_data: `/swap:${swapType}:${tokenAddress}:5`
                    },
                    {
                        text: (amount == 1?'✅':' ') + '1 SOL',
                        callback_data: `/swap:${swapType}:${tokenAddress}:1`
                    },  
                    {
                        text: (amount == 5?'✅':' ') + '5 SOL',
                        callback_data: `/swap:${swapType}:${tokenAddress}:5`
                    },                              
                ],
                [
                    {
                        text: (amount == 10?'✅':' ') + '10 SOL',
                        callback_data: `/swap:${swapType}:${tokenAddress}:10`
                    },
                    {
                        text: 'custom',
                        callback_data: `/swap:${swapType}:${tokenAddress}:0:true`
                    },                             
                ],                
            ]),
            [
                {
                    text: '🛒 Confirm',
                    callback_data: `/swap:${swapType}:${tokenAddress}:${amount}:confirm`
                }
            ]
        ]
    }
}