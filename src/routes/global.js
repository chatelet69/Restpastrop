const express   = require('express');
const router    = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({message: "Bienvenue sur notre API, veuillez trouver notre documentation ci dessous :", documentation : "https://doc.com"});
});

module.exports = router;