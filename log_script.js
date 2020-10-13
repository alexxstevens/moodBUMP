$(document).ready(function () {
  function setDate() {
    let now = new Date();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let year = now.getFullYear();
    let date = year + "-" + month + "-" + day;
    return date;
  }

  function fillDate() {
    let date = setDate();
    //update subNote"Last recorded on:
    document.getElementById("sleepDate").setAttribute("max", date);
    console.log(date);
  }

  fillDate();
});
