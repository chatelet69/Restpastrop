const User              = require("../model/User");
const UserRepository  = require("../repository/UserRepository");

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    authLoginService(username, password) {
        try {
            const checkLogin = this.userRepository.checkLogin(username, password);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = UserService;