//create dialog box and buttons
$(document).ready(function () {
  $("#dialog").dialog({
    autoOpen: false,
    modal: true,
    buttons: [
      {
        text: "Confirm",
        id: "confirmDelete",
        click: function () {
          $(this).dialog("close"); //will update to record to DB
          window.location.href = "thoughtJournal.html";
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

  //open dialog box on button click
  $("#opener").click(function () {
    $("#dialog").dialog("open");
  });
});