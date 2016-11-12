'use strict';

const MvgSDK = require('./mvgSDK');

const URL           = require('url');
const request       = require('request-promise-native');
const EventEmitter  = require('eventemitter3');

let mvgToken = process.env.MVG_KEY || '';

let mvg = new MvgSDK(mvgToken);

module.exports = class LuisSDK extends EventEmitter {

	msToTime(s) {
  		var ms = s % 1000;
  		s = (s - ms) / 1000;
  		var secs = s % 60;
  		s = (s - secs) / 60;
  		var mins = s % 60;
  		var hrs = (((s - mins) / 60)%24)+1;

  		return hrs + ':' + ("0" + mins).slice(-2);
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
    
    _productToString(product){
    	if(product == "u"){
    		return "U";
    	}
    	else if(product == "b"){
    		return "Bus";
    	}
    	else if(product == "t"){
    		return "Tram";
    	}
    	else if(product == "s"){
    		return "S-Bahn";
    	}
    	else{
    		return product;
    	}
    }
    
    _stringToProduct(string){
    	var pBus = ["bus", "Bus"];
    	var pSubway = ["subway", "Subway", "ubahn", "u-bahn", "U-Bahn", "UBahn", "train", "Train"];
    	var pTram = ["tram", "Tram"];
    	var pSBahn = ["sbahn", "Sbahn", "s-bahn", "S-Bahn", "S Bahn", "s bahn", "s - bahn", "S - Bahn"];
    	
    	if(pBus.indexOf(string) > -1){
    		return "b";
    	}
    	else if(pSubway.indexOf(string) > -1){
    		return "u";
    	}  
    	else if(pTram.indexOf(string) > -1){
    		return "t";
    	}    
    	else if(pSBahn.indexOf(string) > -1){
    		return "s";
    	}    
    	else{
    		return null;
    	}  	
    }
    
    _connectionToString(connection){
    	var res = "take the " + this._productToString(connection.product) + " " + connection.label;
    	res += " from " + connection.from.name + " to " + connection.to.name + " ";
    	res += "at " + this.msToTime(connection.departure) + ". ";
    	res += "You will arrive at " + this.msToTime(connection.arrival);     	
    	return res;
    }
    
	answer(data){
		var intent = data.topScoringIntent.intent;	    	
	    var entities = data.entities;
	    
		console.log("intent");
	    if(intent == "DepartureTime"){
	    console.log("not");
	    	var respMsg = "";	    
	    	
	    	var stationStart = this._getEntityOfType("Station::Start", entities);
	    	if(stationStart == null){
	    		return "Please specify from which station you want to travel!";
	    	}
	    	
	    	var vehicle = this._getEntityOfType("Vehicle", entities);
	    	
			return mvg.getStationForName(stationStart.entity).then(res1 => {
				return mvg.getDepartures(res1).then(res => {	
					let departure = null;
								
					if(vehicle != null){
						vehicle = this._stringToProduct(vehicle.entity);
						var products = res1.products;
						if(products.indexOf(vehicle) < 0){
							return "Sorry, there is no " + this._productToString(vehicle) + " stop at this station.";
						}
						
						for(var i = 0; i < res.departures.length; i++){
							if(res.departures[i].product == vehicle){
								departure = res.departures[i];
								break;
							}
						}
					}
					else{
						departure = res.departures[0];
					}					
					
					
					return this._productToString(departure.product) + " " + departure.label + " departes at " + this.msToTime(departure.departureTime) + " at " + res1.name + " to " + departure.destination  + "." ;
				});
			});
	    }
	    else if(intent == "FindConnection"){
	    	var respMsg = "";	
	    	console.log(entities);
	    	var stationStart = this._getEntityOfType("Station::Start", entities);
	    	if(stationStart == null){
	    		return "Please specify from which station you want to travel!";
	    	}	    	
	    	var stationDest = this._getEntityOfType("Station::Dest", entities);
	    	if(stationDest == null){
	    		return new Promise(function(resolve, reject) {return "Please specify to which station you want to travel!";});
	    		
	    	}    	
	    	
	    	return mvg.getStationForName(stationStart.entity).then(start => {
	    		return mvg.getStationForName(stationDest.entity).then(dest => {
	    			console.log(start);
	    			console.log(dest);
	    			
	    			mvg.getConnection(start, dest).then(res => {
	    				let msg = "";
	    				
	    				if(res.connectionPartList.length > 1){
	    					msg += 'First ';
	    				}
	    				
	    				for(var i = 0; i < res.connectionPartList.length; i++){
	    					msg += this._connectionToString(res.connectionPartList[i])+ ". ";
	    					
	    					if(i+1 < res.connectionPartList.length){
	    						msg += "Then, ";
	    					} 
	    				}
	    				
	    				console.log(msg);
	    				
	    				return msg;
	    				
	    			});	    			
	    			
	    		});	
	    	});
	    	
	    }
	}

};
