const express                   = require("express");
const router                    = express.Router();
const ReservationController     = require("../controller/ReservationController");
const authMiddleware            = require("../middlewares/authMiddleware");
const authorizationMiddleware   = require("../middlewares/authorizationMiddleware");
const dateTimeMiddleware        = require("../middlewares/dateTimeMiddleware");
const checkIfAdmin              = require("../middlewares/checkIfAdmin");
const reservationController     = new ReservationController();

// Récupérer une réservation
router.get("/reservation/:id", [authMiddleware, authorizationMiddleware, checkIfAdmin], reservationController.getReservation);

// Créer une réservation
router.post("/reservation", [authMiddleware, authorizationMiddleware, dateTimeMiddleware], reservationController.postReservation);

// Annuler une réservation
router.patch("/reservation/cancel", [authMiddleware, authorizationMiddleware, checkIfAdmin], reservationController.cancelReservation);

// Modifier une réservation
router.patch("/reservation/:id", [authMiddleware, authorizationMiddleware, checkIfAdmin, dateTimeMiddleware], reservationController.editReservation);

module.exports = router;