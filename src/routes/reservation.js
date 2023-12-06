const express               = require("express");
const router                = express.Router();
const ReservationController = require("../controller/ReservationController");
const authMiddleware            = require("../middlewares/authMiddleware");
const authorizationMiddleware   = require("../middlewares/authorizationMiddleware");
const checkIfAdmin   = require("../middlewares/checkIfAdmin");

const reservationController = new ReservationController();

// GET

// POST

//ajouter véfication 
router.post("/reservation", [authMiddleware, authorizationMiddleware] ,reservationController.postReservation);

router.patch('/reservation/cancel', [authMiddleware, authorizationMiddleware, checkIfAdmin], reservationController.cancelReservation);

module.exports = router;