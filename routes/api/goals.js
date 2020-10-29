const express = require("express");
const router = express.Router();

//Mood Model
const Goal = require("../../models/Goal");

//@route GET api/goals
//@desc get All goals
router.get("/", (req, res) => {
	Goal.find()
		.sort({ name: -1 }) //ascending
		.then((goal) => res.json(goal));
});

//@route POST api/goals
//@desc post goals
router.post("/", (req, res) => {
	const newGoal = new Goal({
		name: req.body.name,
		tool_1: req.body.tool_1,
		tool_2: req.body.tool_2,
		tool_3: req.body.tool_3,
		status: req.body.status,
	});
	newGoal.save().then((goal) => res.json(goal));
});

//@route DELETE api/goals/id
//@desc delete goal
router.delete("/:id", (req, res) => {
	Goal.findById(req.params.id)
		.then((goal) => goal.remove().then(() => res.json({ success: true })))
		.catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
