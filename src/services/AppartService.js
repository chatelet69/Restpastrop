const Appart            = require("../model/Appart");
const AppartRepository  = require("../repository/AppartRepository");
const baseUrl           = require("../../config.json").baseUrl;
const UserRepository    = require("../repository/UserRepository");


class AppartService {
    repository;
    userRepo;

    constructor(){
        this.repository = new AppartRepository();
        this.userRepo = new UserRepository();
    }

    async getAllApparts() {
        try {
            let apparts = await this.repository.getAllApparts();
            for (const appart in apparts) apparts[appart].specs = `${baseUrl}/apparts/${apparts[appart].id}/specs`;
            return apparts;
        } catch (error) {
            console.log("Error at AppartService : ", error);
            return "error";
        }
    }

    async getAppartById(appartId) {
        try {
            let appart = await this.repository.getAppartById(appartId);
            if (Object.keys(appart).length) appart.specs = `${baseUrl}/apparts/${appart.id}/specs`;
            return appart;
        } catch (error) {
            console.log("Error at AppartService : ", error);
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
                        return "Error during creating appartments";
                    }else{
                        if(idOwner != userId && await this.userRepo.getRankById(idOwner) == "user") await this.userRepo.changeRankById("owner", idOwner); 
                        return "ok";
                    }
                }else{
                    return "Invalid id for the owner";
                }
            }else{
                return "Error during creating appartments, number variables are actually strings";
            }
        }else{
            return "Error during creating appartments, string variables are actually numbers";
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
                            res.status(500).json({error: "Error during delete appartments"});
                        }else{
                            return "ok";
                        }
                    }else{
                        return "You are not the owner of this appartment.";
                    }
                }else if (req.user.rank === "admin") {
                    let idOwner = await this.repository.getOwnerByAppart(req.params.id);
                        let results = await this.repository.delAppart(req.params.id, idOwner[0]['owner']);
                        if (!results) {
                            res.status(500).json({error: "Error during delete appartments"});
                        }else{
                            return "ok";
                        }
                }else{
                    return "Wrong rank";
                }
            }else{
                return "Wrong ID under 0";
            }
        }else{
            return "ID is not a number";
        }
    }

    async editAppart(userId, appartId, newData, isAdmin) {
        try {
            const appart = await this.repository.getAppartById(appartId);
            if (appart !== undefined && Object.keys(appart).length) {
                if (appart.owner != userId && !isAdmin) return "Permission refusée";
                const resDb = await this.repository.editAppart(appartId, newData);
                if (resDb.affectedRows > 0) return "Appartement édité";
            }
            return "Appartement inexistant";
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
                        return "Logement validé !";
                    }else{
                        return "Erreur, le rôle du propriétaire n'a pas été modifié";
                    }
                }else{
                    return "Aucun appartement n'a été validé";
                }
            }else{
                return "Logement déjà validé";
            }
        }else{
            return "Merci de préciser l'id.";
        }
    }
}

module.exports = AppartService;