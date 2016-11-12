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


    _buildURL(_path) {
        return URL.format({
            protocol: 'https',
            host: 'api.projectoxford.ai',
            pathname: `/luis/v2.0/apps/${this.token}?subscription-key=${this.key}`
        });
    }


    // request-promise
    _request(_path, options = {}) {
        if (!this.token) {
            throw new Error('Luis token not provided!');
        }
        if (!this.key) {
            throw new Error('Luis key not provided!');
        }

        return request(options)
            .then(resp => {
                if (resp.statusCode !== 200) {
                    throw new Error(`${resp.statusCode} ${resp.body}`);
                }

                const data = this._safeParse(resp.body);

                if (data.ok) {
                    return data.result;
                }

                throw new Error(`${data.error_code} ${data.description}`);
            });
    }
    
	/*
    getMe() {
        const _path = 'getMe';
        return this._request(_path);
    }

    sendMessage(chatId, text, form = {}) {
        form.chat_id = chatId;
        form.text = text;
        return this._request('sendMessage', { form });
    }
	*/

};
