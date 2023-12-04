const logMiddleware = (req, res, next) => {
    console.log("Requête reçue sur la route :", req.originalUrl);
    next();
}

module.exports = logMiddleware;