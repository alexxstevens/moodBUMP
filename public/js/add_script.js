"use strict";
//DIALOG OPTIONS - CONFIRM DELETE (MANTRA/AFFIRMATION)
$(function () {
	$("#dialog").dialog({
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: "Confirm",
				id: "confirmDelete",
				click: function () {
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
	$("#opener_1").click(function () {
		$("#dialog").dialog("open");
	});

	//OPEN DIALOG BOX
	$("#opener_2").click(function () {
		$("#dialog").dialog("open");
	});
});
