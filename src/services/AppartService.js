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
    async deleteAppart(id, res){
        if (!isNaN(id)) {
            if (id>0) {
                let results = await appartRepo.delAppart(id);
                if (!results) {
                    res.status(500).json({error: "Error during delete appartments"});
                }else{
                    return "ok";
                }
            }else{
                return "Wrong ID under 0";
            }
        }else{
            return "ID is not a number";
        }
    }
}

module.exports = AppartService;