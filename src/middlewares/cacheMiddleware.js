const cache = require('memory-cache');

const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        const key = '__express__' + req.originalUrl || req.url;
        const cachedBody = cache.get(key);

        if (cachedBody) {
            res.json(cachedBody);
            return;
        } else {
            res.sendResponse = res.json;
            res.json = (body) => {
                cache.put(key, body, duration * 1000); // Duration
                res.sendResponse(body);
            };
            next();
        }
    };
};

module.exports = cacheMiddleware;