const UserService = require("../services/UserService");

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    async authLogin(req, res) {
        try {
            const body = req.body;
            const resLogin = await this.userService.authLoginService(body.username, body.password);
            if (resLogin) res.status(200).json({message: "success", jwt: resLogin});
            else res.status(403).json({message: "error"});
        } catch (error) {
            res.status(500).json({error: "Error during login"});
        }
    }

    async myUser(req, res) {
        try {
            const userId = req.user.userId;
            const userData = await this.userService.myUserService(userId);
            res.status(200).json({message: "logged", user: userData});
        } catch (error) {
            res.status(500).json({error: "Error during get my user"});
        }
    }
}

module.exports = UserController;