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


    let template = {
        chat: {
            id: '-178955930'
        },
        text: 'Example',
        from: {
            username: 'robot'
        }
    };


    let message = (req.body.message)? req.body.message : template;

    let chatId = message.chat.id;
    let text = message.text;
    let user = message.from.username;

    let msg = `${user} send the message: ${text}` ;

    bot.sendMessage(chatId,msg);

});


module.exports = router;