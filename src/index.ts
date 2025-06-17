import { Client, GatewayIntentBits, Partials, Message } from 'discord.js';
import { DISCORD_TOKEN, TARGET_CHANNEL_ID } from './config';
import { getSystemMessage, extractAfterThinkTag } from './utils';
import { handleCommand, ignor, history } from './commands';
import { askAI } from './ai';
import { ChatMessage } from './types';

let isProcessing = false;
let sumvol = 1000;

let messageBuffer: ChatMessage[] = [getSystemMessage()];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.once('ready', () => {
  console.log(`start ${client.user?.tag}`);
  messageBuffer[0] = getSystemMessage();
});

client.on('messageCreate', async (message: Message) => {
  console.log("get msg")
  if (message.author.bot || message.channel.id !== TARGET_CHANNEL_ID) return;

  if (message.content.trim().startsWith('#')) {
    handleCommand(message, messageBuffer, () => {
      messageBuffer[0] = getSystemMessage();
    });
    return;
  }

  if (ignor || isProcessing) return;
  isProcessing = true;

  try {
    messageBuffer.push({
      role: 'user',
      content: `[${message.author.username}]: ${message.content.trim()}`
    });

    const messagesForApi = [
      messageBuffer[0],
      ...messageBuffer.slice(-history * 2).filter(m => m.role !== 'system')
    ];

    const replyRaw = await askAI(messagesForApi, sumvol);
    const reply = extractAfterThinkTag(replyRaw);

    await message.reply(reply);

    messageBuffer.push({
      role: 'assistant',
      content: `[${client.user?.username}]: ${reply}`
    });

    if (messageBuffer.length > history * 2 + 1) {
      messageBuffer = [messageBuffer[0], ...messageBuffer.slice(-history * 2)];
    }

  } catch (err) {
    console.error('Помилка:', err);
    message.reply('блять читати треба код перед запуском');
  } finally {
    isProcessing = false;
  }
});

client.login(DISCORD_TOKEN);
