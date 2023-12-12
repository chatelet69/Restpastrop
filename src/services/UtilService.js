const moment = require("moment");

class UtilService {
    checkDatesPast(startDate, endDate) {
        if (startDate) {    
            if (moment(startDate).isBefore(moment())) return {message: "La date de début est dans le passé"};
        }
        if (endDate) {
            if (moment(endDate).isBefore(moment())) return {message: "La date de fin est dans le passé"};
        }

        if (endDate && startDate) {    
            if (moment(endDate).isBefore(startDate)) return {message: "La date de fin est avant la date de début"};
        }

        return "ok";
    }

    checkKeysInData(data, required, authorized) {
        if (!data) return false;

        if (required !== null) {
            for (let key in required)
                if (!Object.hasOwn(data, required[key])) return false;
        }
        for (let key in data)
            if (!authorized.includes(key)) return false;
        return true;
    }
}

module.exports = UtilService;