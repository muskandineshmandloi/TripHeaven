const Listing = require("./Models/listing");
const Review = require("./Models/review");
const ExpressError = require("./utils/ExpressError");
const { ListingSchema, ReviewSchema, searchSchema, BookingSchema} = require("./schema");

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

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        if (
            !res.locals.currUser ||
            !listing.owner_id.equals(res.locals.currUser._id)
        ) {
            req.flash("error", "You are not the owner of the listing");
            return res.redirect(`/listings/${id}`);
        }
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
       
        if (!review) {
            req.flash("error", "Review not found");
            return res.redirect(`/listings/${id}`);
        }

        if (!res.locals.currUser || !review.author._id.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not thea author of this Review");
            return res.redirect(`/listings/${id}`);
        }
        next();
}



module.exports.validateSearch = (req, res, next) => {
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        req.flash("error", msg);
        return res.redirect("/listings");
    }
};

module.exports.validateBooking = (req, res, next) => {
    const { error } = BookingSchema.validate(req.body);

    if (error) {
        let msg = error.details.map(el => el.message).join(",");
        req.flash("error", msg);
        return res.redirect("back");
    }

    next();
};