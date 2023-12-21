const Reservation               = require("../model/Reservation");
const ReservationRepository     = require("../repository/ReservationRepository");
const AppartRepository          = require("../repository/AppartRepository");
const moment                    = require("moment");
const baseUrl                   = require("../../config.json").baseUrl;
const UtilService               = require("./UtilService");
const utilService               = new UtilService();

class ReservationService {
    reservationRepository;

    constructor() {
        this.reservationRepository = new ReservationRepository();
        this.appartRepository = new AppartRepository();
    }

    async bookAppart(data) {
        try {
            if (data.startDate === undefined || data.endDate === undefined){
                return {error: "Date manquante ou non identifiée"};
            }
            
            const checkdates = utilService.checkDatesPast(data.startDate, data.endDate);
            if (checkdates !== "ok") return checkdates;
            
            const result = await this.checkAvailabilityAppart(data.appartId, data.endDate, data.startDate);
            if (result.isAvailable) {
                const res = await this.appartRepository.getAppartById(data.appartId);
                if (res == 0) {
                    return {error: "le logement n'existe pas"};
                } else {
                    const booked = await this.reservationRepository.saveReservation(data);
                    if (booked.affectedRows) {          // Vérifie que l'insert a bien affectée une ligne
                        return {
                            message: "Logement réservé",
                            viewReservation: {
                                link: `${baseUrl}/reservation/${booked.insertId}`,
                                method: "GET"
                                  }      // Renvoie l'id de la ligne insérée
                        };
                    } else {
                        return {error: "Une erreur est survenue durant la réservation."};
                    }
                }
            } else {
                return {error: "Cet appartement est déjà réservé."};
            }
        } catch (error) {
            console.log(error);
            return {error: "Erreur du service de Réservation"};
        }
    }

    async checkAvailabilityAppart(appartId, endDate, startDate){
        const result = await this.reservationRepository.checkAvailabilityAppart(appartId, endDate, startDate);
        return {
            isAvailable: (result.length == 0),
            result: result
        };
    }

    async saveReservation(data){
        await reservationRepository.saveReservation(data);
    }

    async cancelReservation(userId, idReservation, isAdmin){ 
        const resultReservation = await this.reservationRepository.getReservationById(idReservation)
        const resultAppartUser = await this.appartRepository.getAppartsByOwner(userId)
        const id = resultAppartUser.map(item => item.id);
        const isIdAppartEqual = id.includes(resultReservation[0].appartId);
    
        if (resultReservation.length === 0) {
            return {message : "Ce logement n'existe pas"};
        } else {
            if (resultReservation[0].status === "BOOKED") {
                if (resultReservation[0].clientId == userId || isIdAppartEqual || isAdmin) {
                    const result = await this.reservationRepository.cancelReservation(idReservation);
                    if (result.affectedRows) return {message : "Reservation annulée", info: {link: `${baseUrl}/reservation/${idReservation}`, method: "GET"}};
                    else return {error: "Impossible d'annuler la réservation"};
                } else {
                    return {error : 'Annulation de la reservation impossible'};
                }
            } else {
                return {error : "Réservations déjà annulée"};
            }
        }
    }

    async getReservation(idReservation, userId, isAdmin){
        try {
            if (idReservation) {
                if (idReservation>0) {
                    let result = await this.reservationRepository.getReservationById(idReservation);
                    if (result) {
                        let idOwner = result[0]['clientId'];
                        if (idOwner == userId || isAdmin) {
                            return result[0];
                        }else{
                            return false;
                        }
                    }else{
                        return false;
                    }
                }
            }else{
                return false;
            }
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async editReservation(resId, userId, editedData, isAdmin) {
        try {
            const authorized = ["startDate", "endDate"];
            const reservation = (await this.reservationRepository.getReservationById(resId))[0];
            if (reservation && (reservation.clientId === userId || isAdmin)) {
                if (!utilService.checkKeysInData(editedData, null, authorized)) return {error: "Données manquantes ou mauvais format"};
                
                if (editedData.startDate === undefined) editedData.startDate = reservation.startDate;
                if (editedData.endDate === undefined) editedData.endDate = reservation.endDate;

                const checkDates = utilService.checkDatesPast(editedData.startDate, editedData.endDate);
                if (checkDates !== "ok") return checkDates;

                const checkAvailabilityAppart = await this.checkAvailabilityAppart(reservation.appartId, editedData.endDate, editedData.startDate);
                if (checkAvailabilityAppart.isAvailable) {    
                    editedData.resId = resId;
                    const resDb = await this.reservationRepository.editReservation(editedData);
                    if (resDb.affectedRows) return {message: "Réservation modifiée", infos: {link: `${baseUrl}/reservation/${resId}`, method: "GET"}};
                    else return false;
                } else {
                    return {error: "Appartement non disponible"};
                }
            } else {
                return {error: "Réservation inexistante ou droits insuffisants"};
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

module.exports = ReservationService;