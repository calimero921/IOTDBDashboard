const Log4n = require('../utils/log4n.js');
const errorparsing = require('../utils/errorparsing.js');

const deviceRegister = require('./device/register.js');
const deviceSensor = require('./device/sensor.js');
const deviceSlave = require('./device/slave.js');
const deviceSwitch = require('./device/switch.js');

// const devicePost = require('./api/device/post.js');
// const deviceGet = require('./api/device/get.js');
// const deviceDelete = require('./api/device/delete.js');
// const devicePatch = require('./api/device/patch.js');

module.exports = function (topic, content) {
    const log4n = new Log4n('/routes/mqttroute');
    // log4n.object(topic, 'topic');
    // log4n.object(content, 'content');

    return new Promise(function (resolve, reject) {
        switch (topic) {
            case 'register':
                deviceRegister(content)
                    .then(datas => {
                        if (typeof datas === 'undefined') {
                            log4n.debug('insertion ok');
                            resolve();
                        } else {
                            log4n.object(datas, 'error');
                            reject(datas);
                        }
                    })
                    .catch(error => {
                        log4n.object(error, 'error');
                        reject(errorparsing(error));
                    });
                break;
            case 'sensor':
                deviceSensor(content)
                    .then(datas => {
                        if (typeof datas === 'undefined') {
                            log4n.debug('sensor ok');
                            resolve();
                        } else {
                            log4n.object(datas, 'error');
                            reject(datas);
                        }
                    })
                    .catch(error => {
                        log4n.object(error, 'error');
                        reject(errorparsing(error));
                    });
                break;
            case 'slave':
                deviceSlave(content)
                    .then(datas => {
                        if (typeof datas === 'undefined') {
                            log4n.debug('slave ok');
                            resolve();
                        } else {
                            log4n.object(datas, 'error');
                            reject(datas);
                        }
                    })
                    .catch(error => {
                        log4n.object(error, 'error');
                        reject(errorparsing(error));
                    });
                break;
            case 'switch':
                deviceSwitch(content)
                    .then(datas => {
                        if (typeof datas === 'undefined') {
                            log4n.debug('switch ok');
                            resolve();
                        } else {
                            log4n.object(datas, 'error');
                            reject(datas);
                        }
                    })
                    .catch(error => {
                        log4n.object(error, 'error');
                        reject(errorparsing(error));
                    });
                break;
            default:
                log4n.debug('error unknown topic');
                reject(errorparsing({error_code: 500, error_message: 'Unknown topic'}));
                break;
        }
    });
};
