const getMethodCheck = (req, res, next) => {
    if (req.method !== "GET") return res.status(405).json({error: "bad method", need: "GET method"})
    next();
};

module.exports = getMethodCheck;