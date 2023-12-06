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
            res.status(500).json({error: "Error during get appartments"});
        }
    }

    async getAppart(req, res) {
        try {
            let data = await this.service.getAppartById(req.params.id);
            if (data) res.status(200).json(data);
            else res.status(500).json({message: "error"});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: `Error during get appart ${req.params.id}`});
        }
    }

    async postAppart(req, res){
        try {
            const body = req.body;
            let result = await this.service.createAppart(body, res);
            if (result === "ok") {
                res.status(200);
                res.json({message: "success"});
            } else {
                res.status(500).json({error: result});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Error during creating appartments"});
        }
    }
    
    async deleteAppart(req, res){
        try {
            let result = await this.service.deleteAppart(req, res);
            if (result === "ok") {
                res.status(200).json({message: "Appartment deleted"});
            } else {
                res.status(500).json({error: result});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error: `Error during the delete of the appartment ${req.params.id}`});
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
}

module.exports = AppartController;