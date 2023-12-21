const ReservationService    = require("../services/ReservationService");
const reservationService    = new ReservationService();
// Messages d'erreurs
const editReservationError  = require("../utils/form.json").editReservationError;
const getReservationError   = require("../utils/form.json").getReservationError;

class ReservationController {
    async postReservation(req, res) {
        try {
            const data = {
                clientId : req.user.userId,             // ID du user qui requête
                appartId : req.body.appartId,
                startDate : req.body.startDate,
                endDate : req.body.endDate,
            }
            const result = await reservationService.bookAppart(data);
            console.log(result.error);
            if (result.error){
                res.status(400).json(result);
            }else {
                res.status(200).json(result)
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error: `Une erreur est survenue durant la création de la réservation`});
        }
    }

    async cancelReservation(req, res){
        try {
            const data = {
                idUser : req.user.userId,               // ID du user qui requête
                idReservation: req.body.idReservation,
                isAdmin : req.user.isAdmin
            };
            const result = await reservationService.cancelReservation(data.idUser, data.idReservation, data.isAdmin);
            if (result.error) {
                res.status(400).json(result);
            }else {
                res.status(200).json(result)
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Erreur durant l'annulation de la réservation"});
        }
    }

    async getReservation(req, res) {
        try {
            const idReservation = req.params.id;
            const userId = req.user.userId;
            const isAdmin = req.user.isAdmin;
            const result = await reservationService.getReservation(idReservation, userId, isAdmin);
            console.log(result);
            if (result) res.status(200).json(result);
            else res.status(500).json({error: getReservationError});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: getReservationError});
        }
    }

    async editReservation(req, res) {
        try {
            const editData = req.body;
            const isAdmin = req.user.isAdmin;
            const userId = req.user.userId;
            const resId = req.params.id;
            const result = await reservationService.editReservation(resId, userId, editData, isAdmin);
            if (!result.error) res.status(200).json(result);
            else res.status(500).json({error: editReservationError});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: editReservationError});
        }
    }
}

module.exports = ReservationController;