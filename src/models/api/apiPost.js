/* jslint node: true */
/* jslint esversion: 6 */
/* jshint -W117 */

'use strict';

const http = require('http');
const Log4n = require('../util/log4n');
const api = require('../../config/apiaccess');
const decodeResponse = require('../util/decodeResponse');

module.exports = function (apiPath, data, errorMessage) {
	const log4n = new Log4n('/models/api/apiPost');

	log4n.debug('apiPath: ' + apiPath);
	log4n.object(data, 'data');
//	log4n.debug('errorMessage: ' + errorMessage);

	return new Promise((resolve, reject) => {
		let callReturn;
		try {
			if(typeof apiPath === 'undefined') throw('missing apiPath parameter');
			if(typeof data === 'undefined') throw('missing data parameter');
			if(typeof errorMessage === 'undefined') throw('missing errorMessage parameter');

			const jsonObject = JSON.stringify(data);
//			log4n.debug('jsonObject: ' + jsonObject);

			 const options = {
                 host: api.hostName,
                 port: api.hostPort,
                 path: api.hostPath + apiPath,
                 method: 'POST',
                 headers: {
                     'x-odmtrack-key': api.keyValue,
                     'Content-Type': 'application/json',
                     'Content-Length': Buffer.byteLength(jsonObject),
                     'Accept': 'application/json'
                 }
             };

			 const request = http.request(options, (response) => {
				if (response.statuscode < 200 || response.code > 299)
					throw('Post failed:' + response.statuscode);

				response.setEncoding('utf8');
				response.on('end', () => {
					log4n.debug('response:' + callReturn);
					let responseContent = {};
					if(typeof callReturn === 'undefined') {
						log4n.debug('reject return empty.');
						reject('POST:return empty');
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
					log4n.debug('chunk:' + chunk);
					if(typeof chunk === 'undefined') throw('chunk empty');

					if(typeof callReturn === 'undefined') callReturn = "";
					callReturn = callReturn + chunk;
				});
			});
			request.on('error', (err) => reject(err));
			request.write(jsonObject);
			request.end();
		} catch(err) {
			reject('/router/api/apiPost:' + err);
		}
	});
};