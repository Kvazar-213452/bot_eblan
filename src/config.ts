import dotenv from 'dotenv';

dotenv.config();

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN || '';
export const TARGET_CHANNEL_ID = process.env.CHANNEL_ID || '';
export const INTELLIGENCE_API_KEY = process.env.INTELLIGENCE_API_KEY || '';
