const Appart            = require("../model/Appart");
const AppartRepository  = require("../repository/AppartRepository");
const baseUrl           = require("../../config.json").baseUrl;

class AppartService {
    repository;

    constructor(){
        this.repository = new AppartRepository();
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

    async createAppart(req, res) {
        if (typeof req.title === 'string' && typeof req.address === 'string') {
            if (!isNaN(req.owner) && !isNaN(req.status) && !isNaN(req.price) && !isNaN(req.area) && !isNaN(req.nb_rooms) && !isNaN(req.max_people)) {
                if (req.owner>0) {
                    let results = await appartRepo.createAppart(req);
                    if (!results) {
                        res.status(500).json({error: "Error during creating appartments"});
                    }else{
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
                    let idOwner = await appartRepo.getOwnerByAppart(req.params.id);
                    console.log("rank : " + req.user.rank + ", id : " + req.user.userId + ", owner id : " + idOwner[0]['owner']);
                    if (idOwner[0]['owner'] === req.user.userId) {
                        let results = await appartRepo.delAppart(req.params.id, idOwner[0]['owner']);
                        if (!results) {
                            res.status(500).json({error: "Error during delete appartments"});
                        }else{
                            return "ok";
                        }
                    }else{
                        return "You are not the owner of this appartment.";
                    }
                }else if (req.user.rank === "admin") {
                    let idOwner = await appartRepo.getOwnerByAppart(req.params.id);
                        let results = await appartRepo.delAppart(req.params.id, idOwner[0]['owner']);
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
}

module.exports = AppartService;