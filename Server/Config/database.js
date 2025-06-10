const mongoose = require("mongoose");
require("dotenv").config();
const dotenv = require("dotenv");
const Property = require("../Models/property")
const { MONGODB_URL } = process.env;

exports.connect = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("DB Connection Success");
    } catch (err) {
        console.error("DB Connection Failed:", err.message);
        process.exit(1);
    }
};
