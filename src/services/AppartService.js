const Appart = require("../model/Appart");
const AppartRepository = require("../repository/AppartRepository");
const appartRepo = new AppartRepository();


class AppartService {
    constructor(){
        this.repository= new AppartRepository;
    }

    async createAppart(req, res){
        if (typeof req.title === 'string' && typeof req.address === 'string') {
            if (!isNaN(req.owner) && !isNaN(req.status) && !isNaN(req.price) && !isNaN(req.area) && !isNaN(req.nb_rooms) && !isNaN(req.max_people)) {
                if (req.owner>0) {
                    let results = await appartRepo.createAppart(req, res);
                    if (!results) {
                        res.status(500).json({error: "Error during creating appartments"});
                    }else{
                        return "ok";
                    }
                }else{
                    res.status(500).json({error: "Invalid id for the owner"});
                }
            }else{
                res.status(500).json({error: "Error during creating appartments, number variables are actually strings"});
            }
        }else{
            res.status(500).json({error: "Error during creating appartments, string variables are actually numbers"});
        }
    }

}

module.exports = AppartService;