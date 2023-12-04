const mysql = require("mysql2");
const DatabaseConnection = require("./Database");

class UserRepository {
    db;

    constructor() {
        this.db = new DatabaseConnection();
    }
  
    getUserById(userId) {
        const sqlQuery = "SELECT username, name, lastname, rank, email FROM users WHERE id = ?";
        return new Promise((resolve, reject) => {
            this.db.query(sqlQuery, [userId], (error, result) => {
                if (error) throw error;
                resolve(result[0]);
            });
        });
    }

    checkLogin(username, password) {
        const sqlQuery = "SELECT id, username, name, lastname, rank, email FROM users" 
            + " WHERE username = ? AND password = ?";
        return new Promise ((resolve, reject) => {
            this.db.query(sqlQuery, [username, password], (error, result) => {
                if (error) throw (error);
                resolve(result[0]);
            });
        });
    }

    setNewKey(userId, jwt) {
        const sqlQuery = "UPDATE users set jwt = ? WHERE id = ?";
        return new Promise ((resolve, reject) => {
            this.db.query(sqlQuery, [jwt, userId], (error, result) => {
                if (error) throw (error);
                resolve(result);
            });
        });
    }
}

module.exports = UserRepository;