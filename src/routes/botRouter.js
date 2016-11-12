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

        let message = req.body.message;

        let chatId = message.chat.id;
        let text = message.text;
        let user = message.from.username || message.from.first_name;

        let msg = `${user} send the message: ${text}` ;

        bot.sendMessage(chatId,msg);

    } else {

        let errorMsg = 'Error in request:' + JSON.stringify(req.body, null, 2);
        let chatTestId = '-178955930';

        bot.sendMessage(chatTestId, errorMsg);

    }

    return res.json({method: 'POST', description: 'Chat Bot Integration'});

});


module.exports = router;