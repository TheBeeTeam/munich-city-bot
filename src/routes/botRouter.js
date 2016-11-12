'use strict';

const express   = require('express');
var request     = require('request');


var router = express.Router();


//Bot Routes
router.get('/', (req, res) => {

    return res.json({method: 'GET', description: 'Chat Bot Integration'});

});


router.post('/', (req, res) => {

    let botId  = '298030970';
    let botKey = 'AAHzKDBQ2wo0rnA6xwuRuxnCK0Bk8uKMO1w';
    let charId = '-178955930';


    let msg    =  JSON.stringify(req.body, null, 2);

    // HTTP POST request to Telegram API
    request(`http://api.telegram.org/bot${botId}:${botKey}/sendMessage?chat_id=${charId}&text=${msg}`, (error, response, data) => {
        if (!error && response.statusCode == 200) {
            return res.json({method: 'POST', description: 'Chat Bot Integration', data: data});
        }
    });

});




module.exports = router;