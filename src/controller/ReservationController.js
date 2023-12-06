const ReservationService    = require("../services/ReservationService");
const moment                = require("moment");
const reservationService    = new ReservationService();

class ReservationController {
    async postReservation(req, res) {
        try {
            const data = {
                clientId : req.user.userId,             // ID du user qui requête
                appartId : req.body.appartId,
                startDate : req.body.startDate,
                endDate : req.body.endDate,
                //status : req.body.status             // Mise en commentaire car statut mit par défaut
            }
            const result = await reservationService.bookAppart(data);
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({error: `Error during post reservation`});
        }
    }

    async cancelReservation(req, res){
        const data = {
            idUser : req.user.userId,               // ID du user qui requête
            idReservation: req.body.idReservation,
            isAdmin : req.user.isAdmin
        };
        const result = await reservationService.cancelReservation(data.idUser, data.idReservation, data.isAdmin);
        res.status(200).json(result);
    }
}

module.exports = ReservationController;