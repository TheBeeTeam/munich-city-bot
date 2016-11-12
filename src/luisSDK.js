'use strict';

const URL           = require('url');
const request       = require('request-promise-native');
const EventEmitter  = require('eventemitter3');


module.exports = class TelegramSDK extends EventEmitter {

    constructor(token, key) {
        super();

        if (!token ) {
            throw 'You must provide a LUIS token!';
        }
        if (!key ) {
            throw 'You must provide a LUIS key!';
        }

        this.token = token;
        this.key = key;
    }


    _buildURL(_msg) {
        return URL.format({
            protocol: 'https',
            host: 'api.projectoxford.ai',
            pathname: `/luis/v2.0/apps/${this.token}`,
            search: `?subscription-key=${this.key}&q=${_msg}`
            
        });
    }

	// used so that other funcs are not non-optimizable
    _safeParse(json) {
        try {
            return JSON.parse(json);
        } catch (err) {
            throw new Error(`Error parsing Telegram response: ${String(json)}`);
        }
    }

    // request-promise
    _request(_msg, options = {}) {
        if (!this.token) {
            throw new Error('Luis token not provided!');
        }
        if (!this.key) {
            throw new Error('Luis key not provided!');
        }

        options.url = this._buildURL(_msg);
        console.log(options.url);
        options.simple = false;
        options.resolveWithFullResponse = true;


        return request(options)
            .then(resp => {
                if (resp.statusCode !== 200) {
                    throw new Error(`${resp.statusCode} ${resp.body}`);
                }

                const data = this._safeParse(resp.body);
                return data;
            });
    }
    
    analyseMessage(message){    	
    	return this._request(encodeURI(message), {});
    }
    
	answer(data){
		var intent = data.topScoringIntent.intent;	    	
	    var entities = data.entities;	
	    
	    if(intent == "DepartureTime"){
	    	var respMsg = "";	    
	    	
	    	var stationStart = getEntityOfType("Station::Start", entities);
	    	if(stationStart == null){
	    		return "Please specify from which station you want to travel!";
	    	}
	    			
	    	return  "The SUBWAY UX departes at XX:XX at " + stationStart.entity + "." ;
	    }
	}

};
