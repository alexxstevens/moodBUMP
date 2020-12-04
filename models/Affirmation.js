const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create affirmation Schema
const AffirmationSchema = new Schema({
	affirmationEntry: String,
});

module.exports = Affirmation = mongoose.model("Affirmation", AffirmationSchema);
