const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const bookingSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },

    checkOut: {
        type: Date,
        required: true
    },

    guests: {
        type: Number,
        required: true,
        min: 1
    },


    rooms: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },

    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },

    bookingStatus: {
        type: String,
        enum: ["Confirmed", "Cancelled", "Completed"],
        default: "Confirmed"
    }
    },{
        timestamps: true
    }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;