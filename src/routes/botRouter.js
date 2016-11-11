'use strict';

const express   = require('express');
const http      = require('http');


var router = express.Router();


//Bot Routes
router.get('/', (req, res) => {

    return res.json({method: 'GET', description: 'Chat Bot Integration'});

});


router.post('/', (req, res) => {

    return sendMessage('test message').then((data) => {
        return res.json(data);
    }).catch((err) => {
        console.log(err);
    });

});






function sendMessage(msg) {
    return new Promise(function(resolve, reject) {

        let options = {
            host: 'api.telegram.org',
            port: 80,
            path: '/bot298030970:AAHzKDBQ2wo0rnA6xwuRuxnCK0Bk8uKMO1w/sendMessage?chat_id=-178955930&text=' + msg
        };

        http.get(options, (resp) => {
            resp
                .on('data',(data) => {
                        return resolve(data);
                 })
                .on("error", (error) => reject ({message: "Got error: " + error.message}));
        });

    })
}


module.exports = router;