const express = require("express");
const router = express.Router();

//Mood Model
const Sleep = require("../../models/Sleep");

//@route GET api/goals
//@desc get All goals
router.get("/", (req, res) => {
	Sleep.find()
		.sort({ date: -1 }) //ascending
		.then((sleep) => res.json(sleep));
});

//@route POST api/goals
//@desc post goals
router.post("/", (req, res) => {
	const newSleep = new Sleep({
		date: req.body.date,
		hours: req.body.hours,
		quality: req.body.quality,
	});
	newSleep.save().then((sleep) => res.json(sleep));
});

//@route DELETE api/goals/id
//@desc delete goal
router.delete("/:id", (req, res) => {
	Sleep.findById(req.params._id)
		.then((sleep) => entry.remove().then(() => res.json({ success: true })))
		.catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
