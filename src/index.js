'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');

let api = express();

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({extended: true}));

api.get("/", (req, res) => res.json({name: 'City Munich Bot'}));

module.exports = api;
