
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../Models/listing.js");
const mongoose = require("mongoose");

const { uploadToCloudinary } = require("../cloudConfig.js");


module.exports.index = async (req, res) => {
    
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) =>{
    res.render("listings/newForm.ejs");
};


module.exports.filter = async(req, res) => {
    const {filtername} = req.params;
    if(filtername == 'none'){
        return res.redirect("/listings");
    }
    const allListings = await Listing.find({category: filtername});
    res.render("listings/index", {allListings});
}

module.exports.postListing = async (req, res, next) => {

    const location = req.body.listing?.location;
    const country = req.body.listing?.country;

    const query = `${location}, ${country}`;

    let coords = null;

    try {
        const response = await fetch(
            `https://us1.locationiq.com/v1/search?key=${process.env.LOCATIONIQ_KEY}&q=${encodeURIComponent(query)}&format=json&limit=1`
        );

        if (response.ok) {
            const data = await response.json();

            if (data.length) {
                coords = {
                    type: "Point",
                    coordinates: [
                        parseFloat(data[0].lon),
                        parseFloat(data[0].lat)
                    ]
                };
            }
        } else {
            console.log("LocationIQ error:", response.status);
        }

    } catch (err) {
        console.log("Geo API failed:", err);
    }

    if (!req.file) {
        return next(new ExpressError(400, "Image is required"));
    }

    let result;
    try {
        result = await uploadToCloudinary(req.file.buffer);
    } catch (err) {
        return next(new ExpressError(500, "Image upload failed"));
    }

    let url = result.secure_url;
    let filename = result.public_id;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = coords || undefined;

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.putUpadateListing = async (req, res, next) => {
    if(!req.body.listing){
        return next(new ExpressError(400, "Send valid data for listing"));
    }

    const updatedData = { ...req.body.listing };

    let { id } = req.params;

    if(req.file){
        const result = await uploadToCloudinary(req.file.buffer);
        updatedData.image = {
            url : result.secure_url,
            filename : result.public_id
        };

    }

    const newListing = await Listing.findByIdAndUpdate(id, updatedData, {new : true});

    if(!newListing){
        return next(new ExpressError(404, "Listing not found"));
    }

    const { image } = newListing;
    
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);  
    
};

module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing =  await Listing.findByIdAndDelete(id);
    
    req.flash("success", "listing deleted successfully");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res, next) => {

    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ExpressError(404, "Page not found"));
    }

    let listing = await Listing.findById(id)
        .populate({
            path: "reviews", 
            populate: {
                path: "author"
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "listing you requested for does not exist!");
        return res.redirect("/listings");
    }


    const isOwner =
    req.user &&
    listing.owner &&
    listing.owner.equals(req.user._id);

    res.render("listings/show.ejs", {
    listing,
    currUser: req.user,
    isOwner
});
};



module.exports.search = async (req, res) => {
  let destination = req.query.destination;

  if (!destination || destination.trim() === "") {
    req.flash("error", "Please enter a valid destination");
    return res.redirect("/listings");
  }

  destination = destination.trim();

  const escapeRegex = (str) =>
        str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const safeDestination = escapeRegex(destination);

    const allListings = await Listing.find({
        $or: [
            { location: { $regex: safeDestination, $options: "i" } },
            { country: { $regex: safeDestination, $options: "i" } },
            { title: { $regex: safeDestination, $options: "i" } }
        ]
    });

  if (allListings.length === 0) {
    req.flash("error", "Currently not available at the entered location");
    return res.redirect("/listings");
  }

  res.render("listings/index.ejs", { allListings });
};