const express = require("express");
const router = express.Router();

//Mood Model
const Mantra = require("../../models/Mantra");

//@route GET api/goals
//@desc get All goals
router.get("/", (req, res) => {
	Mantra.find()
		.sort({ mantraEntry: -1 }) //ascending
		.then((mantra) => res.json(mantra));
});

//@route POST api/goals
//@desc post goals
router.post("/", (req, res) => {
	const newMantra = new Mantra({
		mantraEntry: req.body.mantraEntry,
	});
	newMantra.save().then((mantra) => res.json(mantra));
});

//@route DELETE api/goals/id
//@desc delete goal
router.delete("/:id", (req, res) => {
	Mantra.findById(req.params.id)
		.then((mantra) => mantra.remove().then(() => res.json({ success: true })))
		.catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
