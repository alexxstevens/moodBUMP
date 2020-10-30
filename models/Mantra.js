const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create a Schema
const MantraSchema = new Schema({
	mantraEntry: String,
});

module.exports = Mantra = mongoose.model("Mantra", MantraSchema);
