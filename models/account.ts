import { db } from "basebot";
import {Keypair} from 'npm:@solana/web3.js'

export const createKeypair = async (userId:number) => {
    const keypair = Keypair.generate();
    await db.set(['account',userId], keypair.secretKey)
    return keypair
}

export const getKeypair = async (userId:number) => {
    const keypair = await db.get<Uint8Array>(['account',userId])
    if (!keypair || keypair.value == null) {
        return await createKeypair(userId)
    }
    return Keypair.fromSecretKey(keypair.value)
}

export const setSlippage = (id:number,s:number) => {
    return db.set(['settings',id,'slippage'],s)
}
export const getSlippage = (id:number) => {
    return db.get<number>(['settings',id,'slippage'])
}

export interface IMyTokenInfo {
    symbol: string,
    balance:number,
    name:string,
    price: number
}
export const saveMyTokens = (id:number,tokenAddress: string,tokenInfo:IMyTokenInfo) => {
    return db.set(['my','token',id,tokenAddress],tokenInfo)
}
export const getMyTokens = async (id:number) => {
    const iter = await db.list<IMyTokenInfo>({
        prefix: ['my','token',id]
    })

    const tokens:Array<IMyTokenInfo & {address: string}> = []
    for await (const token of iter) {
        if (token.value.balance > 0) {
            tokens.push({
                address: token.key[3].toString(),
                balance: token.value.balance,
                symbol: token.value.symbol,
                name: token.value.name,
                price: token.value.price
            })
        }
    }

    return tokens
}
