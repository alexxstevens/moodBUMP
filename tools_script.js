//HOME BASE SCRIPT
//create dialog box and buttons
$(document).ready(function () {
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
