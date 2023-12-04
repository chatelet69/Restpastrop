const authorizationMiddleware = (req, res, next) => {
    const reqUser = req.user;
    if (!reqUser || reqUser.userId == 0 || reqUser.userId == undefined) return res.status(403).json({message: "unauthorized"});
    next();
};

module.exports = authorizationMiddleware;