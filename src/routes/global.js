const express   = require('express');
const router    = express.Router();
const docLink   = require("../../config.json").docLink;

router.get('/', (req, res) => {
    res.status(200).json({message: "Bienvenue sur notre API, veuillez trouver notre documentation ci dessous :", documentation : docLink});
});

module.exports = router;