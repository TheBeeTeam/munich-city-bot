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


    let chatId = req.body.message.chat.id;
    let text = req.body.message.text;
    let user = req.body.message.from.username;

    let msg = `${user} send the message: ${text}` ;

    bot.sendMessage(chatId,text);

});


module.exports = router;