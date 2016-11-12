'use strict';

const URL           = require('url');
const request       = require('request-promise-native');
const EventEmitter  = require('eventemitter3');

module.exports = class MvgSDK extends EventEmitter {

    constructor(token) {
        super();

        if (!token ) {
            throw 'You must provide a MVG token!';
        }

        this.token = token;
    }

    _buildURL(_query, _path) {
        return URL.format({
            protocol: 'https:',
            host: 'www.mvg.de',
            pathname: `/fahrinfo/api/${_path}`,
            search: `?${_query}`
            
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
    _request(_query, _path, options = {}) {
        if (!this.token) {
            throw new Error('MVG token not provided!');
        }

        options.url = this._buildURL(_query, _path);
        console.log(options.url);
        options.simple = false;
        options.headers = {'X-MVG-Authorization-Key' : this.token};
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
    
    exQuery(query, path){    	
    	return this._request(query, path, {});
    }
    
    getDepartures(station){
    	return this._request('footway=0', '/departure/'+station.id ,{});
    }
    
    getStationForName(name){
    	return this._request('q='+ encodeURI(name), '/location/queryWeb' ,{}).then(res => {
    		for(var i = 0; i < res.locations.length; i++){
    			if(res.locations[i].type == "station")
    				return res.locations[i];
    		}
    		
    		return null;
    	});
    }
    
    getConnection(start, dest){
    	return this._request('fromStation='+start.id+'&toStation='+dest.id, '/routing',{}).then(res => {
    		return res.connectionList[0];
    	});
    }
    
};
