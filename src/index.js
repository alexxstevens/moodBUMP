const express = require("express");
const path = require("path");
const hbs = require("hbs");
const mongoose = require("mongoose");
const moods = require("../routes/api/moods");
const Mood = require("../models/Mood");
const goals = require("../routes/api/goals");
const Goal = require("../models/Goal");
const Mantra = require("../models/Mantra");
const Affirmation = require("../models/Affirmation");
const Sleep = require("../models/Sleep");
const Entry = require("../models/Entry");
const entries = require("../routes/api/entries");

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
app.use("/api/entries", entries);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

//APP ROUTES
//LOADPAGE
app.get("", (req, res) => {
	res.render("index", {
		title: "Loading moodBUMP",
	});
});

//LOGINPAGE
app.get("/login", (req, res) => {
	res.render("login", {
		title: "Login to moodBUMP",
	});
});

//LOGOUTPAGE
app.get("/logout", (req, res) => {
	res.render("logout", {
		title: "Logout of moodBUMP",
	});
});

//WELCOMEPAGE
app.get("/welcome", (req, res) => {
	res.render("welcome", {
		title: "Welcome to moodBUMP",
	});
});

//HOMEPAGE
app.get("/home", (req, res) => {
	Goal.find(function (err, goal) {
		let active = goal.filter((goal) => goal.status === true);
		res.render("home", {
			title: "moodBUMP",
			goals: active,
		});
	});
});
//log mood
app.post("/moods", (req, res) => {
	const newMood = new Mood({
		mood_value: req.body.mood_value,
	});
	newMood
		.save()
		.then((mood) => res.redirect("/home")) //res.json(mood))
		.catch((error) => console.error(error));
});

//GOALSPAGE
app.get("/goal", function (req, res, next) {
	Goal.find(function (err, goal) {
		let active = goal.filter((goal) => goal.status === true);
		let inactive = goal.filter((goal) => goal.status === false);
		res.render("goal", {
			title: "moodBUMP Goals",
			goals: active,
			inactive_goals: inactive,
		});
		console.log("active:" + active);
		console.log("inactive:" + inactive);
	});
});

//custom goal
app.get("/customGoal", (req, res) => {
	res.render("customGoal", {
		title: "Add Custom Goal",
	});
});

//add goal
app.post("/addGoal", (req, res) => {
	const newGoal = new Goal({
		name: req.body.name,
		tool_1: req.body.tool_1,
		tool_2: req.body.tool_2,
		tool_3: req.body.tool_3,
		status: true,
	});
	newGoal
		.save()
		.then((goal) => res.redirect("/goal")) //res.json(goal))
		.catch((error) => console.error(error));
});

//MANAGEGOALS PAGE
app.get("/manageGoal", (req, res) => {
	Goal.find(function (err, goal) {
		res.render("manageGoal", {
			title: "moodBUMP Manage Goals",
			goals: goal,
		});
	});
});

//delete goal
//delete entry
app.post("/deleteGoal", (req, res) => {
	console.log("activated");
	console.log(req.body);
	Goal.findById(req.body._id)
		.then((goal) => goal.remove().then(() => res.redirect("/manageGoal")))
		.catch((err) => res.status(404).json({ success: false }));
});

//TRENDPAGE;
app.get("/trend", (req, res) => {
	res.render("trend", {
		title: "moodBUMP Trends",
	});
});

//TOOLSPAGE
app.get("/tools", function (req, res, next) {
	Goal.find(function (err, goal) {
		let active = goal.filter((goal) => goal.status === true);
		let productivity = goal.filter((goal) => goal.name === "Productivity");
		let mindfulness = goal.filter((goal) => goal.name === "Mindfulness");
		let tools = active.filter(
			(active) =>
				active.name !== "Productivity" && active.name !== "Mindfulness"
		);
		console.log(tools);
		res.render("tools", {
			title: "moodBUMP Tools",
			custom_tools: tools,
			productivity: productivity,
			mindfulness: mindfulness,
		});
	});
});

//MEDITATIONPAGE
app.get("/meditation", (req, res) => {
	res.render("meditation", {
		title: "moodBUMP Meditation Resources",
	});
});

//MANTRAPAGE
app.get("/mantraHome", function (req, res, next) {
	Mantra.find(function (err, mantra) {
		console.log(mantra);
		res.render("mantraHome", {
			title: "moodBUMP Mantras",
			mantras: mantra,
		});
	});
});

//custom mantra
app.get("/mantraAdd", (req, res) => {
	Mantra.find(function (err, mantra) {
		console.log(mantra);
		res.render("mantraAdd", {
			title: "moodBUMP Mantras",
			mantras: mantra,
		});
	});
});

//add mantra
app.post("/addMantra", (req, res) => {
	const newMantra = new Mantra({
		mantraEntry: req.body.mantraEntry,
	});
	console.log(req.body.mantraEntry);
	newMantra
		.save()
		.then((mantra) => res.redirect("/mantraHome")) //res.json(goal))
		.catch((error) => console.error(error));
});

//THOUGHT JOURNAL PAGE
app.get("/thoughtJournal", (req, res) => {
	Entry.find(function (err, entry) {
		res.render("thoughtJournal", {
			title: "moodBUMP Thought Journal",
			entries: entry,
		});
	});
});

//add journal entry
app.post("/addEntry", (req, res) => {
	const newEntry = new Entry({
		journalEntry: req.body.journalEntry,
	});
	console.log(req.body.journalEntry);
	newEntry
		.save()
		.then((entry) => res.redirect("/thoughtJournal")) //res.json(goal))
		.catch((error) => console.error(error));
});

//THOUGHT JOURNAL ENTRY
app.post("/getEntry", (req, res) => {
	//console.log(req.body._id);
	Entry.find(function (err, entry) {
		const found = entry.filter((entry) => entry._id == req.body._id);
		if (found) {
			//console.log("true");
			res.render("thoughtJournalEntry", {
				title: "moodBUMP Thought Journal Entry",
				entry: found,
			});
			//console.log(found);
		} else {
			res.render("404", {});
		}
	});
});

//delete entry
app.post("/deleteEntry", (req, res) => {
	console.log("activated");
	console.log(req.body);
	Entry.findById(req.body._id)
		.then((entry) => entry.remove().then(() => res.redirect("/thoughtJournal")))
		.catch((err) => res.status(404).json({ success: false }));
});

// 	Entry.find(function (err, entry) {
// 		console.log(entry);
// 		res.render("thoughtJournal", {
// 			title: "moodBUMP Thought Journal Entry",
// 			entries: entry,
// 		});
// 	});
// });
// router.get("/:id", (req, res) => {
// 	const found = members.some((member) => member.id === parseInt(req.params.id));
// 	if (found) {
// 		res.json(members.filter((member) => member.id === parseInt(req.params.id)));
// 	} else {
// 		res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
// 	}
// });
// router.get("/", (req, res) => {
// 	Goal.find()
// 		.sort({ name: -1 }) //ascending
// 		.then((goal) => res.json(goal));
// });

//SLEEPLOGPAGE
app.get("/sleepLog", (req, res) => {
	res.render("sleepLog", {
		title: "moodBUMP Sleep Log",
	});
});

//log sleep
app.post("/logSleep", (req, res) => {
	const newSleep = new Sleep({
		date: req.body.date,
		hours: req.body.hours,
		quality: req.body.quality,
	});
	console.log(req.body.hours);
	newSleep
		.save()
		.then((sleep) => res.redirect("/sleepLog")) //res.json(goal))
		.catch((error) => console.error(error));
});

//PWOERHOURPAGE
app.get("/powerHour", (req, res) => {
	res.render("powerHour", {
		title: "moodBUMP Power Hour",
	});
});

//AFFIRMATIONPAGE
app.get("/affirmationHome", function (req, res, next) {
	Affirmation.find(function (err, affirmation) {
		console.log(affirmation);
		res.render("affirmationHome", {
			title: "moodBUMP Affirmations",
			affirmations: affirmation,
		});
	});
});

//custom affirmation
app.get("/affirmationAdd", (req, res) => {
	Affirmation.find(function (err, affirmation) {
		console.log(affirmation);
		res.render("affirmationAdd", {
			title: "moodBUMP affirmation",
			affirmations: affirmation,
		});
	});
});

//add affirmation
app.post("/addAffirmation", (req, res) => {
	const newAffirmation = new Affirmation({
		affirmationEntry: req.body.affirmationEntry,
	});
	console.log(req.body.affirmationEntry);
	newAffirmation
		.save()
		.then((affirmation) => res.redirect("/affirmationHome")) //res.json(goal))
		.catch((error) => console.error(error));
});

//404
app.get("*", (req, res) => {
	res.render("404", {
		title: "Error: 404 PAGE NOT FOUND",
	});
});
