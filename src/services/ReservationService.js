const Reservation               = require("../model/Reservation");
const ReservationRepository     = require("../repository/ReservationRepository");
const AppartRepository          = require("../repository/AppartRepository");
const moment                    = require("moment");
const baseUrl                   = require("../../config.json").baseUrl;

class ReservationService {
    reservationRepository;

    constructor() {
        this.reservationRepository = new ReservationRepository();
        this.appartRepository = new AppartRepository();
    }

    async bookAppart(data) {
        try {
            for (const key in data) if (data[key] === undefined) return {error: "Date manquante ou non identifiée"};
            
            if (moment(data.startDate).isBefore(moment())) return {message: "La date de début est dans le passé"};
            if (moment(data.endDate).isBefore(moment())) return {message: "La date de fin est dans le passé"};
            if (moment(data.endDate).isBefore(data.startDate)) return {message: "La date de fin est avant la date de début"};
            
            const result = await this.checkAvailabilityAppart(data.appartId, data.endDate, data.startDate);
            if (result.isAvailable) {
                const res = await this.appartRepository.getAppartById(data.appartId);
                if (res == 0) {
                    return {message: "le logement n'existe pas"};
                } else {
                    const booked = await this.reservationRepository.saveReservation(data);
                    if (booked.affectedRows) {          // Vérifie que l'insert a bien affectée une ligne
                        return {
                            message: "Logement réservé",
                            viewReservation: {
                                lien: `${baseUrl}/reservation/${booked.insertId}`,
                                method: "GET"
                                  }      // Renvoie l'id de la ligne insérée
                        };
                    } else {
                        return {error: "Une erreur est survenue durant la réservation."};
                    }
                }
            } else {
                return {message: "Cet appartement est déjà réservé."};
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
                    if (result.affectedRows) return {message : "Reservation annulée", info: {lien: `${baseUrl}/reservation/${idReservation}` ,method: "GET"}};
                    else return {error: "Impossible d'annuler la réservation"};
                } else {
                    return {message : 'Annulation de la reservation impossible'};
                }
            } else {
                return {message : "Réservations déjà annulée"};
            }
        }
    }

    async getReservation(idReservation, userId){
        try {
            if (idReservation) {
                if (idReservation>0) {
                    let result = await this.reservationRepository.getReservationById(idReservation);
                    let idOwner = result[0]['clientId'];

                    if (result) {
                        if (idOwner == userId) {
                            return result;
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
}

module.exports = ReservationService;