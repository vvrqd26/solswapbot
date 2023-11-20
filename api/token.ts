

import { Connection,clusterApiUrl,PublicKey } from "npm:@solana/web3.js"
import {createAssociatedTokenAccount} from 'npm:@solana/spl-token'
import { getKeypair } from "../models/account.ts";


const baseURL = 'https://token.jup.ag/all'

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
        return item.address === query || item.name.includes(query) || item.symbol.toUpperCase().includes(query.toLocaleLowerCase())
    })
}

export const getBalance = async (id:number,address:string) => {
    const connection = new Connection(clusterApiUrl('mainnet-beta'))
    const kp = await getKeypair(id)
    
    return balance
}


