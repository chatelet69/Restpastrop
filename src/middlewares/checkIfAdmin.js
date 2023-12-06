const checkIfAdmin = (req, res, next) => {
    const reqUser = req.user;
    if (!reqUser || reqUser.role !== "admin") req.user.isAdmin = false;
    next();
};

module.exports = checkIfAdmin;