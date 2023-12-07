const DatabaseConnection = require("./Database");

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
        const sqlQuery = "INSERT INTO users (username, password, name, lastname, email, rank) VALUES (?,?,?,?,?, 'user')";
        return new Promise((resolve, reject) => {
            this.db.query(sqlQuery, userData, (error, result) => {
                if (error) throw (error);
                resolve(result);
            })
        });
    }

    search(dataSearch) {
        let sqlQuery = "SELECT id,username FROM users WHERE 1 = 1";
        for (const key in dataSearch) sqlQuery += ` AND ${key} = ?`;
        return new Promise((resolve, reject) => {
            this.db.query(sqlQuery, Object.values(dataSearch), (error, result) => {
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

    async patchUserById(userId, body, values){
        let sqlQuery = "UPDATE users SET id = ?";
        if(body.username) sqlQuery+=", username = ?";
        if(body.email) sqlQuery+=", email = ?";
        if(body.name) sqlQuery+=", name = ?";
        if(body.lastname) sqlQuery+=", lastname = ?";
        if(body.password) sqlQuery+=", password = ?";
        if(body.rank) sqlQuery+=", rank = ?";
        
        sqlQuery+=" WHERE id = ?";
        return new Promise((resolve, reject) => {
            this.db.query(sqlQuery, values, (error, result) => {
                if (error) reject(error);
                resolve(result);
            })
        });
    }
}

module.exports = UserRepository;