const checkIfAdmin = (req, res, next) => {
    const reqUser = req.user;
    if (!reqUser || reqUser.role !== "admin") req.user.isAdmin = false;
    else if (reqUser && reqUser.role === "admin") req.user.isAdmin = true;
    next();
};

module.exports = checkIfAdmin;