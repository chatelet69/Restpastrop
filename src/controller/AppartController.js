const AppartService     = require("../services/AppartService");

class AppartController{
    constructor(){
        this.service = new AppartService;
    }

    async postAppart(req, res){
        try {
            const body = req.body;
            console.log(body);
            let result = await this.service.createAppart(body, res);
            if (result) {
                res.status(200);
                res.json({message: "success", jwt: "A CHANGER"});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Error during creating appartments"});
        }
    }       
}

module.exports = AppartController;