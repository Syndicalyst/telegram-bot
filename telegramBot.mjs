process.env.NTBA_FIX_319 = 1;
process.env["NTBA_FIX_350"] = 1;
import TelegramBot from '../modules/node_modules/node-telegram-bot-api/index.js';
import {displayWeather} from './utils.mjs'

const token = '5557923652:AAHrp3l661za4H6CWIi_BUAi6NCCP48GpU8';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Привіт я зможу відобразити погоду за допомогою команди /weather. Користуйтесь на здоров'я`)
});

bot.onText(/\/weather/, (msg) => {
  bot.sendMessage(msg.chat.id, "Відобразити погоду на тиждень: ", {
    "reply_markup": {
      "inline_keyboard": [
        [{ text: "Відобразити погоду на кожні 3 години", callback_data: "3"}],
        [{ text: "Відобразити погоду на кожні 6 годин", callback_data: "6" }],
      ],
    },
  });
});

bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;

  if (action === '3') {
    displayWeather(bot, msg.chat.id, action);
  }
  if (action === '6') {
    displayWeather(bot, msg.chat.id, action);
  }
});