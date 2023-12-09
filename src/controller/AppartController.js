const AppartService = require("../services/AppartService");

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
            res.status(500).json({error: "Erreur durant la récupération des appartements"});
        }
    }

    async getAppart(req, res) {
        try {
            let data = await this.service.getAppartById(req.params.id);
            if (data) res.status(200).json(data);
            else res.status(500).json({error: "Erreur durant la récupération de l'appartement"});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: `Erreur durant la récupération de l'appart ${req.params.id}`});
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
            if (result === "ok") res.status(200).json({message: "success"});
            else res.status(500).json({error: result});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Erreur durant la création de l'appartement"});
        }
    }
    
    async deleteAppart(req, res){
        try {
            const appartId = req.params.id;
            const check = await this.service.getAppartById(appartId);
            if (check) {
                let result = await this.service.deleteAppart(req, res);
                if (result === "ok") {
                    res.status(200).json({message: "Appartement supprimé"});
                } else {
                    res.status(403).json({error: result});
                }
            }else{
                res.status(403).json({error: "Cet appartement n'existe pas."});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error: `Une erreur est survenue lors de la suppressio de l'appartement ${req.params.id}`});
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
            else res.status(400).json({message: "Error during request"});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: `Error during the patch of the appartment ${req.params.id}`});
        }
    }
    
    async validAppart(req, res) {
        try {
            const appartId = req.params.id;
            let resValid = await this.service.validAppart(appartId);
            if (resValid) res.status(200).json({message: resValid});
            else res.status(400).json({message: "Error during request"});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: `Error during the patch of the appartment ${req.params.id}`});
        }
    }
}

module.exports = AppartController;