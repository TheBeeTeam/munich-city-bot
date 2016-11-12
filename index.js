'use strict';

const TelegramBot   = require('node-telegram-bot-api');

let options = {
    webHook: {
        port: 443
    }
};

let token = process.env.TELEGRAM_BOT_TOKEN || '298030970:AAHzKDBQ2wo0rnA6xwuRuxnCK0Bk8uKMO1w';

let bot = new TelegramBot(token, options);

// Setting the Webhook
bot.setWebHook('api.telegram.org/bot298030970:AAHzKDBQ2wo0rnA6xwuRuxnCK0Bk8uKMO1w');


bot.getMe().then(function (me) {
    console.log('Hi my name is %s!', me.username);
});


// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    let chatId = msg.chat.id;
    let resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat

    let date = Date.now();
    let reply    = resp + date.toString();

    bot.sendMessage(chatId, reply);
});

