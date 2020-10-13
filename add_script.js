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
  $("#opener_1").click(function () {
    $("#dialog").dialog("open");
  });

  //open dialog box on button click
  $("#opener_2").click(function () {
    $("#dialog").dialog("open");
  });
});
