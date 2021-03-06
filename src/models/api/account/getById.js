const Log4n = require('../../../utils/log4n.js');
const apiGet = require('../apiGet.js');
const errorparsing = require('../../../utils/errorparsing.js');

module.exports = function (id, accesToken, overtake) {
    const log4n = new Log4n('/models/api/account/getById');
    log4n.object(id, 'id');
    log4n.object(accesToken.token, 'accesToken');
    log4n.object(overtake, 'overtake');

    if (typeof overtake === 'undefined') overtake = false;

    //traitement de recherche dans la base
    return new Promise((resolve, reject) => {
        if (typeof id === 'undefined') {
            reject(errorparsing({error_code: 400}));
            log4n.debug('done - missing parameter');
        } else {
            //traitement de recherche dans la base
            apiGet('/account/id/' + id, "Error calling API", accesToken, overtake)
                .then(datas => {
                    if (datas.length === 0 && !overtake) {
                        resolve(errorparsing({error_code: "404", error_message : "Not found"}));
                        log4n.debug('done - not found');
                    } else {
                        // log4n.object(datas, 'datas');
                        resolve(datas);
                        log4n.debug('done - ok');
                    }
                })
                .catch(error => {
                    reject(errorparsing(error));
                    log4n.debug('done - promise catch');
                });
        }
    });
};
