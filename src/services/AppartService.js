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
    async deleteAppart(req, res){
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
}

module.exports = AppartService;