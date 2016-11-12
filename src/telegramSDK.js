'use strict';

const URL           = require('url');
const request       = require('request-promise-native');
const EventEmitter  = require('eventemitter3');


module.exports = class TelegramSDK extends EventEmitter {

    constructor(token) {
        super();

        if (!token ) {
            throw 'You must provide a token!';
        }

        this.token = token;
    }


    _buildURL(_path) {
        return URL.format({
            protocol: 'https',
            host: 'api.telegram.org',
            pathname: `/bot${this.token}/${_path}`
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


    _fixReplyMarkup(obj) {
        const replyMarkup = obj.reply_markup;
        if (replyMarkup && typeof replyMarkup !== 'string') {
            // reply_markup must be passed as JSON stringified to Telegram
            obj.reply_markup = JSON.stringify(replyMarkup);
        }
    }

    // request-promise
    _request(_path, options = {}) {
        if (!this.token) {
            throw new Error('Telegram Bot Token not provided!');
        }

        if (options.form) {
            this._fixReplyMarkup(options.form);
        }

        options.url = this._buildURL(_path);
        options.simple = false;
        options.resolveWithFullResponse = true;


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

    getMe() {
        const _path = 'getMe';
        return this._request(_path);
    }

    sendMessage(chatId, text, form = {}) {
        form.chat_id = chatId;
        form.text = text;
        return this._request('sendMessage', { form });
    }


};
