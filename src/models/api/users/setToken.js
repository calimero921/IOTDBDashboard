/**
 * Created by bede6362 on 19/06/2017.
 */

'use strict';

const Log4n = require('../../../utils/log4n.js');
const mysqlClient = require('../../mysqlclient.js');
const getUsersByToken = require('./getByToken.js');

module.exports = function (email) {
    const log4n = new Log4n('/models/api/users/setToken');
    log4n.object(email, 'email');

    return new Promise((resolve, reject) => {
        log4n.debug('Token creation');
        var newToken = createToken(email);
        while (newToken.exists === true) {
            newToken = createToken(email);
        }
        // log4n.object(newToken, "newToken");
        var token = newToken.token;

        log4n.debug('Token database update for ' + email);
        const query = "UPDATE users SET user_reset_password_token = ? WHERE user_email = ?;";
        const params = [token, email];
        mysqlClient(query, params)
            .then(result => {
                // log4n.object(result, 'result');
                if(typeof result === 'undefined') throw 'no update result available';
                if(result.affectedRows === 0) throw 'no record updated';
                resolve(token);
            })
            .catch(error => {
                log4n.error(error);
                reject(error);
            });
    });
};

function createToken(email) {
    const log4n = new Log4n('/models/users/setToken/createToken');
    const refstr = "0123456789abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var value = {};
    value.exists = false;
    value.token = "";

    for(var i=0; i<64;i++) {
        value.token += refstr.substr(Math.round(Math.random()*refstr.length), 1);
    }

    if(value.token.length > 0) {
        getUsersByToken(email, value.token)
            .then(data => {
                // log4n.object(data, 'data');
                if(data.length > 0) value.exists = true;
                return value
            })
            .catch(error => {
                log4n.object(error, "Error");
                // log4n.object(value, 'value');
                return value
            });
    }
    return value;
};