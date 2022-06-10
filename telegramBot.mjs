process.env.NTBA_FIX_319 = 1;
process.env["NTBA_FIX_350"] = 1;
import TelegramBot from 'node-telegram-bot-api';
import * as utils from './utils.mjs'
import fs from 'fs'

const token = '5557923652:AAHrp3l661za4H6CWIi_BUAi6NCCP48GpU8';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Привет пользователь, с помощью команды /weather я могу отобразить погоду на неделю или с помощью команды /currency отобразить курс валют на даннай момент.`)
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

bot.onText(/\/currency/, (msg) => {
  bot.sendMessage(msg.chat.id, "Курс валют на данный момент: ", {
    "reply_markup": {
      "inline_keyboard": [
        [{ text: "Отобразить курс валют от ПриватБанка (наличные)", callback_data: "cash"}],
        [{ text: "Отобразить курс валют от ПриватБанка (безналичные)", callback_data: "noncash" }],
        [{ text: "Отобразить курс валют от Monobank", callback_data: "mono" }],
      ],
    },
  });
});

bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  let monoCashe = fs.readFileSync('./monoCashe.json', 'utf8');
  let monoData = JSON.parse(monoCashe);

  if (action === '3') {
    utils.displayWeather(bot, msg.chat.id, action);
  }
  if (action === '6') {
    utils.displayWeather(bot, msg.chat.id, action);
  }
  if (action === 'cash') {
    utils.getPrivateCashCurrency(bot, msg.chat.id);
  }
  if (action === 'noncash') {
    utils.getPrivateNoncashCurrency(bot, msg.chat.id);
  }
  if (action === 'mono') {
    if ((new Date() - new Date(monoData[2])) / 60000 > 5) {
      utils.getMonoCurrency(bot, msg.chat.id);
    } else {
      let cashedData = utils.getMonoCashe(monoData);
      bot.sendMessage(msg.chat.id, cashedData);
    }
  }
});
