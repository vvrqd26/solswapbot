

import { Connection,clusterApiUrl,PublicKey } from "npm:@solana/web3.js"
import {createAssociatedTokenAccount,getMint,getAssociatedTokenAddressSync} from 'npm:@solana/spl-token'
import { getKeypair } from "../models/account.ts";


const baseURL = 'https://token.jup.ag/all'
export const connection = new Connection(clusterApiUrl('mainnet-beta'))

interface ITokenInfo {
    name:string,
    address: string,
    chainId: number,
    decimals: number,
    symbol: "SOL",
    logoURI: string,
    tags: Array<string>
    extensions: Record<string,string>
}
let list:Array<ITokenInfo> = []

const fetchTokenList = async ()=> {
    const res = await fetch(baseURL)
    const json = await res.json()
    list = json

    setTimeout(()=>{
        fetchTokenList()
    },1000 * 60 * 5)
}

fetchTokenList()

export const getTokenInfo = (address:string)=> {
    return list.find(t=>t.address===address)
}
export const search = (query:string) => {
    return list.find(item=> {
        return item.address === query || item.name == query || item.symbol.toLocaleUpperCase() == query.toUpperCase() || item.name.includes(query) || item.symbol.toUpperCase().includes(query.toLocaleLowerCase())
    })
}

export const getBalanceById = async (id:number) => {
    const keyPair = await getKeypair(id)
    if (keyPair == null) return 0
    return (await connection.getBalance(keyPair.publicKey))/1e9
}
export const getBalanceByTokenAddress = async (tokenAddress:string,pubkey: string) =>{
    const address = await getAssociatedTokenAddressSync( new PublicKey(tokenAddress),new PublicKey(pubkey))
    const res = (await connection.getTokenAccountBalance(address))
    return res.value.uiAmount ?? 0
}
export const getBalanceByTokenAddressAndId = async (tokenAddress:string,id:number) =>{
    try {
        const keyPair = await getKeypair(id)
        if (keyPair == null) return 0
        return await getBalanceByTokenAddress(tokenAddress,keyPair.publicKey.toBase58())        
    } catch (e) {
        return 0
    }
}

export const getBalance = async (publicKey:PublicKey) => {
    
    return (await connection.getBalance(publicKey))/1e9
}


