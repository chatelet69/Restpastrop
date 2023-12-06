const authAdminMiddleware = (req, res, next) => {
    const reqUser = req.user;
    if (!reqUser || reqUser.rank !== "admin") return res.status(403).json({message: "Unauthorized"});
    next();
};

module.exports = authAdminMiddleware;