const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE;

const connectToMongo = () => {
    mongoose.connect(DB, () => {
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;