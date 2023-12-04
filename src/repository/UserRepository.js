const mysql = require("mysql2");
const DatabaseConnection = require("./Database");

class UserRepository {
    db;

    constructor() {
        this.db = new DatabaseConnection();
    }

    checkLogin(username, password) {
        const sqlQuery = "SELECT username, name, lastname, role, email FROM users" 
            + " WHERE username = ? AND password = ?";
        return new Promise ((resolve, reject) => {
            this.db.query(sqlQuery, [username, password], (error, result) => {
                if (error) reject(error);
                resolve(result);
            });
        });
    }
}

module.exports = UserRepository;