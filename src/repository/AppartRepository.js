const mysql = require("mysql2");
const DatabaseConnection = require("./Database");
const appartModel = require("../model/Appart");

class AppartRepository {
    db;

    constructor() {
        this.db = new DatabaseConnection();
    }

    getAllApparts() {
        return new Promise ((resolve, reject) => {
            this.db.query("SELECT * FROM apparts", (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    getAllOnlineApparts() {
        return new Promise ((resolve, reject) => {
            this.db.query("SELECT * FROM apparts WHERE status = 'dispo'", (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    getAppartById(id) {
        const sqlQuery = "SELECT id,owner,title,address,status,price,area,nb_rooms,max_people," +
        "DATE_FORMAT(startDate, '%Y-%m-%d %H:%i:%s') as startDate, DATE_FORMAT(endDate, '%Y-%m-%d %H:%i:%s') as endDate FROM apparts WHERE id = ?";
        return new Promise((resolve, reject) => {
            this.db.query(sqlQuery, [id], (error, result) => {
                if (error) reject(error);
                resolve(result);
            });
        });
    }

    getAppartsByOwner(ownerId) {
        return new Promise((resolve, reject) => {
            this.db.query("SELECT * FROM apparts WHERE owner = ?", [ownerId], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    async getOwnerByAppart(appartId){
        return new Promise((resolve, reject) => {
            this.db.query("SELECT owner FROM apparts WHERE id = ?", [appartId], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    async createAppart(idOwner, title, address, status, price, area, nb_rooms, max_people) {
        return new Promise ((resolve, reject) => {
            this.db.query("INSERT INTO apparts (owner, title, address, status, price, area, nb_rooms, max_people) VALUES (?,?,?,?,?,?,?,?) RETURNING *", [idOwner,title,address,status,price,area,nb_rooms,max_people], (error, results) => {
                if (error) reject(error);
                console.log(results)
                resolve(results);
            });
        });
    }

    async delAppart(id, idOwner){
        return new Promise ((resolve, reject) => {
            this.db.query("DELETE FROM apparts WHERE id = ? AND owner = ?", [id, idOwner], (error, results) => {
                if(error) reject(error);
                resolve(results);
            })
        })
    }

    async editAppart(appartId, data) {
        let sqlQuery = "UPDATE apparts set ";
        for (const key in data) sqlQuery += `${key} = ? `;
        sqlQuery+= "WHERE id = ?";
        return new Promise ((resolve, reject) => {
            this.db.query(sqlQuery, [Object.values(data), appartId], (error, results) => {
                if(error) reject(error);
                resolve(results);
            })
        })
    }
    
    async getStatusByAppart(appartId){
        return new Promise((resolve, reject) => {
            this.db.query("SELECT status FROM apparts WHERE id = ?", [appartId], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    async searchAppartBy(query){
        let sqlQuery = "SELECT * FROM apparts WHERE 1=1"
        for(let key in query) sqlQuery+= " AND " + key + "=?";
        console.log(sqlQuery);
        return new Promise((resolve, reject) => {
            this.db.query(sqlQuery, [Object.values(query)], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    async getSpecByAppart(appartId){
        const sql = "SELECT * FROM specApparts WHERE appartId = ?";
        return new Promise ((resolve, reject) => {
            this.db.query(sql, [appartId], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    async patchSpecByAppart(appartId, data){
        const keys = Object.keys(data);
        let sqlQuery = "UPDATE specApparts set appartId = appartId ";
        for (const key in keys) sqlQuery += `, ${keys[key]} = ?`;
        sqlQuery+= " WHERE appartId = ?";
        return new Promise((resolve, reject) => {
            this.db.query(sqlQuery, [...Object.values(data), appartId], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    async getReservDatesOfAppart(appartId) {
        const sqlQuery = "SELECT DATE_FORMAT(startDate, '%Y-%m-%d %H:%i:%s') as reservationStart," +
        "DATE_FORMAT(endDate, '%Y-%m-%d %H:%i:%s') as reservationEnd FROM reservation WHERE appartId = ? AND status = 'BOOKED' ORDER BY startDate";
        return new Promise((resolve, reject) => {
            this.db.query(sqlQuery, [appartId], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
}

module.exports = AppartRepository;