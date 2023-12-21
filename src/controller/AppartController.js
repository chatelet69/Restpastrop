const AppartService     = require("../services/AppartService");
const baseURL           = require("../../config.json").baseUrl;
const forms             = require("../utils/form.json");

class AppartController{
    constructor(){
        this.service = new AppartService();
    }

    async getAllApparts(req, res) {
        try {
            let data = await this.service.getAllApparts();
            if (data) res.status(200).json({count: data.length, apparts: data});
            else res.status(500).json({error: forms.getAppartsError})
        } catch (error) {
            console.log(error);
            res.status(500).json({error: forms.getAppartsError});
        }
    }

    async getAppart(req, res) {
        try {
            const data = await this.service.getAppartById(req.params.id);
            if (!data.error) res.status(200).json(data);
            else res.status(404).json({error: forms.getAppartError});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: forms.getAppartError});
        }
    }

    async postAppart(req, res){
        try {
            const title = req.body.title;
            const owner = req.body.owner;
            const address = req.body.address;
            const status = req.body.status;
            const price = req.body.price;
            const area = req.body.area;
            const nb_rooms = req.body.nb_rooms;
            const max_people = req.body.max_people;
            const startDate = req.body.startDate;
            const endDate = req.body.endDate;
            const userRank = req.user.rank;
            const userId = req.user.userId;

            let result = await this.service.createAppart(owner, title, address, status, price, area, nb_rooms, max_people, userRank, userId, startDate, endDate);
            if (result[0].id) res.status(201).json({message: "success", info: {link: `${baseURL}/apparts/${result[0].id}`,method: "GET"}});
            else res.status(400).json({error: "Une erreur est survenue lors de la création de l'appartement"});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Erreur durant la création du logement"});
        }
    }
    
    async deleteAppart(req, res){
        try {
            const appartId = req.params.id;
            const check = await this.service.getAppartById(appartId);
            if (check) {
                let result = await this.service.deleteAppart(req, res);
                if (result === "ok") {
                    res.status(200).json({message: "Logement supprimé"});
                } else {
                    res.status(403).json({error: result});
                }
            } else {
                res.status(403).json({error: forms.appartInexistant});
            }
        } catch (error) {
            console.log("Erreur deleteAppart : ", error);
            res.status(500).json({error: `Une erreur est survenue lors de la suppression du logement ${req.params.id}`});
        }
    }

    async editAppart(req, res) {
        try {
            const userId = req.user.userId;
            const appartId = req.params.id;
            const data = req.body;
            const isAdmin = req.user.isAdmin;
            let resEdit = await this.service.editAppart(userId, appartId, data, isAdmin);
            if(resEdit=="Permission refusée"){
                res.status(403).json({error: resEdit})
            }else if(resEdit){
                res.status(200).json({message: resEdit})
            }else res.status(400).json({message: "Une erreur est survenue durant la requête"});
        } catch (error) {
            console.log("Erreur editAppart : ", error);
            res.status(500).json({error: forms.editAppartError});
        }
    }
    
    async validAppart(req, res) {
        try {
            const appartId = req.params.id;
            let resValid = await this.service.validAppart(appartId);
            if (resValid) res.status(200).json({resValid});
            else res.status(400).json({error: "Vous ne pouvez pas valider ce logement."});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: `Une erreur est survenue durant la validation du logement ${req.params.id}`});
        }
    }

    async searchAppartBy(req, res){
        try {
            let query = req.query;
            if (Object.keys(query).length) {
                let apparts = await this.service.searchAppartBy(query);
                if (apparts) {
                    res.status(200).json(apparts);
                }else{
                    res.status(400).json({error: forms.getAppartsError})
                }
            }else{
                res.status(400).json({message: "Paramètres manquants"});
            }
        } catch (error) {
            console.log("Erreur searchAppartBy : ", error);
            res.status(500).json({error: forms.getAppartsError});
        }
    }

    async getSpecByAppart(req, res){
        try {
            const appartId = req.params.id;
            let data = await this.service.getSpecByAppart(appartId);
            res.status((data.error) ? 404 : 200).json(data);
        } catch (error) {
            console.log("Erreur getSpecByAppart : ", error);
            res.status(500).json({error: `Erreur durant la récupération des spécificités`});
        }
    }

    async patchSpecByAppart(req, res){
        try {
            const data = req.body;
            const appartId = req.params.id;
            const isAdmin = req.user.isAdmin;
            const userId = req.user.userId;
            let result = await this.service.patchSpecByAppart(appartId, data, isAdmin, userId );
            res.status(200).json(result);
        } catch (error) {
            console.log("Erreur controleur patchSpecsByAppart : ", error);
            res.status(500).json({error: `Erreur durant la modification des spécificités`});
        }
    }

    async getDatesOfAppart(req, res) {
        try {
            const appartId = req.params.id;
            let result = await this.service.getDatesOfAppart(appartId);
            if (result) res.status(200).json(result);
            else res.status(500).json({error: forms.getDatesAppartError});
        } catch (error) {
            console.log("Erreur controleur getDatesOfAppart : ", error);
            res.status(500).json({error: forms.getDatesAppartError});
        }
    }

    async getAppartReservations(req, res) {
        try {
            const appartId = req.params.id;
            const userId = req.user.userId;
            const isAdmin = req.user.isAdmin;
            let result = await this.service.getAppartReservations(appartId, userId, isAdmin);
            if (result) res.status(200).json(result);
            else res.status(500).json({error: forms.getReservationError});
        } catch (error) {
            console.log("Erreur controleur getAppartReservations : ", error);
            res.status(500).json({error: forms.getReservationError});
        }
    }
}

module.exports = AppartController;