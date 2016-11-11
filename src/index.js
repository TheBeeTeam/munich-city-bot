'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const botRouter   = require('./routes/botRouter');


let api = express();

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({extended: true}));

api.get("/", (req, res) => res.json({method: 'GET', description: 'City Munich Bot'}));

//App routes
api.use('/bot', botRouter);



module.exports = api;
