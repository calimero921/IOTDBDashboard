const Log4n = require('../../utils/log4n.js');
const errorparsing = require('../../utils/errorparsing.js');
const configMQTT = require('../../config/mqtt.js');
const get = require('../../models/api/device/get.js');
const set = require('../../models/api/device/set.js');
const update = require('../../models/api/device/patch.js');

module.exports = function (content) {
    const log4n = new Log4n('/routes/api/device/register');
    // log4n.object(content, 'content');

    //traitement d'enregistrement dans la base
    return new Promise(function (resolve, reject) {
        try{
            if (typeof content === 'undefined') {
                //aucune donnée postée
                log4n.debug('done - no data');
                reject({code: 400});
            } else {
                let query = {
                    "serial_number": content.serial_number,
                    "manufacturer": content.manufacturer
                };
                get(query, "", "", true)
                    .then(result => {
                        // log4n.object(result, 'result');
                        if (typeof result === 'undefined') {
                            //enregistrement des données postées
                            log4n.debug('inserting device');
                            return set(content);
                        } else {
                            //enregistrement des données postées
                            log4n.debug('updating device');
                            let record = result[0];
                            content.key = record.key;
                            content.creation_date = record.creation_date;
                            return update(record.id, content);
                        }
                    })
                    .then(datas => {
                        // log4n.object(datas, 'datas');
                        if (typeof datas === 'undefined') {
                            //aucune données recue du processus d'enregistrement
                            log4n.debug('done - no data');
                            reject(errorparsing({code: 500}));
                        } else {
                            //recherche d'un code erreur précédent
                            if (typeof datas.error_code === 'undefined') {
                                //device enregistrée
                                let message = {"message": "registred", "payload" : datas};
                                global.mqttConnexion.publish(configMQTT.topic_system, message);
                                log4n.debug('done - ok');
                                resolve();
                            } else {
                                //erreur dans le processus d'enregistrement de la notification
                                log4n.debug('done - response error');
                                reject(errorparsing(datas));
                            }
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        log4n.debug('done - promise catch');
                        log4n.object(error, 'error');
                        reject(errorparsing(error));
                    });
            }
        } catch(error) {
            console.log(error);
            log4n.debug('done - global catch');
            log4n.object(error, 'error');
            reject(errorparsing(error));
        }
    });
};
