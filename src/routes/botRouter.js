'use strict';

const express       = require('express');
const TelegramBot   = require('./../telegramBot');


let bot = new  TelegramBot('298030970:AAHzKDBQ2wo0rnA6xwuRuxnCK0Bk8uKMO1w');


//Bot Routes

var router = express.Router();


router.get('/', (req, res) => {
    return res.json({method: 'GET', description: 'Chat Bot Integration'});
});


router.post('/', (req, res) => {

    if (req.body.hasOwnProperty('message')){
        bot.emit('message', req.body.message);
    } else {
        bot.emit('error', JSON.stringify(req.body, null, 2));
    }
    return res.json({method: 'POST', description: 'Chat Bot Integration'});

});


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







module.exports = router;