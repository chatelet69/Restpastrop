const User                  = require("../model/User");
const UserRepository        = require("../repository/UserRepository");
const sha512                = require('js-sha512');
const jwt                   = require("jsonwebtoken");
const secret                = require("../../config.json").secretJwt;
const baseUrl               = require("../../config.json").baseUrl;
const form                  = require("../utils/form.json");
const UtilService           = require("./UtilService");
const utilService           = new UtilService();

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
            return {error: form.userNotFound};
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async registerService(registerData) {
        try {
            let returnVal = false;
            if (utilService.checkKeysInData(registerData, form.requiredRegisterKeys, form.requiredRegisterKeys)) {
                const checkUser = await this.userRepository.getUserByUsername(registerData.username);
                if (checkUser && checkUser.id) return {error: "Utilisateur existant"};
                registerData.password = sha512(registerData.password);
                registerData.rank = "user";
                const resDb = await this.userRepository.createUser(registerData);
                if (resDb.affectedRows) returnVal = this.generateKey(resDb.insertId, registerData.username, "user");
            }
            return returnVal;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async createUser(userData) {
        try {
            const required = ["username", "password"];
            if (utilService.checkKeysInData(userData, required, form.authorizedKeysUser)) {
                userData.password = sha512(userData.password);
                const resDb = await this.userRepository.createUser(userData);
                if (resDb.affectedRows) return {message: "Utilisateur créé"};
                else return false;
            } else {
                return {error: form.missingOrBadData};
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async search(data) {
        try {
            let returnVal = false;
            if (this.checkKeysInData(data, null, form.authorizedKeysSearchUser)) {
                const resDb = await this.userRepository.search(data);
                if (resDb) {
                    returnVal = resDb;
                    for (const user in returnVal) returnVal[user].infos = `${baseUrl}/users/${returnVal[user].id}`;
                }
            }
            return (returnVal.length) ? returnVal : {message: form.userNotFound};
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

    async patchUserById(userId, data){
        try {
            let bodySize = Object.keys(data.body).length;
            if (bodySize) {
                let authorized = ["username", "email", "name", "lastname", "password", "rank"];
                for (const key in data.body)
                    if (!authorized.includes(key)) return form.missingOrBadData;

                if (data.isAdmin || data.userIdReq == userId) {
                    if (data.body.password) data.body.password = sha512(data.body.password);
                    const resDb = await this.userRepository.patchUserById(userId, data.body);
                    return (resDb.affectedRows) ? 
                    {link:`${baseUrl}/users/${data.userId}`, method: "GET"} : "Modification impossible";
                } else {
                    return {error: "Vous n'êtes pas habilité à faire cette action"};
                }
            } else {
                return {error: form.missingOrBadData};
            }
        } catch (error) {
            console.log(error);
            return "Une erreur est survenue durant la modification de l'utilisateur.";
        }
    }

    checkKeysInData(data, required, authorized) {
        for (let key in required)
            if (!Object.hasOwn(data, required[key])) return false;
        for (let key in data)
            if (!authorized.includes(key)) return false;
        return true;
    }
}

module.exports = UserService;