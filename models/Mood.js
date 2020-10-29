const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create a Schema
const MoodSchema = new Schema({
	mood_value: {
		type: Number,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Mood = mongoose.model("mood", MoodSchema);
