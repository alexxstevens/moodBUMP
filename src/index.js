require("dotenv").config();
require("dotenv").config({ path: "variables.env" });
const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const webPush = require("web-push");
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

const router = require("../routes/routes");

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
app.use(bodyParser.json());

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

//use router
app.use("/", router);

//generate vapid keys
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webPush.setVapidDetails(
	"mailto:test@test.com",
	publicVapidKey,
	privateVapidKey
);

//subscribe to route
app.post("/subscribe", (req, res) => {
	const subscription = req.body;

	res.status(201).json({});

	const payload = JSON.stringify({
		title: "A message from your moodBUMPER:",
	});
	//pass into sendnotification
	webPush
		.sendNotification(subscription, payload)
		.catch((error) => console.error(error));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
