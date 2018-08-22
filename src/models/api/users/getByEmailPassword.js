/**
 * Created by bede6362 on 19/06/2017.
 */
'use strict';

const Log4n = require('../../../utils/log4n.js');
const mysqlClient = require('../../mysqlclient.js');
const transUser = require('./trans.js');

module.exports = function (email, password) {
    const log4n = new Log4n('/models/api/users/getByEmailPassword');
    log4n.object(email, 'email');
    log4n.object(password, 'password');

    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE user_email = ? AND user_password = ?;";
        const params = [email, password];
        mysqlClient(query, params)
            .then(datas => {
                // log4n.object(datas, 'datas');
                if(typeof datas === 'undefined') throw 'error reading database';
                if(datas.length === 0) throw 'no user for this email/password';
                resolve(transUser(datas));
            })
            .catch(error => {
                log4n.error(error);
                reject(error);
            });
    });
};
