const express = require("express");
const router = express.Router();

const bookingController = require("../Controllers/booking.js");
const { isLoggedIn, validateBooking } = require("../middleware.js");



router.post(
    "/listings/:id/book",
    isLoggedIn,
    validateBooking,
    bookingController.createBooking
);


router.get(
    "/bookings/my",
    isLoggedIn,
    bookingController.myBookings
);


router.get(
    "/dashboard",
    isLoggedIn,
    bookingController.ownerDashboard
);

router.patch(
    "/bookings/:id/complete",
    isLoggedIn,
    bookingController.completeBooking
);

router.patch(
    "/bookings/:id/cancel",
    isLoggedIn,
    bookingController.cancelBooking
);

module.exports = router;