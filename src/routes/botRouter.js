'use strict';

const express       = require('express');
const bot           = require('./../bot');

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

module.exports = router;