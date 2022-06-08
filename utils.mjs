import axios from 'axios';

const url = 'https://api.openweathermap.org/data/2.5/forecast?lat=50.4333&lon=30.5167&lang=ua&units=metric&exclude=hourly,daily&appid=4c64e890924bf1087d8af4018ace8eed'
 
let formatDate = (date) => {

  let hour = date.getHours();
  let minutes = date.getMinutes();

  hour = hour < 10 ? '0' + hour : hour;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return `${hour}:${minutes}`
}

export function displayWeather(bot, chatId, action) {
  let str = '';
  axios.get(url).then(function (response) {
    let tempDate = new Date(response.data.list[0].dt_txt);

    str += `Погода в Києві на сьогодні: `
    str += `\n\n${tempDate.toLocaleDateString('ua', { weekday:"long", month:"long", day:"numeric"})}: `;

    (response.data.list).forEach(element => {

      let day = new Date(element.dt_txt);
      let formattedDay = day.toLocaleDateString('ua', { weekday:"long", month:"long", day:"numeric"})
      let dayTime = formatDate(new Date(element.dt_txt));
      if (day.getHours() % +action == 0) {
        if (tempDate.getYear() != day.getYear() || tempDate.getMonth() != day.getMonth() || tempDate.getDate() != day.getDate()) {
          str += (`\n\n${formattedDay}: `);
          str += (`\n  ${dayTime} +${Math.trunc(element.main.temp)} °C відчувається як: +${Math.trunc(element.main.feels_like)} °C, ${element.weather[0].description}`);
          tempDate = day;
        } else {
          str += (`\n  ${dayTime} +${Math.trunc(element.main.temp)} °C відчувається як: +${Math.trunc(element.main.feels_like)} °C, ${element.weather[0].description}`);
        }
      }
    })
    bot.sendMessage(chatId, str);
  })
}
