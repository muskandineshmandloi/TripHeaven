const User = require("../Models/user");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../Models/listing");

module.exports.renderSignupPage = (req, res) => {
    res.render("users/signup.ejs");
};


module.exports.signupUser = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        if(password.length < 12 ||
            !/\d/.test(password) ||
            !/[!@#$%^&*(),.?":{}|<>]/.test(password)){
                req.flash("error", "Password must be at least 12 characters long and include at least one number and one special character");
                return res.redirect("/signup");
        }

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        
        await new Promise((resolve, reject) => {
            req.login(registeredUser, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        req.flash("success", "Welcome to TripHeaven");
        return res.redirect("/listings");

    } catch (err) {
        return next(err);
    }
};

module.exports.renderLoginPage = async(req, res) => {
    res.render("users/login.ejs");
};

module.exports.loginUser =  async(req, res) => {
        const { username } =  req.user;
        req.flash("success", `Welcome back ${username} to TripHeaven`);
        const redirectUrl = res.locals.redirectUrl || "/listings";
        return res.redirect(redirectUrl);
};



module.exports.logout = (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error);
        }
        req.flash("success", "You are logged out");
        return res.redirect("/listings");
    });
};



module.exports.profile = async (req, res, next) => {
    let user = await User.findById(req.user._id);

    if (!user) {
        req.flash("error", "User not found");
        return res.redirect("/listings");
    }

    let listings = await Listing.find({ owner: req.user._id });

    res.render("users/profile.ejs", { user, listings });
};


module.exports.home = async(req, res, next) => {
    req.flash("success", "Welcome");
    return res.redirect("/listings");
}