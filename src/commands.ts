import { Message } from 'discord.js';
import { getSystemMessage, malice } from './utils';

export let theme = '';
export let history = 5;
export let think = 1;
export let ignor = true;

export function handleCommand(
  message: Message,
  messageBuffer: any[],
  updateSystem: () => void
) {
  const content = message.content.trim();
  const [command, arg1, arg2] = content.split(' ');

  switch (command.toLowerCase()) {
    case '#set':
      if (arg1 === 'malice') {
        const value = parseInt(arg2);
        if (!isNaN(value) && value >= 0 && value <= 100) {
          (globalThis as any).malice = value;
          messageBuffer[0] = getSystemMessage();
          message.reply(`Рівень злості встановлено на ${value}%`);
        } else {
          message.reply('НАШОЛ НАХУЙ КРИТІН!');
        }
      }
      break;

    case '#history':
      const historyVal = parseInt(arg1);
      if (!isNaN(historyVal) && historyVal >= 5 && historyVal <= 20) {
        history = historyVal;
        message.reply(`Зберігатиму останні ${historyVal} повідомлень`);
      } else {
        message.reply('Тільки від 5 до 20');
      }
      break;

    case '#theme':
      theme = arg1;
      message.reply(`theme = ${theme}`);
      break;

    case '#reload':
      messageBuffer.length = 0;
      messageBuffer.push(getSystemMessage());
      message.reply('Забув все');
      break;

    case '#info':
      message.reply(`
malice = ${malice}
think = ${think}
hist = ${history}
theme = ${theme}`);
      break;

    case '#off':
      ignor = false;
      message.reply('ок я тебе ігнорую');
      break;

    case '#on':
      ignor = true;
      message.reply('');
      break;

    case '#help':
      message.reply(`
**Доступні команди:**
#set malice <0-100> - встановити рівень злості
#history <5-20> - скільки повідомлень памяті
#reload - очистити кеш
#on/#off - увімкнути/вимкнути бота
#help - ця підказка
#info - тепер налаштування бота
#theme - теба (бота хто він)
      `);
      break;

    default:
      message.reply('хуйню паписав. #help');
      break;
  }
}
