const DatabaseConnection    = require("./Database");
const moment                = require('moment');

class ReservationRepository {
    db;

    constructor() {
        this.db = new DatabaseConnection();
    }

    checkAvailabilityAppart(appartId, endDate, startDate){
        const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
        const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT id FROM reservation WHERE status = 'BOOKED' AND appartId = ? AND ((startDate <= ? AND endDate > ?) OR (startDate > ? AND startDate <= ?) OR (endDate > ? AND endDate <= ?))`, 
[appartId, formattedStartDate, formattedEndDate, formattedStartDate, formattedEndDate, formattedStartDate, formattedEndDate], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
    
    async saveReservation(data){
        const sql = "INSERT INTO reservation (clientId, appartId, startDate, endDate, status) VALUES (?, ?, ?, ?, 'BOOKED')";
        //const formattedStartDate = moment(data.startDate).format('YYYY-MM-DD');
        //const formattedEndDate = moment(data.endDate).format('YYYY-MM-DD');
        return new Promise((resolve, reject) => {
            this.db.query(sql, [data.clientId, data.appartId, data.startDate, data.endDate], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
       ;
    }

    async cancelReservation(idReservation){
        const sql = "UPDATE reservation SET status = 'CANCELED' WHERE id = ?";
        return new Promise((resolve, reject) => {
            this.db.query(sql, [idReservation], (error, result) => {
                if (error) reject(error);
                resolve(result);
            });
        });
       ;
    }

    async getReservationById(idReservation){
        // Formatage des datetime avant de les renvoyer
        const sql = "SELECT id,clientId,appartId,DATE_FORMAT(startDate, '%Y-%m-%d %H:%i:%s') AS startDate," +
        "DATE_FORMAT(endDate, '%Y-%m-%d %H:%i:%s') as endDate,status FROM reservation WHERE id = ?";
        return new Promise((resolve, reject) => {
            this.db.query(sql, [idReservation], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    async editReservation(data) {
        let sqlQuery = "UPDATE reservation set clientId = clientId";
        for (const key in data) if (key !== "resId") sqlQuery+= `, ${key} = ?`;
        sqlQuery += " WHERE id = ?";
        return new Promise((resolve, reject) => {
            this.db.query(sqlQuery, Object.values(data), (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    async getReservationsByAppart(appartId) {
        let sqlQuery = "SELECT id,clientId,appartId,DATE_FORMAT(startDate, '%Y-%m-%d %H:%i:%s') as startDate," +
        "DATE_FORMAT(endDate, '%Y-%m-%d %H:%i:%s') as endDate, status FROM reservation WHERE appartId = ?";
        return new Promise((resolve, reject) => {
            this.db.query(sqlQuery, [appartId], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
}

module.exports = ReservationRepository;