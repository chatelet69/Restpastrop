const express           = require('express');
const app               = express();
const router            = express.Router();
const UserController    = require("../controller/UserController");
const userController    = new UserController();
//const bodyParser        = require('body-parser');
const cacheMiddleware   = require("../middlewares/cacheMiddleware");

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.raw());

// Get method

router.get("/users", cacheMiddleware(10), (req, res) => {
    userController.getAllUsers();
});

// Post method

router.post('/login', cacheMiddleware(60), async (req, res) => { 
    console.log("Requête reçue sur la route :", req.route.path);
    userController.authLogin(req, res);
});

module.exports = router;