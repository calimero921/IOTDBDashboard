const moment = require('moment');
const id_token = require('./id_token.js');
const Log4n = require('./log4n.js');
const errorparsing = require('./errorparsing.js');
const getUserById = require('../models/api/account/getById.js');
const setUser = require('../models/api/account/set.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/utils/getconfig');

    return new Promise((resolve, reject) => {
        let config = {};
        let userToken = {};
        try {
            id_token(req, res)
                .then(idToken => {
                    log4n.object(idToken, "idToken");
                    if (typeof idToken === 'undefined') {
                        return errorparsing({error_code: 401, error_message: 'Unauthorized'});
                    } else {
                        userToken = idToken;
                        return getUserById(userToken.sub, true);
                    }
                })
                .then(userInfo => {
                    log4n.object(userInfo, "userInfo");
                    if (typeof userInfo.error_code !== 'undefined') {
                        return userInfo;
                    }
                    if (userInfo.length > 0) {
                        return userInfo[0];
                    } else {
                        let userDetails = {
                            "id": userToken.sub,
                            "firstname": userToken.given_name,
                            "lastname": userToken.family_name,
                            "email": userToken.email,
                        };
                        return setUser(userDetails);
                    }
                })
                .then(result => {
                    log4n.object(result, 'result');
                    if (typeof result.error_code === 'undefined') {
                        config.user = result;
                        let last = new moment(config.user.last_connexion_date);
                        config.user.last_connexion_date = last.format('DD/MMM/YYYY HH:mm:SS');
                        resolve(config);
                        log4n.debug("done");
                    } else {
                        resolve(config);
                        log4n.debug("done - no user found for this session");
                    }
                })
                .catch(error => {
                    log4n.object(error, 'error');
                    reject(errorparsing(error));
                    log4n.debug('done - catch promise')
                });
        } catch (error) {
            log4n.error(error);
            reject(errorparsing(error));
            log4n.debug('done - catch global')
        }
    });
};