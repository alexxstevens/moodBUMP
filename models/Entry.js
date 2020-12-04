const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create journal entries Schema
const EntrySchema = new Schema({
	journalEntry: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Entry = mongoose.model("Entry", EntrySchema);
