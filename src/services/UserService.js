const User              = require("../model/User");
const UserRepository    = require("../repository/UserRepository");
const sha512            = require('js-sha512');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    authLoginService(username, password) {
        try {
            const hash = sha512(password);
            const checkLogin = this.userRepository.checkLogin(username, hash);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = UserService;