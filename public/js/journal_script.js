"use strict";
//DIALOG OPTIONS - CONFIRM DELETE (JOURNAL)
$(function () {
	$("#dialog").dialog({
		autoOpen: false,
		modal: true,
		buttons: [
			{
				text: "Confirm",
				id: "confirmDelete",
				click: function () {
					$("#deleteJournalForm").submit(); //confirm entry delete
					res.redirect("/thoughtJournal");
				},
			},
			{
				text: "Cancel",
				click: function () {
					$(this).dialog("close"); //cancel delete
				},
			},
		],
	});

	//OPEN DIALOG BOX
	$("#opener").click(function () {
		$("#dialog").dialog("open");
	});
});
