/* jslint node: true */
/* jslint esversion: 6 */
/* jshint -W117 */

'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');
const api = require('../../config/iotdbapi.js');
const Log4n = require('../../utils/log4n');
const decodeResponse = require('../../utils/decodeResponse');
const errorparsing = require('../../utils/errorparsing.js');

module.exports = function (apiPath, errorMessage, accesToken, overtake) {
	const log4n = new Log4n('/models/api/apiGet');
	log4n.debug('apiPath:' + apiPath);
	// log4n.debug('errorMessage: ' + errorMessage);
	log4n.debug('accesToken:' + accesToken);
    log4n.debug('overtake:' + overtake);

	return new Promise((resolve, reject) => {
		let callReturn;
		try {
			if(typeof apiPath === 'undefined') throw ('missing apiPath parameter');
			if(typeof errorMessage === 'undefined') throw ('missing errorMessage parameter');
			if(typeof overtake === 'undefined') overtake = false;

			// log4n.object(api, 'api config');
			let certPath = path.join(process.cwd(), 'config', api.cert);
			// log4n.object(certPath, 'certPath');
			let certificate = fs.readFileSync(certPath);
			// log4n.object(certificate, 'certificate');
			const options = {
                host: api.hostName,
                port: api.hostPort,
                path: api.hostPath + apiPath,
				ca: certificate,
                method: 'GET',
                headers: {
                	'Authorization': "Bearer " + accesToken,
                    'Accept': 'application/json'
                }
            };
			log4n.object(options.path, 'options.path');

			const request = https.get(options, response => {
				if (response.statuscode < 200 || response.code > 299)
					throw('Get failed:' + response.statuscode);

				response.setEncoding('utf8');
				response.on('end', () => {
					log4n.debug('callReturn:' + callReturn);
					let responseContent = {};
					if(typeof callReturn === 'undefined') {
						log4n.debug('reject:return empty.');
						reject(errorparsing('GET:return empty'));
					} else {
						responseContent = decodeResponse(callReturn);
						// log4n.object(responseContent, "response");
						//le champ code est absent => on a des données
						if(typeof responseContent.code === 'undefined') {
							log4n.debug('resolve implicit ok');
							resolve(responseContent);
						} else {
							// log4n.object(responseContent.error, 'error');
							if(typeof responseContent.error !== 'undefined') {
								if(responseContent.error.code === '200') {
									//le champ code est présent mais à 200 => réponse correcte
									responseContent.error = {};
									log4n.debug('resolve explicit ok');
									resolve(responseContent);
								} else {
									if(!overtake) {
										//le champ code est présent et affiche une erreur
										log4n.debug('reject error:' + callReturn);
										reject(responseContent);
									} else {
										//l'erreur est outrepassée à la demande du requeteur
										log4n.debug('resolve overtake:' + callReturn);
										resolve(responseContent);
									}
								}
							} else {
								log4n.debug('resolve real data ok');
								resolve(responseContent);
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
			});
			request.on('error', (error) => reject(errorparsing(error)));
		} catch(err) {
			reject(errorparsing(error));
		}
	});
};