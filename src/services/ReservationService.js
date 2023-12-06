const Reservation               = require("../model/Reservation");
const ReservationRepository     = require("../repository/ReservationRepository");
const AppartRepository          = require("../repository/AppartRepository");
const moment                    = require("moment");

class ReservationService {
    reservationRepository;

    constructor() {
        this.reservationRepository = new ReservationRepository();
        this.appartRepository = new AppartRepository();
    }

    async bookAppart(data) {
        try {
            if (moment(data.startDate).isBefore(moment().locale())) {
                return {
                    message: 'start date is in the past'
                }
            }
            if (moment(data.endDate).isBefore(moment().locale())) {
                return {
                    message: 'end date is in the past'
                }
            }
            if (moment(data.endDate).isBefore(data.startDate)) {
                return {
                    message: 'end date is before start date'
                }
            }
            
            console.log(`data before calling check: ${data.idAppart} ${data.endDate} ${data.startDate}`)
            const result = await this.checkAvailabilityAppart(data.idAppart, data.endDate,data.startDate)
            console.log(result)
            if (result.isAvailable) {
                const res = await this.appartRepository.getAppartById(data.idAppart)
                if (res==0){
                    return {
                        message: "l'appart n'existe pas"
                        
                    }
                    
                }else{
                    const booked = this.reservationRepository.saveReservation(data)
                    return {
                        message: 'appart booked',
                        reservationId: res[0].id
                    }
                }
                
            } else {
                console.log(`appartment unavailable`)
                return {
                    message: 'appart already booked'
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async checkAvailabilityAppart(appartId, endDate, startDate){
        const result = await this.reservationRepository.checkAvailabilityAppart(appartId, endDate, startDate)
        console.log(result)
        return {
            isAvailable: (result.length == 0),
            result: result
        } 
    }

    async saveReservation(data){
        const result = await reservationRepository.saveReservation(data)
    }

    async cancelReservation(idUser, idReservation, isAdmin){ 
        const resultReservation = await this.reservationRepository.getReservationById(idReservation)
        const resultAppartUser = await this.appartRepository.getAppartsByOwner(idUser)
        const id = resultAppartUser.map(item => item.id);
        const isIdAppartEqual = id.includes(resultReservation[0].appartId)
    
        if(resultReservation.length == 0){
             return {
                message : "appart doesn't exist"
             }
        }else{
            if (resultReservation[0].status == 'BOOKED'){
                if(resultReservation[0].clientId == idUser || isIdAppartEqual || isAdmin == true){
                    const result = await this.reservationRepository.cancelReservation(idReservation)
                    return {
                        message : 'reservation CANCELED'
                    }
                }else{
                    return{
                        message : 'annulation de la reservation impossible'
                    }
                }
            }else{
                return {
                    message : 'reservation already canceled'
                }
            }
        }
    }
}

module.exports = ReservationService;