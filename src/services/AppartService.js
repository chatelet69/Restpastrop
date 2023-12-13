const Appart            = require("../model/Appart");
const AppartRepository  = require("../repository/AppartRepository");
const baseUrl           = require("../../config.json").baseUrl;
const UserRepository    = require("../repository/UserRepository");
const appartInexistant  = require("../utils/form.json").appartInexistant;

class AppartService {
    repository;
    userRepo;

    constructor(){
        this.repository = new AppartRepository();
        this.userRepo = new UserRepository();
    }

    async getAllApparts() {
        try {
            let apparts = await this.repository.getAllOnlineApparts();
            for (const appart in apparts){
                apparts[appart].specs = `${baseUrl}/apparts/${apparts[appart].id}/specs`;
                apparts[appart].lien = `${baseUrl}/apparts/${apparts[appart].id}`;

            }
            return apparts;
        } catch (error) {
            console.log("Une erreur est survenue lors de la recupération des logements : ", error);
            return "error";
        }
    }

    async getAppartById(appartId) {
        try {
            let appart = await this.repository.getAppartById(appartId);
            if (Object.keys(appart).length) appart.specs = `${baseUrl}/apparts/${appart.id}/specs`;
            return appart;
        } catch (error) {
            console.log("Une erreur est survenue lors de la recupération du logement : ", error);
            return false;
        }
    }

    async createAppart(idOwner, title, address, status, price, area, nb_rooms, max_people, userRank, userId) {
        
        if (typeof title === 'string' && typeof address === 'string') {
            if(!idOwner) idOwner = userId;
            if(userRank === "admin"){
                status = "dispo";
            }else{
                status = "en attente"
                if(idOwner != userId) return "Vous ne pouvez pas créer un appartement au nom d'un autre.";
            }
            if (!isNaN(idOwner) && !isNaN(price) && !isNaN(area) && !isNaN(nb_rooms) && !isNaN(max_people)) {
                
                if (idOwner>0) {
                    let results = await this.repository.createAppart(idOwner, title, address, status, price, area, nb_rooms, max_people);
                    if (!results) {
                        return "Une erreur est survenue lors de la création de l'appartement";
                    }else{
                        if(idOwner != userId && await this.userRepo.getRankById(idOwner) == "user") await this.userRepo.changeRankById("owner", idOwner); 
                        return results;
                    }
                }else{
                    return "Id invalide";
                }
            }else{
                return "Une erreur est survenue lors de la création de l'appartement, certaines variables ont un mauvais type";
            }
        }else{
            return "Une erreur est survenue lors de la création de l'appartement, certaines variables ont un mauvais type";
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
                if (resDb.affectedRows > 0) return {message: "Logement édité", info:{lien: `${baseUrl}/apparts/${appartId}` , method: "GET"}};
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
                        return {message: "Logement validé", info:{lien: `${baseUrl}/apparts/${appartId}` , method: "GET"}};
                    }else{
                        return "Erreur, le rôle du propriétaire n'a pas été modifié";
                    }
                }else{
                    return "Aucun logements n'a été validé";
                }
            }else{
                return "Logement déjà validé";
            }
        }else{
            return "Merci de préciser l'id.";
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
           if (result.length == 0){
                return {
                    message :`L'appartement ${appartId} n'a pas de spécificité.`
                }
           }else{
                return result[0]
           }
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
                const resDb = await this.repository.getDatesOfAppart(appartId);
                console.log(resDb);
                return {appartId: appartId, dates: resDb};
            } else {
                return {error: appartInexistant};
            }
        } catch (error) {
            console.log("Error at PatchSpecByAppart : ", error);
            return false;
        }
    }
}

module.exports = AppartService;