const User              = require("../model/User");
const UserRepository    = require("../repository/UserRepository");
const sha512            = require('js-sha512');
const jwt               = require("jsonwebtoken");
const secret            = require("../../config.json").secretJwt;

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }
  
    async authLoginService(username, password) {
        try {
            let authToken = false;
            const hash = sha512(password);
            const checkLogin = await this.userRepository.checkLogin(username, hash);
            if (checkLogin) {
                authToken = jwt.sign({data: username, role: checkLogin.rank, userId: checkLogin.id}, secret, { expiresIn: "1h" });
                let check = await this.userRepository.setNewKey(checkLogin.id, authToken);
                if (check.affectedRows == 0) authToken = false;
            }
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
}

module.exports = UserService;