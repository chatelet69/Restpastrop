const authAdminMiddleware = (req, res, next) => {
    const reqUser = req.user;
    if (!reqUser || reqUser.role !== "admin") return res.status(403).json({message: "unauthorized"});
    next();
};

module.exports = authAdminMiddleware;