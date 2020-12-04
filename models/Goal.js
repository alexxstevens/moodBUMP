const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create goal Schema
const GoalSchema = new Schema({
	name: String,
	tool_1: String,
	tool_2: String,
	tool_3: String,
	status: Boolean, //active vs. inactive goal
});

module.exports = Goal = mongoose.model("Goal", GoalSchema);
