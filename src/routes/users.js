const express                   = require('express');
const router                    = express.Router();
const UserController            = require("../controller/UserController");
const userController            = new UserController();
const authMiddleware            = require("../middlewares/authMiddleware");
const authorizationMiddleware   = require("../middlewares/authorizationMiddleware");
const cacheMiddleware           = require("../middlewares/cacheMiddleware");

// Get method

router.get("/users", cacheMiddleware(10), (req, res) => {
    userController.getAllUsers();
});

router.get("/users/me", [authMiddleware, authorizationMiddleware], (req, res) => {
    userController.myUser(req, res);
});

// Post method

router.post('/login', async (req, res) => { 
    userController.authLogin(req, res);
});

module.exports = router;