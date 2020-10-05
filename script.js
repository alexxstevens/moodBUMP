//HOME BASE SCRIPT
//create dialog box and buttons
$(document).ready(function () {
  $("#dialog").dialog({
    autoOpen: false,
    modal: true,
    buttons: [
      {
        text: "Confirm",
        id: "confirmMood",
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
  $("#opener").click(function () {
    $("#dialog").dialog("open");
  });

  //set slider value display in UI
  let slider = document.getElementById("moodValue");
  let output = document.getElementById("moodScale");
  output.innerHTML = slider.value; // Display the default slider value

  //set moodValue
  let moodValue = document.getElementById("moodValue").value;

  //set date
  function setDate() {
    const now = new Date();
    const date =
      now.getUTCMonth() +
      1 +
      "/" +
      now.getUTCDate() +
      "/" +
      now.getUTCFullYear();
    return date;
  }

  function setTime() {
    const now = new Date();
    let time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    return time;
  }

  //fill dialog box for set input value
  document.getElementById("dialog").innerHTML =
    "Are your sure you want to record the mood score: " +
    moodValue +
    " on " +
    setDate() +
    " at " +
    setTime();

  // update the input value on slide; fill dialog box for updated input value
  slider.oninput = function () {
    output.innerHTML = this.value;
    let moodValue = document.getElementById("moodValue").value;
    document.getElementById("dialog").innerHTML =
      "Are your sure you want to record the mood score: " +
      moodValue +
      " on " +
      setDate() +
      " at " +
      setTime();
  };

  //submit mood value
  $(document).ready(function () {
    $("#confirmMood").click(function () {
      $("#moodForm").submit(); // Submit the form
    });
  });
});
