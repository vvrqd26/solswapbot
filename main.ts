import './router.ts'
import './api/token.ts'
import { bot } from "basebot";

bot.setMyCommands([
  {
    command: 'start',
    description: 'Start the bot',
  },
  {
    command: 'wallet',
    description: 'Get your wallet address',
  },
  {
    command: 'help',
    description: 'Get help',
  },
  {
    command: 'social',
    description: 'Get social links',
  },{
    command: 'my_tokens',
    description: 'Get your tokens',
  }
])