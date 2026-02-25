import { Telegraf } from 'telegraf';
import { about } from './commands';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(BOT_TOKEN);

// 1. Keep the about command
bot.command('about', about());

// 2. NEW: Only welcome new members
bot.on('new_chat_members', async (ctx) => {
    const newUser = ctx.message.new_chat_members[0];
    const name = newUser.first_name;

    const welcomeMessage = 
`Hello ${name}, Welcome to Cosmonauts by Roscosmos. 

Here we explore Aliens, UFOs, Space, Underwater mysteries and unexplained phenomena that refuse to be explained. we explore it all together. 👽❤

> Look, @Awoks_x2 ! Our Roscosmos Team just gained a new space buddy.`;

    await ctx.replyWithMarkdownV2(welcomeMessage.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1'));
});

// 3. REMOVED: bot.on('message', greeting()) is gone so it stays silent during chat

// prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};

// dev mode
ENVIRONMENT !== 'production' && development(bot);
