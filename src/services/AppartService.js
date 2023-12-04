const Appart = require("../model/Appart");
const AppartRepository = require("../repository/AppartRepository");


class AppartService {
    repository;
    constructor(){
        this.repository= new AppartRepository;
    }
}

module.exports = AppartService;