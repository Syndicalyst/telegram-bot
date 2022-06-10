import axios from 'axios';
import cc from 'currency-codes';

const weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=50.4333&lon=30.5167&lang=ru&units=metric&exclude=hourly,daily&appid=4c64e890924bf1087d8af4018ace8eed'
const privatUrlCash = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';
const privatUrlNoncash = 'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11';
const monoUrl = 'https://api.monobank.ua/bank/currency';
 
let formatDate = (date) => {

  let hour = date.getHours();
  let minutes = date.getMinutes();

  hour = hour < 10 ? '0' + hour : hour;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return `${hour}:${minutes}`
}

export function displayWeather(bot, chatId, action) {
  let str = '';

  axios.get(weatherUrl).then(function (response) {
    let tempDate = new Date(response.data.list[0].dt_txt);
    let tempDateString = tempDate.toLocaleDateString('ru', { weekday:"long", month:"long", day:"numeric"});

    str += `Погода в Киеве на сегодня: `
    str += `\n\n${tempDateString.charAt(0).toUpperCase() + tempDateString.slice(1)}: `;

    (response.data.list).forEach(element => {

      let day = new Date(element.dt_txt);
      let formattedDay = day.toLocaleDateString('ru', { weekday:"long", month:"long", day:"numeric"});
      formattedDay = formattedDay.charAt(0).toUpperCase() + formattedDay.slice(1);
      let dayTime = formatDate(new Date(element.dt_txt));

      if (day.getHours() % +action == 0) {
        if (tempDate.getYear() != day.getYear() || tempDate.getMonth() != day.getMonth() || tempDate.getDate() != day.getDate()) {
          str += (`\n\n${formattedDay}: `);
          str += (`\n  ${dayTime} +${Math.trunc(element.main.temp)} °C ощущается как: +${Math.trunc(element.main.feels_like)} °C, ${element.weather[0].description}`);
          tempDate = day;
        } else {
          str += (`\n  ${dayTime} +${Math.trunc(element.main.temp)} °C ощущается как: +${Math.trunc(element.main.feels_like)} °C, ${element.weather[0].description}`);
        }
      }
    })
    bot.sendMessage(chatId, str);
  })
}

export function getPrivateCashCurrency(bot, chatId) {
  let str = '';

  axios.get(privatUrlCash).then((response) => {
    str += `\nКурс валют в ПриватБанке (наличные) на ${new Date().toLocaleDateString('ru', {month:"long", day:"numeric", year: 'numeric'})}`;
    (response.data).forEach(el => {
      if (el.ccy == 'USD' || el.ccy == 'EUR') {
        str += `  \n\n${el.ccy} за ${el.base_ccy}: \nпокупка: ${(+el.buy).toFixed(2)} \nпродажа: ${(+el.sale).toFixed(2)}`;
      }
    });
    bot.sendMessage(chatId, str);
  });
}

export function getPrivateNoncashCurrency(bot, chatId) {
  let str = '';

  axios.get(privatUrlNoncash).then((response) => {
    str += `\nКурс валют в ПриватБанке (безналичные) на ${new Date().toLocaleDateString('ru', { month:"long", day:"numeric", year: 'numeric'})}`;
    (response.data).forEach(el => {
      if (el.ccy == 'USD' || el.ccy == 'EUR') {
        str += `  \n\n${el.ccy} за ${el.base_ccy}: \nпокупка: ${(+el.buy).toFixed(2)} \nпродажа: ${(+el.sale).toFixed(2)}`;
      }
    });
    bot.sendMessage(chatId, str);
  });
}

export function getMonoCurrency(bot, chatId, monoCashe) {
  let str = '';

  axios.get(monoUrl).then((response) => {
    str += `\nКурс валют в Monobank на ${new Date().toLocaleDateString('ru', { month:"long", day:"numeric", year: 'numeric'})}`;
    (response.data).forEach(el => {
      if (el.currencyCodeA == 840 || el.currencyCodeA == 978 && el.currencyCodeB == 980) {
        str += `  \n\n${cc.number(el.currencyCodeA).code} за ${cc.number(el.currencyCodeB).code}: \nпокупка: ${el.rateBuy} \nпродажа: ${el.rateSell}`;
      }
    });
    bot.sendMessage(chatId, str);
    monoCashe = setMonoCashe(str);
  }) 
}

export function setMonoCashe(monoCashe) {
  return monoCashe;
}