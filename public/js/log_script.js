"use strict";
//GET DATE (SLEEP LOG)
$(function () {
	function setDate() {
		let now = new Date();
		let month = now.getMonth() + 1;
		let day = now.getDate();
		let year = now.getFullYear();
		if (day < 10) day = "0" + day;
		let date = year + "-" + month + "-" + day;
		return date;
	}

	//FILL DATE IN CALENDAR MAX
	function fillDate() {
		let date = setDate();
		//update subNote"Last recorded on:
		document.getElementById("sleepDate").setAttribute("max", date);
		console.log(date);
	}

	fillDate();
});
