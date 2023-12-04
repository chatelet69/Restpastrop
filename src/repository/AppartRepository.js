const mysql = require("mysql2");
const DatabaseConnection = require("./Database");

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

    createAppart(req, res) {
        return new Promise ((resolve, reject) => {
            this.db.query("INSERT INTO apparts (title)", (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
}

module.exports = AppartRepository;