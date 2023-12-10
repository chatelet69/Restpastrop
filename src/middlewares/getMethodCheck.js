const getMethodCheck = (req, res, next) => {
    if (req.method !== "GET") return res.status(405).json({error: "Mauvaise méthode", need: "GET"})
    next();
};

module.exports = getMethodCheck;