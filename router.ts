import {router} from 'basebot'
import { Start,StartQuery } from "./views/start.tsx";
import { Wallet, WalletQuery } from "./views/wallet.tsx";
import { Swap } from "./views/swap.tsx";

const {startWith,commandAndCallback,command,callback} = router

command(startWith('/start'),Start)
command(/^.+$/,Swap)

callback(startWith('/start'),StartQuery,"self")

commandAndCallback(startWith('/wallet'),{
    command: Wallet,
    callback: WalletQuery,
},'self')
