/**
 * Created by bede6362 on 19/06/2017.
 */

'use strict';

const Log4n = require('../../../utils/log4n.js');
const mysqlClient = require('../../mysqlclient.js');
const getUsersByEmail = require('./getByEmail.js');

module.exports = function (email) {
    const log4n = new Log4n('/models/api/users/setCurrent');
    log4n.object(email, 'email');

    return new Promise((resolve, reject) => {
        getUsersByEmail(email)
            .then(user => {
                if(user.length === 0) throw "no user found";
                var current = new Date();
                log4n.object(current, 'current');
                var last = user[0].current;
                log4n.object(last, 'last');

                const query = "UPDATE users SET user_current_connection_date = ?,  user_last_connection_date = ? WHERE user_email = ?;";
                const params = [current, last, email];
                return mysqlClient(query, params)
            })
            .then(result => {
                // log4n.object(result, 'result');
                if (typeof result === 'undefined') throw 'error updating database';
                resolve(result.affectedRows > 0);
            })
            .catch(error => {
                log4n.error(error);
                reject(error);
            });
    });
};
