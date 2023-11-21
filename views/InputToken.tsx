import { CallbackHandler } from "basebot";

export const InputToken:CallbackHandler = async () => {
    return {
        node: <div>
            <strong>Token Swap:</strong> <br /><br />

            ⭐ Please enter the token address or token name !
        </div>,
        btns: [
            [
                {
                    text: '↩️ Main Menu',
                    callback_data: '/start'
                }
            ]
        ]
    }
}