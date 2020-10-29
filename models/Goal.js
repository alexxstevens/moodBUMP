const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create a Schema
const GoalSchema = new Schema({
	name: String,
	tool_1: {
		type: String,
	},
	tool_2: {
		type: String,
	},
	tool_3: {
		type: String,
	},
	status: Boolean,
});

module.exports = Goal = mongoose.model("Goal", GoalSchema);
