const DatabaseConnection    = require("./Database");
const moment                = require('moment');

class ReservationRepository {
    db;

    constructor() {
        this.db = new DatabaseConnection();
    }

    checkAvailabilityAppart(appartId, endDate, startDate){
        const formattedStartDate = moment(startDate).format('YYYY-MM-DD HH:mm:ss');
        const formattedEndDate = moment(endDate).format('YYYY-MM-DD HH:mm:ss');
        return new Promise((resolve, reject) => {
            this.db.query(`select id from reservation where appartId = ? and ((startDate <= ? and endDate > ?) or (startDate > ? and startDate <= ?) or (endDate > ? and endDate <= ?))`, 
[appartId, formattedStartDate, formattedEndDate, formattedStartDate, formattedEndDate, formattedStartDate, formattedEndDate], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
    
    async saveReservation(data){
        const sql = "INSERT INTO reservation (clientId, appartId, startDate, endDate, status) VALUES (?, ?, ?, ?, ?)";
        const formattedStartDate = moment(data.startDate).format('YYYY-MM-DD HH:mm:ss');
        const formattedEndDate = moment(data.endDate).format('YYYY-MM-DD HH:mm:ss');
        return new Promise((resolve, reject) => {
            this.db.query(sql, [data.clientId, data.idAppart, formattedStartDate, formattedEndDate, data.status], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
       ;
    }

    async cancelReservation(idReservation){
        const sql = "UPDATE reservation set status = 'CANCELED' WHERE id = ?";
        return new Promise((resolve, reject) => {
            this.db.query(sql, [idReservation], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
       ;
    }

    async getReservationById(idReservation){
        const sql = "select * FROM reservation WHERE ID = ?";
        return new Promise((resolve, reject) => {
            this.db.query(sql, [idReservation], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
}

module.exports = ReservationRepository;