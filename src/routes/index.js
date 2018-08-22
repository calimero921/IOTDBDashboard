const Log4n = require('../utils/log4n.js');
const getConfig = require('../utils/getconfig.js');
const getAuthorized = require('../utils/getauthorized.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/routes/index');

    let config = {title: "Error"};
    try {
        getConfig(req, res)
            .then(data => {
                log4n.object(data, 'config');
                if (typeof data === 'undefined') throw 'no config available';
                config = data;
                config.title = req.t('index:title');
                config.features = [
                    {
                        "comment": "nouveauté 1",
                        "title": "#1",
                        "description": {
                            "line1": "Première nouveauté ligne 1",
                            "line2": "Première nouveauté ligne 2"
                        }
                    },
                    {
                        "comment":
                            "nouveauté 2",
                        "title":
                            "#2",
                        "description": {
                            "line1": "Seconde nouveauté ligne 1",
                            "line2": "Seconde nouveauté ligne 2"
                        }
                    },
                    {
                        "comment":
                            "nouveauté 3",
                        "title":
                            "#3",
                        "description": {
                            "line1": "Troisième nouveauté ligne 1",
                            "line2": "Troisième nouveauté ligne 2"
                        }
                    },
                    {
                        "comment":
                            "nouveauté 4",
                        "title":
                            "#4",
                        "description": {
                            "line1": "Quatrième nouveauté ligne 1",
                            "line2": "Quatrième nouveauté ligne 2"
                        }
                    }
                ];
                log4n.object(config, 'config');

                let rights = {
                    private: false,
                    admin: false,
                    self: false,
                    url: 'index/index.html'
                };
                return getAuthorized(config, rights);
            })
            .then(result => {
                res.render(result, config);
            })
            .catch(error => {
                log4n.error(error);
                config.message = error.error_code + " " + error.error_message;
                res.render('error.html', config);
            });
    } catch (error) {
        log4n.error(error);
        config.message = error.error_code + " " + error.error_message;
        res.render('error.html', config);
    }
};