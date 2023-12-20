const UserService   = require("../services/UserService");
const baseUrl       = require("../../config.json").baseUrl;
const form          = require("../utils/form.json");
const userService   = new UserService();

class UserController {

    async authLogin(req, res) {
        try {
            const body = req.body;
            const resLogin = await userService.authLoginService(body.username, body.password);
            if (resLogin) res.status(200).json({message: "success", jwt: resLogin});
            else res.status(403).json({error: "Impossible de se connecter"});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Une erreur est survenue durant la connexion"});
        }
    }

    async myUser(req, res) {
        try {
            const userId = req.user.userId;
            const userData = await userService.myUserService(userId);
            res.status(200).json({message: "logged", user: userData});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Une erreur est survenue durant la récupération du user"});
        }
    }

    async getAllUsers(req, res) {
        try {
            const usersData = await userService.getAllUsersService();
            res.status(200).json({message: "success", users: usersData});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Une erreur est survenue durant la récupération des utilisateurs"});
        }
    }

    async getUserById(req, res) {
        try {
            const userId = req.params.id;
            const userData = await userService.getUserService(userId);
            if (!userData.error) res.status(200).json(userData);    // Si l'utilisateur existe
            else res.status(404).json({error: userData.error});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Une erreur est survenue durant la récupération du user"});
        }
    }

    async register(req, res) {
        try {
            const registerData = req.body;
            const resRegister = await userService.registerService(registerData);
            if (resRegister) res.status(200).json({message: "success", jwt: resRegister});
            else res.status(403).json({error: "Erreur durant l'inscription"});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Une erreur est survenue durant l'inscription"});
        }
    }

    async createUser(req, res) {
        try {
            const userData = req.body;
            const resCreatedUser = await userService.createUser(userData);
            if (resCreatedUser) res.status(200).json(resCreatedUser);
            else res.status(400).json({error: form.errorCreateUser});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: form.errorCreateUser});
        }
    }

    async search(req, res) {
        try {
            const data = req.query;
            if (Object.keys(data).length) {     // Renvoit un tableau des clés de l'objet, dont on récupère la taille
                const resData = await userService.search(data);
                res.status(200).json(resData);
            } else {
                res.status(400).json({error: "Paramètres de recherche manquants"});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Une erreur est survenue durant la recherche"});
        }
    }

    async deleteUser(req, res) {
        try {
            const userIdDelete = req.params.id;
            const check = await userService.getUserService(userIdDelete);
            if (check && check.id) {
                userService.deleteUserById(userIdDelete);
                res.status(200).json({message: "Suppression validée avec succès"});
            } else {
                res.status(404).json({error: form.userNotFound});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Une erreur est survenue durant la suppression"});
        }
    }

    async patchUser(req, res){
        try {
            const data = {
                userId: req.params.id,
                body: req.body,
                isAdmin: req.user.isAdmin
            }
            const check = await userService.getUserService(data.userId);
            if (check.id) { // Check si l'user existe
                let result = await userService.patchUserById(data.userId, data);
                if (result.link) res.status(200).json({message: "Modification réalisée avec succès !", redirect: result});
                else res.status(500).json({error: result});
            } else {
                res.status(404).json({error: form.userNotFound});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Une erreur est survenue durant la modification de l'utilisateur."});
        }
    }
}

module.exports = UserController;