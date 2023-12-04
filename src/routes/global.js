const express   = require('express');
const router    = express.Router();

router.get('/', (req, res) => {
    console.log("Requête reçue sur la route", req.route.path)
    res.status(200).json({message: "Welcome to the Api, see documentation here"});
});

module.exports = router;