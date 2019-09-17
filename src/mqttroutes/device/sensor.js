const Log4n = require('../../utils/log4n.js');
const errorparsing = require('../../utils/errorparsing.js');
const configMQTT = require('../../config/mqtt.js');
const get = require('../../models/database/device/get.js');
const update = require('../../models/database/device/patch.js');

module.exports = function (content) {
    const log4n = new Log4n('/routes/api/device/sensor');
    log4n.object(content, 'content');

    //traitement d'enregistrement dans la base
    return new Promise(function (resolve, reject) {
        try {
            if (typeof content === 'undefined') {
                //aucune donnée postée
                log4n.debug('done - no data');
                reject(errorparsing({error_code: 400}));
            } else {
                let query = {"id": content.id};
                get(query, "", "", true)
                    .then(result => {
                        // log4n.object(result, 'result');
                        if (typeof result === 'undefined') {
                            //enregistrement absent
                            log4n.debug('unknown device');
                            return errorparsing({error_code: 404});
                        } else {
                            //enregistrement des données postées
                            log4n.debug('updating data');
                            let record = result[0];
                            // log4n.object(record, 'record');
                            for (let i = 0; i < content.capabilities.length; i++) {
                                for (let j = 0; j < record.capabilities.length; j++) {
                                    if (content.capabilities[i].name === record.capabilities[j].name) {
                                        record.capabilities[j].last_value = content.capabilities[i].value;
                                    }
                                }
                            }
                            return update(result[0].id, record);
                        }
                    })
                    .then(datas => {
                        // log4n.object(datas, 'datas');
                        if (typeof datas === 'undefined') {
                            //aucune données recue du processus d'enregistrement
                            log4n.debug('done - no data');
                            reject(errorparsing({error_code: 500}));
                        } else {
                            //recherche d'un code erreur précédent
                            if (typeof datas.error_code === 'undefined') {
                                //data enregistrées
                                log4n.debug('data updated');
                                let message = {"message": "ok"};
                                global.mqttConnexion.publish(configMQTT.topic_system, message);
                                log4n.debug('done - ok');
                                resolve();
                            } else {
                                //erreur dans le processus d'enregistrement de la notification
                                log4n.debug('done - response error');
                                reject(errorparsing(datas));
                            }
                        }
                        resolve();
                    })
                    .catch(error => {
                        console.log(error);
                        log4n.debug('done - promise catch');
                        log4n.object(error, 'error');
                        reject(errorparsing(error));
                    });
            }
        } catch
            (error) {
            console.log(error);
            log4n.debug('done - global catch');
            log4n.object(error, 'error');
            reject(errorparsing(error));
        }
    })
        ;
}
;
