const jwt       = require("jsonwebtoken");
const config    = require("../../config.json");
const secret    = config.secretJwt;

const authMiddleware = (req, res, next) => {
    const authToken = req.headers.authorization;
    if (authToken) {
        try {
            const infos = jwt.verify(authToken, secret);
            req.user = infos;
            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "error"});
        }
    } else {
        return res.status(403).json({message: "unauthorized"});
    }
};

module.exports = authMiddleware;