"use strict";
//DIALOG OPTIONS - CONFIRM ADD (HOME-MOOD LOG)
$(function () {
	$("#dialog").dialog({
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: "Confirm",
				id: "confirmMood",
				click: function () {
					setRecord();
					$(this).dialog("close"); //will update to record to DB
				},
			},
			{
				text: "Cancel",
				click: function () {
					$(this).dialog("close");
				},
			},
		],
	});

	//OPEN DIALOG BOX
	$("#opener").click(function () {
		$("#dialog").dialog("open");
	});

	//SET SLIDER DISPLAY VALUE
	let slider = document.getElementById("moodValue");
	let output = document.getElementById("moodScale");
	output.innerHTML = slider.value; // Display the default slider value

	//SET RECORDED MOOD VALUE
	let moodValue = document.getElementById("moodValue").value;

	//GET LAST RECORD DATE
	function setDate() {
		const now = new Date();
		const date =
			now.getMonth() + 1 + "/" + now.getDate() + "/" + now.getFullYear();
		return date;
	}

	//GET LAST RECORD TIME
	function setTime() {
		const now = new Date();
		let time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
		return time;
	}

	//SET LAST RECORD TIMESTAMP
	function setRecord() {
		let date = setDate();
		let time = setTime();
		let lastRecord = date + " " + time;
		//update subNote"Last recorded on:
		document.getElementById("subNote").innerHTML =
			"Last recorded on: " + lastRecord;
		console.log(lastRecord);
	}

	//FILL MOODVALUE IN
	document.getElementById("dialog").innerHTML =
		"Are your sure you want to record the mood score: " + moodValue;

	// UPDATE VALYE
	slider.oninput = function () {
		output.innerHTML = this.value;
		let moodValue = document.getElementById("moodValue").value;
		document.getElementById("dialog").innerHTML =
			"Are your sure you want to record the mood score: " + moodValue;
	};
});
