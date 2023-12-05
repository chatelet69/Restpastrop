const User              = require("../model/User");
const UserRepository    = require("../repository/UserRepository");
const sha512            = require('js-sha512');
const jwt               = require("jsonwebtoken");
const secret            = require("../../config.json").secretJwt;

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

    async registerService(registerData) {
        try {
            let ret = false;
            const required = ["username", "password", "email", "name", "lastname"];
            for (let key in required)
                if (!Object.hasOwn(registerData, required[key])) return false;
            registerData.password = sha512(registerData.password);
            const finalValues = [registerData.username, registerData.password, registerData.name, registerData.lastname, registerData.email];
            const resDb = await this.userRepository.createUser(finalValues);
            if (resDb.affectedRows) ret = this.generateKey(resDb.insertId, registerData.username, "user");
            return ret;
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
}

module.exports = UserService;