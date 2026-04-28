const Listing = require("./Models/listing");
const Review = require("./Models/review");
const ExpressError = require("./utils/ExpressError");
const { ListingSchema, ReviewSchema, searchSchema} = require("./schema");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // redirectUrl save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
};

// post login redirection

module.exports.savedRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!res.locals.currUser || !listing.owner._id.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not the owner of the listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
}

module.exports.validateListing = (req, res, next) => {
    const { error } = ListingSchema.validate(req.body, { abortEarly: false });
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};



module.exports.isReviewAuthor = async (req, res, next) => {
    
        let { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if (!res.locals.currUser || !review.author._id.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not thea author of this Review");
            return res.redirect(`/listings/${id}`);
        }
        next();
}



module.exports.validateSearch = (req, res, next) => {
    const { error } = searchSchema.validate(req.query);

    if (error) {
        req.flash("error", "Please enter a valid destination");
        return res.redirect("/listings");
    }

    next();
};