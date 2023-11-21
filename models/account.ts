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
