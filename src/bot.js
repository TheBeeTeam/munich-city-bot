'use strict';

const TelegramSDK   = require('./telegramSDK');
const LuisSDK = require('./luisSDK');

let telegramToken = process.env.TELEGRAM_BOT_TOKEN || '0';
let luisToken = process.env.LUIS_TOKEN || '0';
let luisKey = process.env.LUIS_SUBSCRIPTION_KEY || '0';

let bot = new  TelegramSDK(telegramToken);
let luis = new LuisSDK(luisToken, luisKey);


bot.on('message', (message) => {

    let chatId = message.chat.id;
    let text = message.text;
    let user = message.from.username || message.from.first_name;
	
	bot.sendMessage(chatId,luis.analyseMessage('test'));	
	
    let msg = `${user} send the message: ${text}` ;
	
    bot.sendMessage(chatId,msg);

});

bot.on('error', (message) => {

    let errorMsg = 'Error in request:' + message;
    let chatTestId = '-178955930';

    bot.sendMessage(chatTestId, errorMsg);

});

//luis.on('message', (message) => )


module.exports = bot;


