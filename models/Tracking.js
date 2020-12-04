const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create a Schema
const TrackingSchema = new Schema({
	date: String,
	toolName: String,
	goal: String,
});

module.exports = Tracking = mongoose.model("Tracking", TrackingSchema);
