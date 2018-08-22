const Log4n = require('../../../utils/log4n.js');
const password = require('../../../utils/password.js');
const responseError = require('../../../utils/responseError.js');
const errorparsing = require('../../../utils/errorparsing.js');
const decodePost = require('../../../utils/decodePost.js');
const get = require('../../../models/api/account/get.js');
const set = require('../../../models/api/account/set.js');
const patch = require('../../../models/api/account/patch.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/routes/api/account/post');

    //lecture des données postées
    var content = {};
    decodePost(req, res)
        .then(datas => {
            log4n.object(datas, 'datas');
            if(typeof datas === 'undefined') {
                //aucune donnée postée
                return errorparsing({error_code:400});
            } else {
                content = datas;
                if (typeof content.id === 'undefined') {
                    log4n.debug('no id');
                    if (typeof content.password === 'undefined') {
                        return password();
                    } else {
                        return content.password;
                    }
                } else {
                    log4n.object(content.id, 'id');
                    if (content.id.length === 0) {
                        log4n.debug('empty id');
                        delete content.id;
                        return password();
                    } else {
                        //récupération des informations précédentes
                        log4n.debug('found id');
                        return get({id: content.id}, 0, 0, false);
                    }
                }
            }
        })
        .then(datas => {
            log4n.object(datas, 'datas');
            if (typeof datas === 'string') {
                //insertion d'un account
                content.password = datas;
                return set(content);
            } else {
                //mise à jour d'un account
                content.password = datas[0].password;
                return patch(content.id, content);
            }
        })
        .then(datas => {
            // console.log('datas:', datas);
            if(typeof datas === 'undefined') {
                //aucune données recue du processus d'enregistrement
                responseError({error_code: 404}, res, log4n);
                log4n.debug('done - no data');
            } else {
                //recherche d'un code erreur précédent
                if(typeof datas.error_code === 'undefined') {
                    //notification enregistrée
                    res.status(201).send(datas);
                    log4n.debug('done - ok');
                } else {
                    //erreur dans le processus d'enregistrement de la notification
                    responseError(datas, res, log4n);
                    log4n.debug('done - response error');
                }
            }
        })
        .catch(error => {
            responseError(error, res, log4n);
            log4n.debug('done - global catch');
        });
};
