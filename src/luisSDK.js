'use strict';

const MvgSDK = require('./mvgSDK');

const URL           = require('url');
const request       = require('request-promise-native');
const EventEmitter  = require('eventemitter3');

let mvgToken = process.env.MVG_Key || '';

let mvg = new MvgSDK(mvgToken);

module.exports = class LuisSDK extends EventEmitter {

 msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (((s - mins) / 60)%24)+1;

  return hrs + ':' + mins;
}

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

	_getEntityOfType(type, entities){
		for(var i = 0; i < entities.length; i++){
			if(entities[i].type == type){
				return entities[i];
			}
		}	
		return null;
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
	    	
	    	var stationStart = this._getEntityOfType("Station::Start", entities);
	    	if(stationStart == null){
	    		return "Please specify from which station you want to travel!";
	    	}
	    	
	    	
			return mvg.getStationForName('Garching').then(res => {
				return mvg.getDepartures(res).then(res => {
					//console.log("here");
					let departure = res.departures[0];
					//console.log(departure);
					return departure.product+ " " + departure.label + " departes at " + this.msToTime(departure.departureTime) + " at " + stationStart.entity + " to " + departure.destination  + "." ;
				});
			});
	    }
	}

};
