import { getKeypair } from "../models/account.ts";
import {} from 'npm:@solana/spl-token'
import {VersionedTransaction} from 'npm:@solana/web3.js';
import * as base64 from "https://denopkg.com/chiefbiiko/base64/mod.ts";
import { connection } from "./token.ts";

const baseURL = "https://quote-api.jup.ag/v6/"

export const getQuote = async (inputMint:string,outputMint:string,amount:number,slippageBps:number) => {
    const res = await fetch(`${baseURL}quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`)
    const data = await res.json()
    return data
}

export const getSwapTx = async (id:number,inputMint:string,outputMint:string,amount:number,slippageBps:number) => {
    const keyPair = await getKeypair(id)
    const quoteResponse = await getQuote(inputMint,outputMint,amount,slippageBps)

    const res = await (
        await fetch('https://quote-api.jup.ag/v6/swap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            // quoteResponse from /quote api
            quoteResponse,
            // user public key to be used for the swap
            userPublicKey: keyPair.publicKey.toString(),
            // auto wrap and unwrap SOL. default is true
            wrapAndUnwrapSol: true,
            // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
            // feeAccount: "fee_account_public_key"

          })
        })
      ).json(); 
      const {swapTransaction} = res
      console.log(swapTransaction,res,inputMint,outputMint,quoteResponse);
      
      const swapTransactionBuf = base64.toUint8Array(swapTransaction);
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      // console.log(transaction);
      
      // sign the transaction
      transaction.sign([keyPair]);  
      return transaction.serialize()    
}

export const execTx = async (tx:Uint8Array)=>{
    const txid =  await connection.sendRawTransaction(tx,{
        skipPreflight: true,
        maxRetries: 2        
    })
    return txid
}
