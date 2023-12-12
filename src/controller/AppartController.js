const AppartService = require("../services/AppartService");
const baseURL = require("../../config.json").baseUrl

class AppartController{
    constructor(){
        this.service = new AppartService();
    }

    async getAllApparts(req, res) {
        try {
            let data = await this.service.getAllApparts();
            res.status(200).json({count: data.length, apparts: data});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Erreur durant la récupération des logements"});
        }
    }

    async getAppart(req, res) {
        try {
            let data = await this.service.getAppartById(req.params.id);
            if (data) res.status(200).json(data);
            else res.status(500).json({error: "Erreur durant la récupération du logement"});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: `Erreur durant la récupération du logement ${req.params.id}`});
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

            const userRank = req.user.rank;
            const userId = req.user.userId;

            let result = await this.service.createAppart(owner, title, address, status, price, area, nb_rooms, max_people, userRank, userId);
            if (result) res.status(200).json({message: "success", info: {lien: `${baseURL}/apparts/${result[0].id}`,method: "GET"}});
            else res.status(500).json({error: result});
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
            }else{
                res.status(403).json({error: "Ce logement n'existe pas."});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error: `Une erreur est survenue lors de la suppression du logement ${req.params.id}`});
        }
    }

    async editAppart(req, res) {
        try {
            const userId = req.user.userId;
            const appartId = req.params.id;
            const data = req.body;
            const isAdmin = (req.user.rank === "admin") ? true : false;
            let resEdit = await this.service.editAppart(userId, appartId, data, isAdmin);
            if (resEdit) res.status(200).json({message: resEdit});
            else res.status(400).json({message: "Une erreur est survenue durant la requête"});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: `Une erreur est survenue durant la modification du logement${req.params.id}`});
        }
    }
    
    async validAppart(req, res) {
        try {
            const appartId = req.params.id;
            let resValid = await this.service.validAppart(appartId);
            if (resValid == "ok") res.status(200).json({message: "Logement validé !"});
            else res.status(400).json({message: resValid});
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
                    res.status(400).json({message: "Erreur durant la récupération des logements"})
                }
            }else{
                res.status(400).json({message: "Paramètres manquants"});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Erreur durant la recherche d'un appartement."});
        }
    }

    async getSpecByAppart(req, res){
        try {
            const appartId = req.params.id;
            let data = await this.service.getSpecByAppart(appartId);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(500).json({error: `Erreur durant la récupération des spécificités`});
        }
    }

    async patchSpecByAppart(req, res){
        try {
            const data = req.body;
            const appartId = req.params.id;
            const isAdmin = req.user.isAdmin
            const userId = req.user.userId
            console.log(data)
            let result = await this.service.patchSpecByAppart(appartId, data, isAdmin, userId );
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({error: `Erreur durant la modification des spécificités`});
        }
    }
}

module.exports = AppartController;