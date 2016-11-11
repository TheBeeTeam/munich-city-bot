'use strict';

const express   = require('express');

var router = express.Router();


//Bot Routes
router.get('/', (req, res) => {

    return res.json({method: 'GET', description: 'Chat Bot Integration'});

});


router.post('/', (req, res) => {

    return res.json({method: 'POST', description: 'Chat Bot Integration'});

});



module.exports = router;