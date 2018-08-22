const configMQTT = require('../config/mqtt.js');
const Log4n = require('../utils/log4n.js');
const mqtt = require('mqtt');
const checkJSON = require('../utils/checkJSON.js');
const mqttroute = require('../mqttroutes/mqttroute.js')

const log4n = new Log4n('/MQTTEngine');
let clientMQTT = {};
let mqttURL = {};

function MQTTEngine() {
    mqttURL = 'mqtt://' + configMQTT.server + ':' + configMQTT.port
}

/**
 *
 */
MQTTEngine.prototype.start = function() {
    clientMQTT = mqtt.connect(mqttURL);
    clientMQTT.on('connect', onConnect);
    clientMQTT.on('reconnect', onReconnect);
    clientMQTT.on('close', onClose);
    clientMQTT.on('offline', onOffline);
    clientMQTT.on('error', onError);
    clientMQTT.on('message', onMessage);
    clientMQTT.on('packetsend', onPacketSend);
    clientMQTT.on('packetreceive', onPacketReceived);
};


/**
 *
 */
MQTTEngine.prototype.stop = function() {
    clientMQTT.end();
};

/**
 *
 */
MQTTEngine.prototype.publish = function(topic, message) {
    log4n.debug('MQTT client publish starting');
    // log4n.object(topic, 'topic');
    // log4n.object(JSON.stringify(message), 'message');

    clientMQTT.publish(topic, JSON.stringify(message), error => {
        if(typeof error === 'undefined') {
            log4n.debug('publish ok');
        } else {
            log4n.object(error, 'publish error');
        }
    });
    log4n.debug('MQTT client publish done');
};

/**
 *
 */
MQTTEngine.prototype.subscribe = function(topic) {
    log4n.debug('MQTT client subscribe starting');
    // log4n.object(topic, 'topic');

    clientMQTT.subscribe(topic, (error, granted) => {
        if (typeof error === 'undefined') {
            log4n.object(granted, 'subscribe granted');
        } else {
            log4n.object(error, 'subscribe error');
        }
    });
    log4n.debug('MQTT client subscribe done');
};

/**
 *
 */
MQTTEngine.prototype.unsubscribe = function(topic) {
    log4n.debug('MQTT client unsubscribe starting');
    // log4n.object(topic, 'topic');

    clientMQTT.unsubscribe(topic, error => {
        if(typeof error === 'undefined') {
            log4n.debug('unsubscribe ok');
        } else {
            log4n.object(error, 'unsubscribe error');
        }
    });
    log4n.debug('MQTT client unsubscribe done');
};

/**
 *
 */
function onConnect() {
    log4n.debug('MQTT client connecting');
    log4n.debug('MQTT client subscribing "' + configMQTT.topic_register + '" topic');
    this.subscribe(configMQTT.topic_register);
    log4n.debug('MQTT client subscribing "' + configMQTT.topic_sensor + '" topic');
    this.subscribe(configMQTT.topic_sensor);
    log4n.debug('MQTT client subscribing "' + configMQTT.topic_slave + '" topic');
    this.subscribe(configMQTT.topic_slave);
    log4n.debug('MQTT client subscribing "' + configMQTT.topic_switch + '" topic');
    this.subscribe(configMQTT.topic_switch);
    log4n.debug('MQTT client connected');
}

/**
 *
 */
function onReconnect() {
    log4n.debug('MQTT client reconnecting');
    log4n.debug('MQTT client reconnected');
}

/**
 *
 */
function onClose() {
    log4n.debug('MQTT client closing');
    log4n.debug('MQTT client closed');
}

/**
 *
 */
function onOffline() {
    log4n.debug('MQTT client offlining');
    log4n.debug('MQTT client offlined');
}

/**
 *
 */
function onError(error) {
    log4n.debug('MQTT client error');
    console.log('error: ' + error);
    log4n.debug('MQTT client error');
}

/**
 *
 */
function onMessage(topic, message, packet) {
    log4n.debug('MQTT client message starting');
    // log4n.object(topic, 'topic');
    // log4n.object(message.toString(), 'message');
    // log4n.object(packet, 'packet');

    let result = checkJSON(message);
    // log4n.object(result, 'result');

    mqttroute(topic, result)
        .then(datas => {
            log4n.debug('MQTT client message done');
        })
        .catch(error => {
            log4n.debug('MQTT client message error');
        });
}

/**
 *
 */
function onPacketSend(packet) {
    // log4n.debug('MQTT client sending packet');
    // log4n.object(packet, 'packet');
    // log4n.debug('MQTT client sent packet');
}

/**
 *
 */
function onPacketReceived(packet) {
    // log4n.debug('MQTT client receiving packet');
    // log4n.object(packet, 'packet');
    // log4n.debug('MQTT client received packet');
}

module.exports = MQTTEngine;
