const express                   = require('express');
const router                    = express.Router();
const cacheMiddleware           = require("../middlewares/cacheMiddleware");
const AppartController          = require("../controller/AppartController");
const authMiddleware            = require("../middlewares/authMiddleware");
const authorizationMiddleware   = require("../middlewares/authorizationMiddleware");
const authAdminMiddleware       = require("../middlewares/authAdminMiddleware");
const appartControl             = new AppartController();

// Get method

router.get('/apparts', cacheMiddleware(60), (req, res) => {
    appartControl.getAllApparts(req, res);
});

router.get("/apparts/:id", (req, res) => {
    appartControl.getAppart(req, res);
});

// Post method

router.post("/apparts/create", [authMiddleware, authAdminMiddleware], async (req, res) =>{
    await appartControl.postAppart(req, res);
});

router.delete("/apparts/:id",[authMiddleware], async (req, res) => {
    await appartControl.deleteAppart(req, res);
})

// Patch Method

router.patch("/apparts/:id", [authMiddleware], (req, res) => {
    appartControl.editAppart(req, res);
});

module.exports = router;