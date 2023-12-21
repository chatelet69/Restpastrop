const Appart                = require("../model/Appart");
const AppartRepository      = require("../repository/AppartRepository");
const baseUrl               = require("../../config.json").baseUrl;
const UserRepository        = require("../repository/UserRepository");
const moment                = require("moment");
const form                  = require("../utils/form.json");
const ReservationRepository = require("../repository/ReservationRepository");

class AppartService {
    repository;
    userRepo;

    constructor(){
        this.repository = new AppartRepository();
        this.reservRepo = new ReservationRepository();
        this.userRepo = new UserRepository();
    }

    async getAllApparts() {
        try {
            let apparts = await this.repository.getAllOnlineApparts();
            for (const appart in apparts){
                apparts[appart].specs = `${baseUrl}/apparts/${apparts[appart].id}/specs`;
                apparts[appart].link = `${baseUrl}/apparts/${apparts[appart].id}`;
            }
            return apparts;
        } catch (error) {
            console.log("Une erreur est survenue lors de la recupération des logements : ", error);
            return false;
        }
    }

    async getAppartById(appartId) {
        try {
            let [appart] = await this.repository.getAppartById(appartId);
            if (appart !== undefined) appart.specs = `${baseUrl}/apparts/${appart.id}/specs`;
            return (appart !== undefined) ? appart : {error: form.appartInexistant};
        } catch (error) {
            console.log("Une erreur est survenue lors de la recupération du logement : ", error);
            return false;
        }
    }

    async createAppart(idOwner, title, address, status, price, area, nb_rooms, max_people, userRank, userId, startDate, endDate) {
        // Code de Mathis
        if (typeof title === 'string' && typeof address === 'string') {
            if(!idOwner) idOwner = userId;
            if(userRank === "admin"){
                status = "dispo";
            }else{
                status = "en attente"
                if(idOwner != userId) return false
            }
            if(!startDate || !endDate){
                return false;
            }
            if (!isNaN(idOwner) && !isNaN(price) && !isNaN(area) && !isNaN(nb_rooms) && !isNaN(max_people)) {
                
                if (idOwner > 0) {
                    let data = [idOwner, title, address, status, price, area, nb_rooms, max_people, startDate, endDate];
                    let results = await this.repository.createAppart(data);
                    if (!results) {
                        return false;
                    }else{
                        if(idOwner != userId && await this.userRepo.getRankById(idOwner) == "user") await this.userRepo.changeRankById("owner", idOwner); 
                        return results;
                    }
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    async deleteAppart(req, res) {
        if (!isNaN(req.params.id)) {
            if (req.params.id>0) {
                if (req.user.rank === "owner") {
                    let idOwner = await this.repository.getOwnerByAppart(req.params.id);
                    if (idOwner[0]['owner'] === req.user.userId) {
                        let results = await this.repository.delAppart(req.params.id, idOwner[0]['owner']);
                        if (!results) {
                            res.status(500).json({error: "Une erreur est survenue lors de la suppression de l'appartement"});
                        }else{
                            return "ok";
                        }
                    }else{
                        return "Vous n'êtes pas le propriétaire de cet appartement";
                    }
                }else if (req.user.rank === "admin") {
                    let idOwner = await this.repository.getOwnerByAppart(req.params.id);
                        let results = await this.repository.delAppart(req.params.id, idOwner[0]['owner']);
                        if (!results) {
                            res.status(500).json({error: "Une erreur est survenue lors de la suppression de l'appartement"});
                        }else{
                            return "ok";
                        }
                }else{
                    return "Mauvais rank";
                }
            }else{
                return "Mauvais id";
            }
        }else{
            return "Id de mauvais type";
        }
    }

    async editAppart(userId, appartId, newData, isAdmin) {
        try {
            const appart = await this.repository.getAppartById(appartId);
            if (appart !== undefined && Object.keys(appart).length) {
                if (appart.owner != userId && !isAdmin) return "Permission refusée";
                const resDb = await this.repository.editAppart(appartId, newData);
                if (resDb.affectedRows > 0) return {message: "Logement édité", info:{link: `${baseUrl}/apparts/${appartId}` , method: "GET"}};
            }
            return appartInexistant;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    async validAppart(appartId){
        if (appartId) {
            const stat = await this.repository.getStatusByAppart(appartId);
            if (stat[0]['status'] == "en attente") {
                let object = [];
                object['status']= "dispo";
                const resDb = await this.repository.editAppart(appartId, object);
                if (resDb.affectedRows>0) {
                    const idOwner = await this.repository.getOwnerByAppart(appartId);
                    console.log(idOwner);
                    let newRank = "owner";
                    const resOwner = await this.userRepo.changeRankById(newRank, idOwner[0]['owner'])
                    if (resOwner.affectedRows>0) {
                        return {message: "Logement validé", info:{link: `${baseUrl}/apparts/${appartId}` , method: "GET"}};
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    async searchAppartBy(query){
        try {
            let authorized = ["id","owner","title","address","status","price","area","nb_rooms","max_people"];
            for(let key in query)
                if(!authorized.includes(key)) return "Erreur, mauvais paramètres";

            let resRepo = await this.repository.searchAppartBy(query);
            if (resRepo) {
                for(const appart in resRepo){
                    resRepo[appart].infos = `${baseUrl}/apparts/${resRepo[appart].id}`;
                }
                return resRepo;
            }else{
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async getSpecByAppart(appartId){
        try{
           const result = await this.repository.getSpecByAppart(appartId);
           if (result.length == 0) return {error:"L'appartement n'a pas de spécificité"};
           else return result[0];
        } catch (error){
            console.log("Error at GetSpecByAppart : ", error);
            return false;
        }
    }

    async patchSpecByAppart(appartId, data, isAdmin, userId ){
        try{
            const resultAppartUser = await this.repository.getAppartsByOwner(userId)
            const ids = resultAppartUser.filter(item => item.id==appartId);
            if (ids != 0 || isAdmin) {
                const result = await this.repository.patchSpecByAppart(appartId, data);
            }else {
                return {
                    message :'La modification ne peut pas être effectuée'
                }
            }
         } catch (error){
             console.log("Error at PatchSpecByAppart : ", error);
             return false;
         }

    }

    async getDatesOfAppart(appartId) {
        try {
            const appart = (await this.repository.getAppartById(appartId))[0];
            if (appart && appart.id == appartId) {
                const resDb = await this.repository.getReservDatesOfAppart(appartId);
                const availability = {start: appart.startDate, end: appart.endDate};
                if (resDb.length == 0) return {appartId: appartId, dates: availability};
                const availableDates = this.getAvailableDateRanges(availability, resDb);
                return {appartId: appartId, dates: availableDates};
            } else {
                return {error: form.appartInexistant};
            }
        } catch (error) {
            console.log("Error at getDatesOfAppart : ", error);
            return false;
        }
    }

    async getAppartReservations(appartId, userId, isAdmin) {
        try {
            const appart = (await this.repository.getAppartById(appartId))[0];
            if (appart && appart.id == appartId && (appart.owner === userId || isAdmin)) {
                const reservations = await this.reservRepo.getReservationsByAppart(appartId);
                return reservations;
            } else {
                return {error: form.unfoundOrNoPerms};
            }
        } catch (error) {
            console.log("Error at getAppartReservations : ", error);
            return false;
        }
    }

    getAvailableDates(availability, reservations) {
        let availableDates = [];
        let date = moment(availability.start);
        let end = moment(availability.end);

        // Tant qu'on a pas atteint la date finale, on ajoute une date dans le tableau
        while (date.isSameOrBefore(end)) {
            availableDates.push(date.format('YYYY-MM-DD'));
            date.add(1, "days");
        }

        for (const reservation in reservations) {
            const actualStart = reservations[reservation].reservationStart;
            const actualEnd = reservations[reservation].reservationEnd;

            // On renvoie un nouveau tableau filtré qui consiste
            // à checker si la date actuelle fait partie d'une range de réservation afin de la retourner ou non
            availableDates = availableDates.filter(actual => {
                const actualDate = moment(actual);
                if (actualDate.isBefore(actualStart) || actualDate.isAfter(actualEnd)) return actualDate;
            });
        }

        return availableDates;
    }

    getAvailableDateRanges(availability, reservations) {
        const availableDates = this.getAvailableDates(availability, reservations);
        let ranges = [];

        let actualRange = {startDate: availableDates[0], endDate: availableDates[0]};
        for (let i = 1; i < availableDates.length; i++) {
            const old = moment(availableDates[i-1], "YYYY-MM-DD");
            const actual = moment(availableDates[i], "YYYY-MM-DD");
            
            // Si l'écart est supérieur à un jour, c'est qu'on est passé dans une nouvelle tranche
            if (actual.diff(old, 'days') > 1) {
                // Dans ce cas la date - 1 est la fin d'une ancienne tranche
                actualRange.endDate = availableDates[i-1];
                ranges.push(actualRange);
                // On affecte la date actuelle comme début de nouvelle tranche
                actualRange = {};
                actualRange.startDate = availableDates[i];
            } else {
                actualRange.endDate = availableDates[i];
            }
        }

        // Afin d'ajouter la dernière tranche
        ranges.push(actualRange);

        return ranges;
    }
}

module.exports = AppartService;