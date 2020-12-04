const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create user Schema
const UserSchema = new Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
	},
	password: {
		type: String,
	},
});

module.exports = User = mongoose.model("User", UserSchema);
