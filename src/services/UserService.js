const User              = require("../model/User");
const UserRepository    = require("../repository/UserRepository");
const sha512            = require('js-sha512');
const jwt               = require("jsonwebtoken");
const secret            = require("../../config.json").secretJwt;
const baseUrl           = require("../../config.json").baseUrl;

class UserService {
    userRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }
  
    async authLoginService(username, password) {
        try {
            let authToken = false;
            const hash = sha512(password);
            const checkLogin = await this.userRepository.checkLogin(username, hash);
            if (checkLogin) authToken = this.generateKey(checkLogin.id, username, checkLogin.rank);
            return (authToken) ? authToken : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async myUserService(userId) {
        try {
            let userData = false;
            if (userId != 0) userData = await this.userRepository.getUserById(userId);
            return userData;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async getAllUsersService() {
        try {
            let usersData = false;
            usersData = await this.userRepository.getAllUsers();
            for (const user in usersData) usersData[user].infos = `${baseUrl}/users/${usersData[user].id}`;
            return usersData;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async getUserService(userId) {
        try {
            let userData = false;
            userData = await this.userRepository.getUserById(userId);
            if (userData) return userData;
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async registerService(registerData) {
        try {
            let returnVal = false;
            const required = ["username", "password", "email", "name", "lastname"];
            for (let key in required)
                if (!Object.hasOwn(registerData, required[key])) return false;
            registerData.password = sha512(registerData.password);
            const finalValues = [registerData.username, registerData.password, registerData.name, registerData.lastname, registerData.email];
            const resDb = await this.userRepository.createUser(finalValues);
            if (resDb.affectedRows) returnVal = this.generateKey(resDb.insertId, registerData.username, "user");
            return returnVal;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async search(data) {
        try {
            let returnVal = false;
            const resDb = await this.userRepository.search(data);
            if (resDb) {
                returnVal = resDb;
                for (const user in returnVal) returnVal[user].infos = `${baseUrl}/users/${returnVal[user].id}`;
            }
            return returnVal;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deleteUserById(userId) {
        try {
            const resDb = await this.userRepository.deleteUserById(userId);
            if (resDb.affectedRows) return true;
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async generateKey(userId, username, rank) {
        let token = jwt.sign({data: username, rank: rank, userId: userId}, secret, { expiresIn: "48h" });
        let check = await this.userRepository.setNewKey(userId, token);
        if (check.affectedRows == 0) return false;
        return token;
    }

    async patchUserById(idUser, req){
        try {
            let bodySize = Object.keys(req.body).length;
            if (bodySize) {
                let authorized = ["username", "email", "name", "lastname", "password", "rank"];
                for(let x = 0 ; x < bodySize ; x++){
                    for (let y = 0; y < authorized.length; y++){
                        if(!Object.hasOwn(req.body, authorized[y])){ return "Mauvais paramètres."}else{break;};
                    }                        
                }
                    if (req.user.rank === "admin" || req.user.userId === idUser) {
                        let patchInfos = [];
                        let z = 0;
                        for(let x = 0; x<authorized.length; x++){ // algo qui met les données dans l'odre pour le repo
                            for(let y = 0; y < bodySize ; y++){
                              if(Object.keys(req.body)[y] === authorized[x]){
                                patchInfos[z] = Object.values(req.body)[y];
                                z++;
                                break;
                              }
                            }
                        }
                        console.log(patchInfos);
                        const resDb = await this.userRepository.patchUserById(idUser, req.body);
                        if (resDb.affectedRows) {
                            return "ok"                    
                        }else{
                            return "aucune ligne n'a été modifiée"
                        }
                }
            }else{
                return "le body est vide";
            }
        } catch (error) {
            console.log(error);
            return "Une erreur est survenue durant la modification de l'utilisateur.";
        }
    }
}

module.exports = UserService;