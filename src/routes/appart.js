const express           = require('express');
const app               = express();
const router            = express.Router();
const AppartRepository  = require("../repository/AppartRepository");
const appartRepo        = new AppartRepository();
const bodyParser        = require('body-parser');
const cacheMiddleware   = require("../middlewares/cacheMiddleware");
const AppartController  = require("../controller/AppartController");
const appartControl        = new AppartController();
const authMiddleware            = require("../middlewares/authMiddleware");
const authorizationMiddleware   = require("../middlewares/authorizationMiddleware");
const authAdminMiddleware       = require("../middlewares/authAdminMiddleware");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());

// Get method

router.get('/apparts', cacheMiddleware(60), async (req, res) => { 
    console.log("Requête reçue sur la route :", req.route.path);
    try {
        let data = await appartRepo.getAllApparts();
        res.status(200);
        res.json({count: data.length, apparts: data});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Error during get appartments"});
    }
});

router.get("/apparts/:id", async (req, res) => {
    console.log("Requête reçue sur la route", req.route.path, "| id -> " + req.params.id );
    try {
        let data = await appartRepo.getAppartById(req.params.id);
        if (data.length) {
            res.status(200);
            res.json(data);
        } else {
            res.status(404);
            res.json({message: `no appart for id ${req.params.id}`});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: `Error during get appart ${req.params.id}`});
    }
});

// Post method

router.post("/apparts/create", [authMiddleware, authAdminMiddleware], async (req, res) =>{
    await appartControl.postAppart(req, res);
});

router.delete("/apparts/delete/:id",[authMiddleware], async (req, res) => {
    await appartControl.deleteAppart(req, res);
})
module.exports = router;