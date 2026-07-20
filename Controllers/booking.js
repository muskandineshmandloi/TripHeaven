const Booking = require("../Models/booking.js");
const Listing = require("../Models/listing.js");

module.exports.myBookings = async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate("listing");

    res.render("bookings/myBookings.ejs", { bookings });
};


module.exports.createBooking = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (listing.owner.equals(req.user._id)) {
        req.flash("error", "You cannot book your own property.");
        return res.redirect(`/listings/${id}`);
    }

    const { checkIn, checkOut, guests, rooms } = req.body.booking;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const today = new Date();
    today.setHours(0,0,0,0);

    if (start < today) {
        req.flash("error", "Check-in cannot be in the past");
        return res.redirect(`/listings/${id}`);
    }

    if (end <= start) {
        req.flash("error", "Check-out must be after check-in");
        return res.redirect(`/listings/${id}`);
    }

    // DOUBLE BOOKING CHECK (FIXED LOCATION)
    const existingBooking = await Booking.findOne({
        listing: id,
        bookingStatus: "Confirmed",
        $or: [
            {
                checkIn: { $lt: end },
                checkOut: { $gt: start }
            }
        ]
    });

    if (existingBooking) {
        req.flash("error", "This property is already booked for selected dates");
        return res.redirect(`/listings/${id}`);
    }

    const oneDay = 1000 * 60 * 60 * 24;
    const nights = Math.ceil((end - start) / oneDay);

    const totalPrice = listing.price * nights * rooms;

    const booking = new Booking({
        user: req.user._id,
        listing: id,
        checkIn,
        checkOut,
        guests,
        rooms,
        totalPrice
    });

    await booking.save();

    req.flash("success", "Booking confirmed!");
    res.redirect("/bookings/my");
};


module.exports.ownerDashboard = async (req, res) => {
    const listings = await Listing.find({ owner: req.user._id });

    const listingIds = listings.map(l => l._id);

    const bookings = await Booking.find({
        listing: { $in: listingIds }
    })
    .populate("listing")
    .populate("user");

    res.render("bookings/dashboard.ejs", { bookings });
};