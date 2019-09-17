const moment = require('moment');
const Log4n = require('../../../utils/log4n.js');
const errorparsing = require('../../../utils/errorparsing.js');
const mongoClient = require('../../mongodbinsert.js');
const Converter = require('./converter.js');
const Generator = require('../generator.js');

module.exports = function (account) {
    const log4n = new Log4n('/models/api/account/set');
    log4n.object(account, 'account');

    //traitement d'enregistrement dans la base
    return new Promise(function (resolve, reject) {
        try {
            log4n.debug('storing account');
            const generator = new Generator();
            const converter = new Converter();
            if (typeof account === 'undefined') {
                reject(errorparsing({error_code: '400'}));
                log4n.debug('done - missing parameter');
            } else {
                converter.json2db(account)
                    .then(query => {
                        query.current_connexion_date = parseInt(moment().format('x'));
                        query.last_connexion_date = parseInt(moment().format('x'));
                        query.creation_date = parseInt(moment().format('x'));
                        query.token = generator.keygen();
                        query.admin = false;
                        query.active = true;
                        log4n.object(query, 'query');
                        return mongoClient('account', query);
                    })
                    .then(datas => {
                        // console.log('datas: ', datas);
                        if (typeof datas === 'undefined') {
                            log4n.debug('done - no data');
                            return errorparsing({error_code: '500'});
                        } else {
                            return converter.db2json(datas[0]);
                        }
                    })
                    .then(datas => {
                        // log4n.object(datas, 'datas');
                        if (typeof datas.error_code === "undefined") {
                            resolve(datas);
                            log4n.debug('done - ok');
                        } else {
                            reject(datas);
                            log4n.debug('done - wrong data');
                        }
                    })
                    .catch(error => {
                        log4n.object(error, 'error');
                        reject(errorparsing(error));
                        log4n.debug('done - promise catch')
                    });
            }
        } catch (error) {
            log4n.debug('done - global catch');
            log4n.object(error, 'error');
            reject(errorparsing(error));
        }
    });
};