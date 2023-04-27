const express = require("express");
const user_route = express.Router();
const userControl = require("../controllers/userController");

user_route.post("/signUp",userControl.userSignUp);
user_route.post("/verifyOTP",userControl.verifyOTP);

module.exports = user_route;


