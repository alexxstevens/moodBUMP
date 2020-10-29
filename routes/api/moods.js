const express = require("express");
const router = express.Router();

//Mood Model
const Mood = require("../../models/Mood");

//@route GET api/moods
//@desc get All moods
router.get("/", (req, res) => {
	Mood.find()
		.sort({ date: -1 }) //ascending
		.then((mood) => res.json(mood));
});

//@route POST api/moods
//@desc post mood
router.post("/", (req, res) => {
	const newMood = new Mood({
		mood_value: req.body.mood_value,
	});
	newMood.save().then((mood) => res.json(mood));
});

//@route DELETE api/moods/:id
//@desc delete mood
router.delete("/:id", (req, res) => {
	Mood.findById(req.params.id)
		.then((mood) => mood.remove().then(() => res.json({ success: true })))
		.catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
