'use strict';

const TelegramSDK   = require('./telegramSDK');
const LuisSDK = require('./luisSDK');

let telegramToken = process.env.TELEGRAM_BOT_TOKEN || '';
let luisToken = process.env.LUIS_TOKEN || '';
let luisKey = process.env.LUIS_SUBSCRIPTION_KEY || '';


let bot = new  TelegramSDK(telegramToken);
let luis = new LuisSDK(luisToken, luisKey);

/*luis.analyseMessage("").then(data => {
    	luis.answer(data).then(res => {
    		console.log(res);
    	}).catch(e => {
  			//msg not for the bot
  		});
  	}).catch(e => {
  		//luis failure
  	});*/

bot.on('message', (message) => {

    let chatId = message.chat.id;
    let text = message.text;
    let user = message.from.username || message.from.first_name;
	
	if(text.includes("/start")){
		bot.sendMessage(chatId, "Hi, I'm the Munich City Bot! You can ask me questions about the public transport in Munich, like: How can I get from Hauptbahnhof to Odeonsplatz or when does the next \u{1F68C} departs at Garching?");	
	}
	else{
		luis.analyseMessage(text).then(data => {
			luis.answer(data).then(res => {
				bot.sendMessage(chatId, res);
			}).catch(e => {
  				//msg not for the bot
  			});
  		}).catch(e => {
  		//luis failure
  		});
	}
});

bot.on('error', (message) => {

    let errorMsg = 'Error in request:' + message;
    let chatTestId = '-178955930';

    bot.sendMessage(chatTestId, errorMsg);

});

module.exports = bot;


