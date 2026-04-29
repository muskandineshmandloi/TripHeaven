const express = require("express");
const router = express.Router({mergeParams : true});

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");

const userController = require("../Controllers/user.js");


router
    .route("/")
    .get(userController.home);

router
    .route("/signup")
    .get(userController.renderSignupPage) //signup page
    .post(userController.signupUser); //post signup
    



router
    .route("/login")
    .get(userController.renderLoginPage); //login page

router.post("/login", savedRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    userController.loginUser
);


router.get("/logout", userController.logout);


router.get("/profile", userController.profile);
module.exports = router;