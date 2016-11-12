'use strict';

const TelegramSDK   = require('./telegramSDK');

let token = process.env.TELEGRAM_BOT_TOKEN || '';

let bot = new  TelegramSDK(token);

bot.on('message', (message) => {

    let chatId = message.chat.id;
    let text = message.text;
    let user = message.from.username || message.from.first_name;

    let msg = `${user} send the message: ${text}` ;

    bot.sendMessage(chatId,msg);

});

bot.on('error', (message) => {

    let errorMsg = 'Error in request:' + message;
    let chatTestId = '-178955930';

    bot.sendMessage(chatTestId, errorMsg);

});


module.exports = bot;


