require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moods = require("../routes/api/moods");
const Mood = require("../models/Mood");
const goals = require("../routes/api/goals");
const Goal = require("../models/Goal");
const Mantra = require("../models/Mantra");
const Affirmation = require("../models/Affirmation");
const Sleep = require("../models/Sleep");
const Entry = require("../models/Entry");
const entries = require("../routes/api/entries");
const User = require("../models/User");

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
app.use(cookieParser());

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

// //middleware authenticate token
function authenticateToken(req, res, next) {
	console.log(req.cookies);
	let authHeader = req.cookies;
	const token = authHeader.access_Token;
	console.log(token);
	if (token == null) res.redirect("/login");
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) {
			res.redirect("/login");
		}
		req.user = user;
		next();
	});
}

//Authentications

//logout
app.post("/logout", (req, res) => {
	res.clearCookie("access_Token");
	res.redirect("/login");
});

//login
app.post("/login", async (req, res) => {
	console.log(req.cookies);
	let email = req.body.email;
	console.log(email);
	User.findOne({ email: email }, async function (err, user) {
		if (user == null) {
			console.log("says null");
			res.redirect("/login");
		}
		try {
			console.log(".post trying...");
			if (await bcrypt.compare(req.body.password, user.password)) {
				console.log(await bcrypt.compare(req.body.password, user.password));
				const email = req.body.email;
				const userName = { email };
				const accessToken = generateAccessToken(userName);
				//res.clearCookies();
				//console.log(req.cookies);
				res.cookie("access_Token", accessToken, {
					expire: 600000 + Date.now(),
				});
				res.redirect("/pages/home");
			} else {
				console.log("didnt match");
				res.redirect("/login");
			}
		} catch {
			res.status(500).send();
		}
	});
});

function generateAccessToken(userName) {
	console.log("generating token");
	return jwt.sign(userName, process.env.ACCESS_TOKEN_SECRET);
}

//register user
app.post("/register", async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const newUser = new User({
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword,
		});
		newUser
			.save()
			.then((user) => res.redirect("/login"))
			.catch((error) => console.error(error));
	} catch {
		res.status(404).json({ success: false });
	}
});

//APP ROUTES
//LOADPAGE
app.get("", (req, res) => {
	res.render("index", {
		title: "Loading moodBUMP",
	});
});

//LOGINPAGE
app.get("/login", (req, res) => {
	console.log(req.cookies);
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
app.get("/pages/welcome", (req, res) => {
	res.render("welcome", {
		title: "Welcome to moodBUMP",
	});
});

//HOMEPAGE
app.get("/pages/home", authenticateToken, (req, res) => {
	Goal.find(function (err, goal) {
		let active = goal.filter((goal) => goal.status === true);
		res.render("pages/home", {
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
		.then((mood) => res.redirect("/pages/home")) //res.json(mood))
		.catch((error) => console.error(error));
});

//GOALSPAGE
app.get("/pages/goal", authenticateToken, function (req, res, next) {
	Goal.find(function (err, goal) {
		let active = goal.filter((goal) => goal.status === true);
		let inactive = goal.filter((goal) => goal.status === false);
		res.render("pages/goal", {
			title: "moodBUMP Goals",
			goals: active,
			inactive_goals: inactive,
		});
		console.log("active:" + active);
		console.log("inactive:" + inactive);
	});
});

app.post("/togglePlus", (req, res) => {
	let goal = req.body._id;
	togglePlus(goal);
	res.redirect("pages/goal");
});

function togglePlus(goal) {
	let _id = goal;
	console.log(_id);
	Goal.findByIdAndUpdate({ _id }, { status: true }, function (err, result) {
		if (err) {
			console.log(err);
			return;
		} else {
			return;
		}
	});
}

app.post("/toggleMinus", (req, res) => {
	let goal = req.body._id;
	toggleMinus(goal);
	res.redirect("pages/goal");
});

function toggleMinus(goal) {
	let _id = goal;
	console.log(_id);
	Goal.findByIdAndUpdate({ _id }, { status: false }, function (err, result) {
		if (err) {
			console.log(err);
			return;
		} else {
			return;
		}
	});
}

//custom goal
app.get("/pages/customGoal", authenticateToken, (req, res) => {
	res.render("pages/customGoal", {
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
app.get("/pages/manageGoal", authenticateToken, (req, res) => {
	Goal.find(function (err, goal) {
		res.render("pages/manageGoal", {
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
app.get("/pages/trend", authenticateToken, (req, res) => {
	res.render("pages/trend", {
		title: "moodBUMP Trends",
	});
});

//TOOLSPAGE
app.get("/pages/tools", authenticateToken, function (req, res, next) {
	Goal.find(function (err, goal) {
		let active = goal.filter((goal) => goal.status === true);
		let productivity = goal.filter((goal) => goal.name === "Productivity");
		let mindfulness = goal.filter((goal) => goal.name === "Mindfulness");
		let tools = active.filter(
			(active) =>
				active.name !== "Productivity" && active.name !== "Mindfulness"
		);
		console.log(tools);
		res.render("pages/tools", {
			title: "moodBUMP Tools",
			custom_tools: tools,
			productivity: productivity,
			mindfulness: mindfulness,
		});
	});
});

//MEDITATIONPAGE
app.get("/pages/meditation", authenticateToken, (req, res) => {
	res.render("pages/meditation", {
		title: "moodBUMP Meditation Resources",
	});
});

//MANTRAPAGE
app.get("/pages/mantraHome", authenticateToken, function (req, res, next) {
	Mantra.find(function (err, mantra) {
		console.log(mantra);
		res.render("pages/mantraHome", {
			title: "moodBUMP Mantras",
			mantras: mantra,
		});
	});
});

//custom mantra
app.get("/pages/mantraAdd", authenticateToken, (req, res) => {
	Mantra.find(function (err, mantra) {
		console.log(mantra);
		res.render("pages/mantraAdd", {
			title: "moodBUMP Mantras",
			mantras: mantra,
		});
	});
});

//add mantra
app.post("/pages/addMantra", (req, res) => {
	const newMantra = new Mantra({
		mantraEntry: req.body.mantraEntry,
	});
	console.log(req.body.mantraEntry);
	newMantra
		.save()
		.then((mantra) => res.redirect("/pages/mantraHome")) //res.json(goal))
		.catch((error) => console.error(error));
});

//THOUGHT JOURNAL PAGE
app.get("/pages/thoughtJournal", authenticateToken, (req, res) => {
	Entry.find(function (err, entry) {
		res.render("pages/thoughtJournal", {
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
		.then((entry) => res.redirect("/pages/thoughtJournal")) //res.json(goal))
		.catch((error) => console.error(error));
});

//THOUGHT JOURNAL ENTRY
app.post("/getEntry", (req, res) => {
	//console.log(req.body._id);
	Entry.find(function (err, entry) {
		const found = entry.filter((entry) => entry._id == req.body._id);
		if (found) {
			//console.log("true");
			res.render("pages/thoughtJournalEntry", {
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
		.then((entry) =>
			entry.remove().then(() => res.redirect("/pages/thoughtJournal"))
		)
		.catch((err) => res.status(404).json({ success: false }));
});

//SLEEPLOGPAGE
app.get("/pages/sleepLog", authenticateToken, (req, res) => {
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
		.then((sleep) => res.redirect("/pages/sleepLog")) //res.json(goal))
		.catch((error) => console.error(error));
});

//PWOERHOURPAGE
app.get("/pages/powerHour", authenticateToken, (req, res) => {
	res.render("pages/powerHour", {
		title: "moodBUMP Power Hour",
	});
});

//AFFIRMATIONPAGE
app.get("/pages/affirmationHome", authenticateToken, function (req, res, next) {
	Affirmation.find(function (err, affirmation) {
		console.log(affirmation);
		res.render("pages/affirmationHome", {
			title: "moodBUMP Affirmations",
			affirmations: affirmation,
		});
	});
});

//custom affirmation
app.get("/pages/affirmationAdd", authenticateToken, (req, res) => {
	Affirmation.find(function (err, affirmation) {
		console.log(affirmation);
		res.render("pages/affirmationAdd", {
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
		.then((affirmation) => res.redirect("/pages/affirmationHome")) //res.json(goal))
		.catch((error) => console.error(error));
});

//404
app.get("*", authenticateToken, (req, res) => {
	res.render("404", {
		title: "Error: 404 PAGE NOT FOUND",
	});
});
