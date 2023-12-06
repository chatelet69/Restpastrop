const AppartService     = require("../services/AppartService");

class AppartController{
    constructor(){
        this.service = new AppartService;
    }

    async postAppart(req, res){
        try {
            const body = req.body;
            let result = await this.service.createAppart(body, res);
            if (result === "ok") {
                res.status(200);
                res.json({message: "success"});
            }else{
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
            }else{
                res.status(500).json({error: result});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error: `Error during the delete of the appartment ${req.params.id}`});
        }
    }
}

module.exports = AppartController;