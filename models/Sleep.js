const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create sleep log Schema
const SleepSchema = new Schema({
	date: {
		type: Date,
		required: true,
	},
	hours: {
		type: Number,
	},
	quality: {
		type: Number,
	},
});

module.exports = Sleep = mongoose.model("Sleep", SleepSchema);
