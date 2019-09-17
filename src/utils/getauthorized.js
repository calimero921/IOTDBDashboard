const moment = require('moment');
const id_token = require('./id_token.js');
const Log4n = require('./log4n.js');
const errorparsing = require('./errorparsing.js');
const getUserById = require('../models/api/account/getById.js');
const setUser = require('../models/database/account/set.js');

module.exports = function (config, rights) {
    const log4n = new Log4n('/utils/getauthorized');

    return new Promise((resolve, reject) => {
        try {
            if (rights.private) {
                if(typeof config.user !== 'undefined' && config.user.active) {
                    if(rights.admin) {
                        if(config.user.admin) {
                            resolve(rights.url);
                            log4n.debug('done admin')
                        } else {
                            reject(errorparsing({error_code: 403, error_message: 'Forbidden admin'}));
                            log4n.debug('done error admin')
                        }
                    } else {
                        resolve(rights.url);
                        log4n.debug('done private')
                    }
                } else {
                    reject(errorparsing({error_code: 403, error_message: 'Forbidden private'}));
                    log4n.debug('done error private')
                }
            } else {
                resolve(rights.url);
                log4n.debug('done public')
            }
            log4n.debug('done')
        } catch (error) {
            log4n.error(error);
            reject(errorparsing(error));
            log4n.debug('done - catch global')
        }
    });
};