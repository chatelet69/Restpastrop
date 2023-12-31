const DatabaseConnection    = require("./Database");
const userKeys              = require("../utils/form.json").usersKeysDb;
const defaultKeyUser        = require("../utils/form.json").defaultKeyUser;

class UserRepository {
    db;

    constructor() {
        this.db = new DatabaseConnection();
    }
  
    getUserById(userId) {
        const sqlQuery = "SELECT id, username, name, lastname, rank, email FROM users WHERE id = ?";
        return new Promise((resolve, reject) => {
            this.db.query(sqlQuery, [userId], (error, result) => {
                if (error) throw error;
                resolve(result[0]);
            });
        });
    }

    getUserByUsername(username) {
        const sqlQuery = "SELECT id, username FROM users WHERE username = ?";
        return new Promise((resolve, reject) => {
            this.db.query(sqlQuery, [username], (error, result) => {
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

    getAllUsers() {
        const sqlQuery = "SELECT id, username FROM users";
        return new Promise ((resolve, reject) => {
            this.db.query(sqlQuery, (error, result) => {
                if (error) throw (error);
                resolve(result);
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

    createUser(userData) {
        const sqlQuery = `INSERT INTO users (${userKeys}) VALUES (?,?,?,?,?,?)`;
        for (const key in userKeys) if (userData[userKeys[key]] === undefined) userData[userKeys[key]] = defaultKeyUser[userKeys[key]];
        return new Promise((resolve, reject) => {
            this.db.execute(sqlQuery, Object.values(userData), (error, result) => {
                if (error) throw (error);
                resolve(result);
            })
        });
    }

    search(dataSearch) {
        let sqlQuery = "SELECT id,username FROM users WHERE 1 = 1";
        for (const key in dataSearch) sqlQuery += ` AND ${key} = ?`;
        return new Promise((resolve, reject) => {
            this.db.execute(sqlQuery, Object.values(dataSearch), (error, result) => {
                if (error) throw (error);
                resolve(result);
            })
        });
    }

    deleteUserById(userId) {
        const sqlQuery = "DELETE FROM users WHERE id = ?";
        return new Promise((resolve, reject) => {
            this.db.query(sqlQuery, [userId], (error, result) => {
                if (error) throw (error);
                resolve(result);
            })
        });
    }

    async patchUserById(userId, data){
        let sqlQuery = "UPDATE users SET id = id";
        for (const key in data) sqlQuery += `, ${key} = ?`;
        sqlQuery+=" WHERE id = ?";
        return new Promise((resolve, reject) => {
            // Combine le tableau de valeurs avec le userId
            let test = this.db.query(sqlQuery, [...Object.values(data), userId], (error, result) => {
                if (error) reject(error);
                resolve(result);
            })
        });
    }

    async getRankById(id){
        let sqlQuery = "SELECT rank FROM users WHERE id = ?";
        return new Promise((resolve, reject) => {
            this.db.query(sqlQuery, id, (error, result) => {
                if (error) reject(error);
                resolve(result[0]['rank']);
            })
        });
    }

    async changeRankById(rank, id){
        let sqlQuery = "UPDATE users SET rank = ? WHERE id = ?";
        return new Promise((resolve, reject) => {
            this.db.query(sqlQuery, [rank, id], (error, result) => {
                if (error) reject(error);
                resolve(result);
            })
        });
    }
}

module.exports = UserRepository;