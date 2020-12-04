const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const router = express.Router();
const mcache = require("memory-cache");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Goal = require("../models/Goal");
const Tracking = require("../models/Tracking");

//middleware function cache
let cache = (duration) => {
	return (req, res, next) => {
		let key = "_express_" + req.soriginalUrl || req.originalUrl;
		let cachedBody = mcache.get(key);
		if (cachedBody) {
			res.send(cachedBody);
			return;
		} else {
			res.sendResponse = res.send;
			res.send = (body) => {
				mcache.put(key, body, duration * 1000);
				res.sendResponse(body);
			};
			next();
		}
	};
};

// //middleware authenticate token
function authenticateToken(req, res, next) {
	let authHeader = req.cookies;
	const token = authHeader.access_Token;
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
//login
router.post("/login", async (req, res) => {
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

//generate user token
function generateAccessToken(userName) {
	console.log("generating token");
	return jwt.sign(userName, process.env.ACCESS_TOKEN_SECRET);
}

//logout
router.post("/logout", (req, res) => {
	res.clearCookie("access_Token");
	res.redirect("/login");
});

//register user
router.post("/register", async (req, res) => {
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

//router ROUTES
//LOADPAGE
router.get("", cache(10), (req, res) => {
	res.render("index", {
		title: "Loading moodBUMP",
	});
});

//LOGINPAGE
router.get("/login", cache(10), (req, res) => {
	console.log(req.cookies);
	res.render("login", {
		title: "Login to moodBUMP",
	});
});

//LOGOUTPAGE
router.get("/logout", authenticateToken, cache(10), (req, res) => {
	res.render("logout", {
		title: "Logout of moodBUMP",
	});
});

//WELCOMEPAGE
router.get("/pages/welcome", authenticateToken, cache(10), (req, res) => {
	res.render("welcome", {
		title: "Welcome to moodBUMP",
	});
});

//HOMEPAGE
router.get("/pages/home", authenticateToken, (req, res) => {
	Goal.find(function (err, goal) {
		let active = goal.filter((goal) => goal.status === true);
		res.render("pages/home", {
			title: "moodBUMP",
			goals: active,
		});
	});
});
//log mood
router.post("/moods", (req, res) => {
	const newMood = new Mood({
		mood_value: req.body.mood_value,
	});
	newMood
		.save()
		.then((mood) => res.redirect("/pages/home")) //res.json(mood))
		.catch((error) => console.error(error));
});

//GOALSPAGE
router.get("/pages/goal", authenticateToken, function (req, res, next) {
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

//toggle goal to active goals
router.post("/togglePlus", (req, res) => {
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

//toggle goals to inactive = quickadd
router.post("/toggleMinus", (req, res) => {
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
router.get("/pages/customGoal", authenticateToken, cache(10), (req, res) => {
	res.render("pages/customGoal", {
		title: "Add Custom Goal",
	});
});

//add goal
router.post("/addGoal", (req, res) => {
	const newGoal = new Goal({
		name: req.body.name,
		tool_1: req.body.tool_1,
		tool_2: req.body.tool_2,
		tool_3: req.body.tool_3,
		status: true,
	});
	newGoal
		.save()
		.then((goal) => res.redirect("/pages/goal")) //res.json(goal))
		.catch((error) => console.error(error));
});

//MANAGEGOALS PAGE
router.get("/pages/manageGoal", authenticateToken, (req, res) => {
	Goal.find(function (err, goal) {
		res.render("pages/manageGoal", {
			title: "moodBUMP Manage Goals",
			goals: goal,
		});
	});
});

//delete goal
router.post("/deleteGoal", (req, res) => {
	console.log("activated");
	console.log(req.body);
	Goal.findById(req.body._id)
		.then((goal) => goal.remove().then(() => res.redirect("/pages/manageGoal")))
		.catch((err) => res.status(404).json({ success: false }));
});

//TRENDPAGE;
router.get("/pages/trend", authenticateToken, (req, res) => {
	res.render("pages/trend", {
		title: "moodBUMP Trends",
	});
});

//TOOLSPAGE
router.get(
	"/pages/tools",
	authenticateToken,
	cache(10),
	function (req, res, next) {
		Goal.find(function (err, goal) {
			let active = goal.filter(
				(goal) =>
					goal.status === true &&
					goal.name !== "Productivity" &&
					goal.name !== "Mindfulness"
			);
			let productivity = goal.filter(
				(goal) => goal.name === "Productivity" && goal.status === true
			);
			let mindfulness = goal.filter(
				(goal) => goal.name === "Mindfulness" && goal.status === true
			);
			let tools = active.filter(
				(active) =>
					active.name !== "Productivity" && active.name !== "Mindfulness"
			);
			Tracking.find(function (err, tracking) {
				let dateObj = new Date();
				let month = dateObj.getUTCMonth() + 1; //months from 1-12
				let day = dateObj.getUTCDate();
				let year = dateObj.getUTCFullYear();
				let today = month + "-" + day + "-" + year;
				console.log(today);
				let tracked = tracking.filter((tracking) => tracking.date === today);
				console.log(tracked);
				res.render("pages/tools", {
					title: "moodBUMP Tools",
					goal: active,
					custom_tools: tools,
					productivity: productivity,
					mindfulness: mindfulness,
					tracked: tracked,
				});
			});
		});
	}
);

//track tool completion
router.post("/toolTrack", function (req, res, next) {
	let toolName = req.body.toolName;
	let goal = req.body.goal;
	console.log(toolName + ", " + goal);
	let dateObj = new Date();
	let month = dateObj.getUTCMonth() + 1; //months from 1-12
	let day = dateObj.getUTCDate();
	let year = dateObj.getUTCFullYear();
	let date = month + "-" + day + "-" + year;
	console.log(date);
	const newTracking = new Tracking({
		date: date,
		toolName: toolName,
		goal: goal,
	});
	newTracking
		.save()
		.then((tracking) => res.redirect("/pages/tools"))
		.catch((error) => console.error(error));
});

//MEDITATIONPAGE
router.get("/pages/meditation", authenticateToken, cache(10), (req, res) => {
	res.render("pages/meditation", {
		title: "moodBUMP Meditation Resources",
	});
});

//MANTRAPAGE
router.get("/pages/mantraHome", authenticateToken, function (req, res, next) {
	Mantra.find(function (err, mantra) {
		console.log(mantra);
		res.render("pages/mantraHome", {
			title: "moodBUMP Mantras",
			mantras: mantra,
		});
	});
});

//custom mantra
router.get("/pages/mantraAdd", authenticateToken, (req, res) => {
	Mantra.find(function (err, mantra) {
		console.log(mantra);
		res.render("pages/mantraAdd", {
			title: "moodBUMP Mantras",
			mantras: mantra,
		});
	});
});

//add mantra
router.post("/addMantra", (req, res) => {
	const newMantra = new Mantra({
		mantraEntry: req.body.mantraEntry,
	});
	console.log(req.body.mantraEntry);
	newMantra
		.save()
		.then((mantra) => res.redirect("/pages/mantraHome")) //res.json(goal))
		.catch((error) => console.error(error));
});

//delete mantra
router.post("/deleteMantra", (req, res) => {
	console.log("ID IS" + req.body._id);
	Mantra.findById(req.body._id)
		.then((entry) =>
			entry.remove().then(() => res.redirect("/pages/mantraHome"))
		)
		.catch((err) => res.status(404).json({ success: false }));
});

//THOUGHT JOURNAL PAGE
router.get("/pages/thoughtJournal", authenticateToken, (req, res) => {
	Entry.find(function (err, entry) {
		res.render("pages/thoughtJournal", {
			title: "moodBUMP Thought Journal",
			entries: entry,
		});
	});
});

//add journal entry
router.post("/addEntry", (req, res) => {
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
router.post("/getEntry", (req, res) => {
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
router.post("/deleteEntry", (req, res) => {
	console.log("activated");
	console.log(req.body);
	Entry.findById(req.body._id)
		.then((entry) =>
			entry.remove().then(() => res.redirect("/pages/thoughtJournal"))
		)
		.catch((err) => res.status(404).json({ success: false }));
});

//SLEEPLOGPAGE
router.get("/pages/sleepLog", authenticateToken, (req, res) => {
	res.render("pages/sleepLog", {
		title: "moodBUMP Sleep Log",
	});
});

//log sleep
router.post("/logSleep", cache(10), (req, res) => {
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
router.get("/pages/powerHour", authenticateToken, cache(10), (req, res) => {
	res.render("pages/powerHour", {
		title: "moodBUMP Power Hour",
	});
});

//AFFIRMATIONPAGE
router.get(
	"/pages/affirmationHome",
	authenticateToken,
	function (req, res, next) {
		Affirmation.find(function (err, affirmation) {
			console.log(affirmation);
			res.render("pages/affirmationHome", {
				title: "moodBUMP Affirmations",
				affirmations: affirmation,
			});
		});
	}
);

//custom affirmation
router.get(
	"/pages/affirmationAdd",
	authenticateToken,
	cache(10),
	(req, res) => {
		Affirmation.find(function (err, affirmation) {
			console.log(affirmation);
			res.render("pages/affirmationAdd", {
				title: "moodBUMP affirmation",
				affirmations: affirmation,
			});
		});
	}
);

//add affirmation
router.post("/addAffirmation", (req, res) => {
	const newAffirmation = new Affirmation({
		affirmationEntry: req.body.affirmationEntry,
	});
	console.log(req.body.affirmationEntry);
	newAffirmation
		.save()
		.then((affirmation) => res.redirect("/pages/affirmationHome")) //res.json(goal))
		.catch((error) => console.error(error));
});

//delete affirmation
router.post("/deleteAffirmation", (req, res) => {
	Affirmation.findById(req.body._id)
		.then((entry) =>
			entry.remove().then(() => res.redirect("/pages/affirmationHome"))
		)
		.catch((err) => res.status(404).json({ success: false }));
});

//404
router.get("*", authenticateToken, (req, res) => {
	res.render("404", {
		title: "Error: 404 PAGE NOT FOUND",
	});
});

module.exports = router;
