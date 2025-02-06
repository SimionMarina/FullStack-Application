const express = require("express");
const Router = express.Router();
const userController = require("../controllers/UserController");
const flatController = require("../controllers/FlatController");
const messageController = require("../controllers/MessageController");
const { authenticateToken } = require("../middleware/authMiddleware");

//flatRoutes
Router.post("/createFlat", flatController.createFlat);
Router.get("/getFlatById/:id", flatController.getflatbyID);
Router.get("/getFlatByOwnerId/:ownerId", flatController.getFlatbyOwnerId);
Router.get("/flatsCount/:userId", flatController.flatsCount);
Router.get("/flats", flatController.getAllFlats);
Router.post("/favoriteFlats", flatController.favoriteFlats);
Router.delete("/deteleflat/:id", flatController.deleteFlat);
Router.patch("/updateFlat/:id", flatController.updateFlat);

//userRoutes
Router.post("/register", userController.createUser);
Router.post("/login", userController.loginUser);
Router.get("/verifyToken", userController.verifyToken);
Router.get("/getUser/:id", userController.getUserData);
Router.get("/getAllUsers", userController.getAllUsers);
Router.delete("/deleteUser/:id", userController.deleteUser);
Router.patch("/updateUser/:id", userController.updateUser);
Router.post("/requestPasswordReset", userController.forgotPassword);
Router.post("/resetPassword/:token", userController.resetPassword);



//messageRoutes
Router.get("/inbox/:userId", messageController.getAllMessages);
module.exports = Router;
