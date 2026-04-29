require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");


const { MongoStore } = require("connect-mongo");

const reviewsRouter = require("./routes/reviews.js");
const listingsRouter = require("./routes/listings.js");
const userRouter = require("./routes/user.js");

const dbURL = process.env.ATLAS_URL;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

async function main(){
    await mongoose.connect(dbURL);
}

main()
.then(() => {
    console.log("connection established with database");

    const store = MongoStore.create({
        mongoUrl: dbURL,
        collectionName: "sessions",
    });

    store.on("error", (err) => {
        console.log("Error in mongo session store", err);
    });

    const sessionOptions = {
        store,
        secret: process.env.SECRETCODE,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        }
    };

    app.use(session(sessionOptions));
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use((req, res, next) => {
        res.locals.currUser = req.user;
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        next();
    });


    app.use("/listings", listingsRouter);
    app.use("/listings/:id/reviews", reviewsRouter);
    app.use("/", userRouter);

    app.use((req, res, next) => {
        next(new ExpressError(404, "Page not found"));
    });

    app.use((err, req, res, next) => {
        if (res.headersSent) {
            return next(err);
        }
        let { status = 500, message = "Something went wrong" } = err;
        res.status(status).render("error.ejs", { message });
    });

    app.listen(8080, () => {
        console.log("Server is listening at port 8080");
    });
})
.catch((err) => {
    console.log("Something went wrong", err);
});