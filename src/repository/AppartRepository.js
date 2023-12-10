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

    getAppartById(id) {
        return new Promise((resolve, reject) => {
            this.db.query("SELECT * FROM apparts WHERE id = ?", [id], (error, result) => {
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
            this.db.query("INSERT INTO apparts (owner, title, address, status, price, area, nb_rooms, max_people) VALUES (?,?,?,?,?,?,?,?)", [idOwner,title,address,status,price,area,nb_rooms,max_people], (error, results) => {
                if (error) reject(error);
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
        const sql = "select * from specApparts where idAppart = ?";
        return new Promise ((resolve, reject) => {
            this.db.query(sql, [appartId], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    async patchSpecByAppart(appartId, data){
        const keys = Object.keys(data);
        let sqlQuery = "UPDATE specApparts set "
        console.log(keys);
        for(let i = 0;  i < keys.length; i++){
            sqlQuery+= keys[i] + "=?";
            if (i != keys.length-1){
                sqlQuery+= ", "
            }
        }
        sqlQuery+= " WHERE idAppart = ?"
        console.log(sqlQuery);
        return new Promise((resolve, reject) => {
            this.db.query(sqlQuery, [...Object.values(data), appartId], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
}

module.exports = AppartRepository;