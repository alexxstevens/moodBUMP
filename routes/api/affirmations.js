const express = require("express");
const router = express.Router();

//Mood Model
const Affirmation = require("../../models/Affirmation");

//@route GET api/goals
//@desc get All goals
router.get("/", (req, res) => {
	Affirmation.find()
		.sort({ affirmationEntry: -1 }) //ascending
		.then((affirmation) => res.json(affirmation));
});

//@route POST api/goals
//@desc post goals
router.post("/", (req, res) => {
	const newAffirmation = new Affirmation({
		affirmationEntry: req.body.affirmationEntry,
	});
	newAffirmation.save().then((affirmation) => res.json(affirmation));
});

//@route DELETE api/goals/id
//@desc delete goal
router.delete("/:id", (req, res) => {
	Affirmation.findById(req.params.id)
		.then((affirmation) =>
			affirmation.remove().then(() => res.json({ success: true }))
		)
		.catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
