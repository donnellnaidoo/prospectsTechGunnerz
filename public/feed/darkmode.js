var root = document.querySelector(":root");

const changeBg = () => {
  root.style.setProperty("--background-white", backgroundWhite);
  root.style.setProperty("--background-light", backgroundWhite);
  root.style.setProperty("--buttons-background", buttonsBackground);
  root.style.setProperty("--buttons-text", buttonsText);
  root.style.setProperty("--black", black);
};

window.onload = function () {
  var darkModeEnabled = localStorage.getItem("darkModeEnabled");
  if (darkModeEnabled === "true") {
    backgroundWhite = "black";
    backgroundLight = "hsl(252, 30%, 17%)";
    buttonsBackground = "white";
    buttonsText = "black";
    black = "white";

    changeBg();
  } else {
    backgroundWhite = "white";
    backgroundLight = "hsl(252, 30%, 95%)";
    buttonsBackground = "black";
    buttonsText = "white";
    black = "black";

    changeBg();
  }
};
