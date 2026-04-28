const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../Models/listing.js");
const mongoose = require("mongoose");


const { upload } = require("../cloudConfig.js");

const { isLoggedIn, isOwner, validateListing, validateSearch } = require("../middleware.js");

const listingController = require("../Controllers/listings.js");


// Index Route


router.get("/filter/:filtername", wrapAsync(listingController.filter));

router.get("/search", validateSearch, wrapAsync(listingController.search));

router
    .route("/")
    .get(wrapAsync(listingController.index)) //all listings
    .post(isLoggedIn,
        upload.single('listing[image]'),
         validateListing, 
         wrapAsync(listingController.postListing)
    ); //post listing

router.get("/new", isLoggedIn, listingController.renderNewForm);



router
    .route("/:id")
    .put(isLoggedIn,  
        isOwner,
        upload.single('listing[image]'), 
        validateListing, 
        wrapAsync(listingController.putUpadateListing)) //update listing
    .delete(isLoggedIn, isOwner, listingController.deleteListing) //delete listing
    .get(wrapAsync(listingController.showListing)); //show listing



// UPDATE : EDIT AND UPDATE ROUTE

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));



module.exports = router;