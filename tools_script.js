//HELP SCRIPT (TOOLS AND CUSTOM GOAL)
"use strict";
$(function () {
	$("#dialog").dialog({
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: "OK",
				id: "return",
				click: function () {
					$(this).dialog("close"); //will update to record to DB
				},
			},
		],
	});

	//open dialog box on button click
	$("#opener").click(function () {
		$("#dialog").dialog("open");
	});
});
