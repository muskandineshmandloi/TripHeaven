require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");

const initData = require("./data.js");
const Listing = require("../Models/listing.js");

const dbURL = process.env.ATLAS_URL;

async function main(){
    await mongoose.connect(dbURL);
}

const initDb = async() => {
    await Listing.deleteMany({});
    const modifiedData = initData.data.map((obj) => ({
        ...obj,
        owner: new mongoose.Types.ObjectId("69cd61d15689b4f751f3bf9f"),
        geometry: obj.geometry || {
        type: "Point",
        coordinates: [72.5714, 23.0225]
    }
    }));

    await Listing.insertMany(modifiedData);
    console.log("data was initialized");
};

main()
.then(async () => {
    console.log("connection established with database");
    await initDb();   
})
.catch((err) => {
    console.log(err); 
});