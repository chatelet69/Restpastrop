const UserService = require("../services/UserService");

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    authLogin(req, res) {
        try {
            const body = req.body;
            let resLogin = this.userService.authLoginService(body.username, body.password);
            res.status(200).json({message: "success", jwt: "e"});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Error during login"});
        }
    }
}

module.exports = UserController;