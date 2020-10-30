const express = require("express");
const router = express.Router();

//Mood Model
const Entry = require("../../models/Entry");

//@route GET api/goals
//@desc get All goals
router.get("/", (req, res) => {
	Entry.find()
		.sort({ name: -1 }) //ascending
		.then((entry) => res.json(entry));
});

//@route POST api/goals
//@desc post goals
router.post("/", (req, res) => {
	const newEntry = new Entry({
		journalEntry: req.body.journalEntry,
		date: req.body.date,
	});
	newEntry.save().then((entry) => res.json(entry));
});

//@route DELETE api/goals/id
//@desc delete goal
router.delete("/:id", (req, res) => {
	Entry.findById(req.params._id)
		.then((entry) => entry.remove().then(() => res.json({ success: true })))
		.catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
