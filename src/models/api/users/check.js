/**
 * Created by bede6362 on 19/06/2017.
 */

'use strict';

const Log4n = require('../../../utils/log4n.js');
const setUserSession = require('./setSession.js');
const setUserCurrent = require('./setCurrent.js');
const cleanUserSession = require('./cleanSession.js');
const getUserByEmailPassword = require('./getByEmailPassword');

module.exports = function (email, password, sessionid) {
    const log4n = new Log4n('/models/api/users/check');
    log4n.object(email, 'email');
    log4n.object(password, 'password');
    log4n.object(sessionid, 'sessionid');

    return new Promise((resolve, reject) => {
        getUserByEmailPassword(email, password)
            .then(result => {
                log4n.object(result, 'get user by login/password');
                if(result.length === 0) throw 'no user for this user/password';
                return setUserSession(email, sessionid);
            })
            .then(result => {
                log4n.object(result, 'set Session');
                if(result === false) return false;
                return setUserCurrent(email);
            })
            .then(result => {
                log4n.object(result, 'set Current Connexion Date');
                if(result === false) return false;
                return cleanUserSession();
            })
            .then(result => {
                log4n.object(result, 'cleanSession');
                resolve(result);
            })
            .catch(error => {
                log4n.error(error);
                reject(error);
            });
    });
};
