const express                   = require('express');
const router                    = express.Router();
const UserController            = require("../controller/UserController");
const authMiddleware            = require("../middlewares/authMiddleware");
const authorizationMiddleware   = require("../middlewares/authorizationMiddleware");
const authAdminMiddleware       = require("../middlewares/authAdminMiddleware");
const cacheMiddleware           = require("../middlewares/cacheMiddleware");
const getMethodCheck            = require("../middlewares/getMethodCheck");
const checkIfAdmin              = require("../middlewares/checkIfAdmin");
const userController            = new UserController();

// Get method

router.get("/users", [authMiddleware, authorizationMiddleware], (req, res) => {
    userController.getAllUsers(req, res);
});

router.get("/users/:id", [authMiddleware, authAdminMiddleware], (req, res) => {
    userController.getUserById(req, res);
});

router.get("/users/me", [authMiddleware, authorizationMiddleware], (req, res) => {
    userController.myUser(req, res);
});

router.use("/users/search/by", [getMethodCheck, authMiddleware, authAdminMiddleware], userController.search);

// Post method

router.post("/register", userController.register);

router.post("/login", userController.authLogin);

// Delete Method

router.delete("/users/:id", [authMiddleware, authAdminMiddleware], userController.deleteUser);

// Patch Method

router.patch("/users/:id", [authMiddleware, checkIfAdmin], userController.patchUser);

module.exports = router;