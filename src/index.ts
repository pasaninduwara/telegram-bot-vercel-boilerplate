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
    await ctx.reply(`Welcome to the group, ${newUser.first_name}!`);
});

// 3. REMOVED: bot.on('message', greeting()) is gone so it stays silent during chat

// prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};

// dev mode
ENVIRONMENT !== 'production' && development(bot);
