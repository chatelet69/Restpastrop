const mysql = require("mysql2");
const DatabaseConnection = require("./Database");
const appartModel= require("../model/Appart");

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

    async createAppart(req) {
        return new Promise ((resolve, reject) => {
            this.db.query("INSERT INTO apparts (owner, title, address, status, price, area, nb_rooms, max_people) VALUES (?,?,?,?,?,?,?,?)", [req.owner,req.title,req.address,req.status,req.price,req.area,req.nb_rooms,req.max_people], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    async delAppart(id){
        return new Promise ((resolve, reject) => {
            this.db.query("DELETE FROM apparts WHERE id = ?", [id], (error, results) => {
                if(error) reject(error);
                resolve(results);
            })
        })
    }
}

module.exports = AppartRepository;