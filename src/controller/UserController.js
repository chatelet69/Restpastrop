const UserService = require("../services/UserService");
const userService = new UserService();

class UserController {
    async authLogin(req, res) {
        try {
            const body = req.body;
            const resLogin = await userService.authLoginService(body.username, body.password);
            if (resLogin) res.status(200).json({message: "success", jwt: resLogin});
            else res.status(403).json({message: "error"});
        } catch (error) {
            res.status(500).json({error: "Error during login"});
        }
    }

    async myUser(req, res) {
        try {
            const userId = req.user.userId;
            const userData = await userService.myUserService(userId);
            res.status(200).json({message: "logged", user: userData});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Error during get my user"});
        }
    }

    async register(req, res) {
        try {
            const registerData = req.body;
            const resRegister = await userService.registerService(registerData);
            if (resRegister) res.status(200).json({message: "success", jwt: resRegister});
            else res.status(403).json({message: "error"});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Error during register"});
        }
    }
}

module.exports = UserController;