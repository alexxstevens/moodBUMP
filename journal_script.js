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

  //set date
  function setDate() {
    const now = new Date();
    const date =
      now.getMonth() + 1 + "/" + now.getDate() + "/" + now.getFullYear();
    return date;
  }

  function setTime() {
    const now = new Date();
    let time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    return time;
  }

  function setRecord() {
    let date = setDate();
    let time = setTime();
    lastRecord = date + " " + time;
    //update subNote"Last recorded on:
    document.getElementById("subNote").innerHTML =
      "Last recorded on: " + lastRecord;
    console.log(lastRecord);
  }

  //fill dialog box for set input value
  document.getElementById("dialog").innerHTML =
    "Are your sure you want to record the mood score: " + moodValue;

  //set date
  function setDate() {
    const now = new Date();
    const date =
      now.getMonth() + 1 + "/" + now.getDate() + "/" + now.getFullYear();
    return date;
  }

  function setTime() {
    const now = new Date();
    let time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    return time;
  }

  document.getElementById("date").innerHTML = "Today, " + setDate();
});
