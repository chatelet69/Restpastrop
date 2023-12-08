const express                   = require("express");
const router                    = express.Router();
const ReservationController     = require("../controller/ReservationController");
const authMiddleware            = require("../middlewares/authMiddleware");
const authorizationMiddleware   = require("../middlewares/authorizationMiddleware");
const dateTimeMiddleware        = require("../middlewares/dateTimeMiddleware");
const checkIfAdmin              = require("../middlewares/checkIfAdmin");
const reservationController     = new ReservationController();

// Créer une réservation
router.post("/reservation", [authMiddleware, authorizationMiddleware, dateTimeMiddleware], reservationController.postReservation);

// Annuler une réservation
router.patch('/reservation/cancel', [authMiddleware, authorizationMiddleware, checkIfAdmin], reservationController.cancelReservation);

module.exports = router;