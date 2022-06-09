process.env.NTBA_FIX_319 = 1;
process.env["NTBA_FIX_350"] = 1;
import TelegramBot from 'node-telegram-bot-api';
import {displayWeather} from './utils.mjs'

const token = '5557923652:AAHrp3l661za4H6CWIi_BUAi6NCCP48GpU8';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Привет пользователь, я могу отобразить погоду на неделю с помощью команды /weather. Пользуйтесь на здоровье!`)
});

bot.onText(/\/weather/, (msg) => {
  bot.sendMessage(msg.chat.id, "Отобразить погоду на неделю: ", {
    "reply_markup": {
      "inline_keyboard": [
        [{ text: "Отобразить погоду на каждые 3 часа", callback_data: "3"}],
        [{ text: "Отобразить погоду на каждые 6 часов", callback_data: "6" }],
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
