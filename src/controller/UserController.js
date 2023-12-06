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
            console.log(error);
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

    async getAllUsers(req, res) {
        try {
            const usersData = await userService.getAllUsersService();
            res.status(200).json({message: "success", users: usersData});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Error during get all users"});
        }
    }

    async getUserById(req, res) {
        try {
            const userId = req.params.id;
            const userData = await userService.getUserService(userId);
            res.status(200).json(userData);
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Error during getting the user"});
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

    async search(req, res) {
        try {
            const data = req.query;
            if (Object.keys(data).length) {     // Renvoit un tableau des clés de l'objet, dont on récupère la taille
                const resData = await userService.search(data);
                res.status(200).json(resData);
            } else {
                res.status(400).json({message: "need a search query", documentation: "https://doc"});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Error during search"});
        }
    }

    async deleteUser(req, res) {
        try {
            const userIdDelete = req.params.id;
            const check = await userService.getUserService(userIdDelete);
            if (check) {
                userService.deleteUserById(userIdDelete);
                res.status(200).json({message: "successfuly deleted"});
            } else {
                res.status(403).json({message: "error", cause: "user dosn't exist"});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Error during delete"});
        }
    }
}

module.exports = UserController;