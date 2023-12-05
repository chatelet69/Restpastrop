const Reservation           = require("../model/Reservation");
const ReservationService    = require("../services/ReservationService");
const moment                = require("moment");
const reservationService    = new ReservationService();

class ReservationController {
    async postReservation(req, res) {
        try {
            const data = {
                clientId : req.body.clientId,
                idAppart : req.body.idAppart,
                startDate : moment().format(req.body.startDate),
                endDate : moment().format(req.body.endDate),
                status : req.body.status
            }
            const result = await reservationService.bookAppart(data)
            console.log(result)
            res.status(200)
            res.json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({error: `Error during get appart ${req.body.clientId}`});
        }
    }

    async cancelReservation(req, res){
        const data = {
            idUser : req.body.idUser,
            idReservation: req.body.idReservation
        }
        const result = await reservationService.cancelReservation(data.idUser, data.idReservation)
        console.log(data)
        res.status(200)
        res.json(result);
    }
}

module.exports = ReservationController;