const express = require("express");
const path = require("path");
const hbs = require("hbs");
const mongoose = require("mongoose");
const moods = require("../routes/api/moods");
const Mood = require("../models/Mood");
const goals = require("../routes/api/goals");
const Goal = require("../models/Goal");

const app = express();

//paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//handlebars engine and view location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//init body parser middleware
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

//static directory
app.use(express.static(publicDirectoryPath));

//DB connections
const db =
	"mongodb+srv://mbdbUser:password1122@cluster0.09rfv.mongodb.net/moodbumpDB?retryWrites=true&w=majority";

//connect to mood DB
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connected to DB :)"))
	.catch((err) => console.log(mongoose.err));

//use api
app.use("/api/moods", moods);
app.use("/api/goals", goals);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

//APP ROUTES
//load
app.get("", (req, res) => {
	res.render("index", {
		title: "Loading moodBUMP",
	});
});

//login
app.get("/login", (req, res) => {
	res.render("login", {
		title: "Login to moodBUMP",
	});
});

//logout
app.get("/logout", (req, res) => {
	res.render("logout", {
		title: "Logout of moodBUMP",
	});
});

//welcome
app.get("/welcome", (req, res) => {
	res.render("welcome", {
		title: "Welcome to moodBUMP",
	});
});

//home
app.get("/home", (req, res) => {
	Goal.find(function (err, goal) {
		let active = goal.filter((goal) => goal.status === true);
		res.render("home", {
			title: "moodBUMP",
			goals: active,
		});
	});
});

app.post("/moods", (req, res) => {
	const newMood = new Mood({
		mood_value: req.body.mood_value,
	});
	newMood
		.save()
		.then((mood) => res.redirect("/home")) //res.json(mood))
		.catch((error) => console.error(error));
});

//goals
app.get("/goal", function (req, res, next) {
	Goal.find(function (err, goal) {
		let active = goal.filter((goal) => goal.status === true);
		let inactive = goal.filter((goal) => goal.status === false);
		res.render("goal", {
			title: "moodBUMP goals",
			goals: active,
			inactive_goals: inactive,
		});
		console.log("active:" + active);
		console.log("inactive:" + inactive);
	});
});

//trend;
app.get("/trend", (req, res) => {
	res.render("trend", {
		title: "moodBUMP Trends",
	});
});

//tools
app.get("/tools", (req, res) => {
	res.render("tools", {
		title: "moodBUMP Tools",
		tool_1: goal.tool_1,
		tool_2: goal.tool_2,
		tool_3: goal.tool_3,
	});
});

//meditation
app.get("/meditation", (req, res) => {
	res.render("meditation", {
		title: "moodBUMP Meditation Resources",
	});
});

//though journal
app.get("/thoughtJournal", (req, res) => {
	res.render("thoughtJournal", {
		title: "moodBUMP Thought Journal",
	});
});

//though journal entry
app.get("/thoughtJournalEntry", (req, res) => {
	res.render("thoughtJournalEntry", {
		title: "moodBUMP Thought Journal Entry",
	});
});

//sleep log
app.get("/sleepLog", (req, res) => {
	res.render("sleepLog", {
		title: "moodBUMP Sleep Log",
	});
});

//power hour
app.get("/powerHour", (req, res) => {
	res.render("powerHour", {
		title: "moodBUMP Power Hour",
	});
});

//affirmation
app.get("/affirmationHome", (req, res) => {
	res.render("affirmationHome", {
		title: "moodBUMP Affirmations",
	});
});

//add affirmation
app.get("/affirmationAdd", (req, res) => {
	res.render("affirmationAdd", {
		title: "Edit Affirmations",
	});
});

//mantra
app.get("/mantraHome", (req, res) => {
	res.render("mantraHome", {
		title: "moodBUMP Mantras",
	});
});

//mantra add
app.get("/mantraAdd", (req, res) => {
	res.render("mantraAdd", {
		title: "Edit Mantras",
	});
});

//404
app.get("*", (req, res) => {
	res.render("404", {
		title: "Error: 404 PAGE NOT FOUND",
	});
});
