const express                   = require('express');
const router                    = express.Router();
const cacheMiddleware           = require("../middlewares/cacheMiddleware");
const AppartController          = require("../controller/AppartController");
const authMiddleware            = require("../middlewares/authMiddleware");
const authorizationMiddleware   = require("../middlewares/authorizationMiddleware");
const authAdminMiddleware       = require("../middlewares/authAdminMiddleware");
const checkIfAdmin              = require("../middlewares/checkIfAdmin");
const dateTimeMiddleware        = require("../middlewares/dateTimeMiddleware");
const appartControl             = new AppartController();

// Get method

router.get('/apparts', cacheMiddleware(60), (req, res) => {
    appartControl.getAllApparts(req, res);
});

router.get("/apparts/:id", (req, res) => {
    appartControl.getAppart(req, res);
});

router.get("/apparts/search/by", [authMiddleware, authorizationMiddleware], (req, res) => {
    appartControl.searchAppartBy(req, res);
});

router.get("/apparts/spec/:id", [authMiddleware, authorizationMiddleware], (req, res) => {
    appartControl.getSpecByAppart(req, res);
});

router.get("/apparts/:id/dates", [authMiddleware, authorizationMiddleware], (req, res) => {
    appartControl.getDatesOfAppart(req, res);
});

router.get("/apparts/:id/reservations", [authMiddleware, authorizationMiddleware, checkIfAdmin], (req, res) => {
    appartControl.getAppartReservations(req, res);
});

// Post method

router.post("/apparts/create", [authMiddleware, dateTimeMiddleware], async (req, res) =>{
    await appartControl.postAppart(req, res);
});

// Delete

router.delete("/apparts/:id",[authMiddleware], async (req, res) => {
    await appartControl.deleteAppart(req, res);
})

// Patch Method

router.patch("/apparts/:id", [authMiddleware, checkIfAdmin, dateTimeMiddleware], (req, res) => {
    appartControl.editAppart(req, res);
});

router.patch("/apparts/validate/:id", [authMiddleware, authAdminMiddleware], (req, res) => {
    appartControl.validAppart(req, res);
});

router.patch("/apparts/spec/:id", [authMiddleware, authorizationMiddleware, checkIfAdmin], (req, res) => {
    appartControl.patchSpecByAppart(req, res);
})

module.exports = router;