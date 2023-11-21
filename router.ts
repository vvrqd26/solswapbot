import {router} from 'basebot'
import { Start,StartQuery } from "./views/start.tsx";
import { Wallet, WalletQuery } from "./views/wallet.tsx";
import { Token } from "./views/token.tsx";
import { SoonQuery } from "./views/soon.tsx";
import { Swap } from "./views/swap.tsx";
import { InputToken } from "./views/InputToken.tsx";
import { InputAmount } from "./views/inputAmount.tsx";

const {startWith,commandAndCallback,command,callback} = router

command(startWith('/start'),Start)
command(/^[^/].*$/,Token)

callback(startWith('/start'),StartQuery,"self")
callback(startWith('/soon'),SoonQuery,'self')
callback(startWith('/swap'),Swap,'self')
callback(/^\/inputToken$/,InputToken,'self')
callback(startWith('/ia'),InputAmount,'self')

commandAndCallback(startWith('/wallet'),{
    command: Wallet,
    callback: WalletQuery,
},'self')

