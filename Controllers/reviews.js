const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");
const ExpressError = require("../utils/ExpressError.js");


module.exports.postReview = async(req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        return next(new ExpressError(404, "Listing not found"));
    }
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview._id);

    await newReview.save();
    await listing.save();

    
    return res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async(req, res) => {
    let { id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");    
    res.redirect(`/listings/${id}`);
};

