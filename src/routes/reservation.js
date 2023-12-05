const express               = require("express");
const router                = express.Router();
const ReservationController = require("../controller/ReservationController");
const reservationController = new ReservationController();

// GET

// POST

//ajouter véfication 
router.post("/reservation", reservationController.postReservation);

module.exports = router;