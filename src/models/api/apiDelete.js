/* jslint node: true */
/* jslint esversion: 6 */
/* jshint -W117 */

'use strict';

const http = require('http');
const Log4n = require('../util/log4n');
const api = require('../../config/apiaccess');
const decodeResponse = require('../util/decodeResponse');

module.exports = function (apiPath, errorMessage) {
	const log4n = new Log4n('/models/api/apiDelete');

	log4n.debug('apiPath: ' + apiPath);
//	log4n.debug('errorMessage: ' + errorMessage);

	return new Promise((resolve, reject) => {
		let callReturn;
		try {
			if(typeof apiPath === 'undefined') throw('missing apiPath parameter');
			if(typeof errorMessage === 'undefined') throw('missing errorMessage parameter');

			const options = {
                host: api.hostName,
                port: api.hostPort,
                path: api.hostPath + apiPath,
                method: 'DELETE',
                headers: {
                    'x-odmtrack-key': api.keyValue,
                    'Accept': 'application/json'
                }
            };
//			log4n.object(options, 'options');

			const request = http.get(options, function(response) {
				if (response.statuscode < 200 || response.code > 299) {
					throw('Delete failed:' + response.statuscode);
				} else {
					response.setEncoding('utf8');
					response.on('end', () => {
						log4n.debug('response:' + callReturn);
						let responseContent = {};
						if(typeof callReturn === 'undefined') {
							log4n.debug('resolve return empty');
							responseContent.code = 200;
							responseContent.type = "unknown";
							responseContent.message = "ok";
							resolve(responseContent);
						} else {
							responseContent = decodeResponse(callReturn);
							log4n.object(responseContent, "response");

							if(typeof responseContent.code === 'undefined') {
								//le champ code est absent => on a des données
								log4n.debug('resolve implicit ok');
								resolve(responseContent);
							} else {
								//le champ code est présent mais à 200 => réponse correcte
								if(responseContent.code === '200') {
									log4n.debug('resolve explicit ok');
									resolve(responseContent);
								} else {
									//le champ code est présent et affiche une erreur
									log4n.debug('reject error:' + responseContent.code);
									reject(responseContent);
								}
							}
						}
					});

					response.on('data', (chunk) => {
//					log4n.debug('chunk:' + chunk);
						if(typeof chunk === 'undefined') throw('chunk empty');

						if(typeof callReturn === 'undefined') callReturn = "";
						callReturn = callReturn + chunk;
					});
				}
			});
			request.on('error', (err) => reject(err));
		} catch(err) {
			reject('/router/api/apiDelete:' + err);
		}
	});
};