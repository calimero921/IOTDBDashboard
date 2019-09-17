const Log4n = require('../../../utils/log4n.js');
const apiGet = require('../apiGet.js');
const errorparsing = require('../../../utils/errorparsing.js');

module.exports = function (query, offset, limit, accesToken, overtake) {
    const log4n = new Log4n('/models/api/account/getAll');
    log4n.object(query, 'query');
    log4n.object(offset, 'offset');
    log4n.object(limit, 'limit');
    log4n.object(accesToken, 'accesToken');
    log4n.object(overtake, 'overtake');

    if (typeof overtake === 'undefined') overtake = false;

    //traitement de recherche dans la base
    return new Promise((resolve, reject) => {
        try{
            apiGet('/account', "Error calling API", accesToken, false)
                .then((data)=>{
                    if(typeof data === 'undefined') throw 'data not found';

                    log4n.debug('done - ok');
                    resolve (data);
                })
                .catch((error) => {
                    log4n.object(error, 'error');
                    reject(errorparsing(error));                });
        } catch(error) {
            log4n.object(error, 'error');
            reject(errorparsing(error));
        }
    });
};
