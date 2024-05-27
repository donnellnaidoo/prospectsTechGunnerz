// SIDEBAR
const menuItems = document.querySelectorAll(".menu-item");
//THEME
const theme = document.querySelector("#theme");
const themeBlock = document.querySelector("#themeBlock");
var root = document.querySelector(":root");
const bg1 = document.querySelector(".bg-1");
const bg2 = document.querySelector(".bg-2");
const h2 = document.getElementsByTagName("h2");
const h3 = document.getElementsByTagName("h3");
const h4 = document.getElementsByTagName("h4");
const h5 = document.getElementsByTagName("h5");
const h6 = document.getElementsByTagName("h6");

//REMOVE ACTIVE CLASS FROM ALL MENU ITEMS

const changeActiveItem = () => {
  menuItems.forEach((item) => {
    item.classList.remove("active");
  });
};

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    changeActiveItem();
    item.classList.add("active");
  });
});

// THEME CUSTOMIZATION
const showBlock = () => {
  themeBlock.style.display = "grid";
};
const closeTheme = (e) => {
  if (e.target.classList.contains("customize-theme")) {
    e.target.style.display = "none";
  }
};
themeBlock.addEventListener("click", closeTheme);

theme.addEventListener("click", showBlock);

//BACKGROUND
let backgroundWhite;
let backgroundLight;
let buttonsBackground;
let buttonsText;
let black;

const changeBg = () => {
  root.style.setProperty("--background-white", backgroundWhite);
  root.style.setProperty("--background-light", backgroundWhite);
  root.style.setProperty("--buttons-background", buttonsBackground);
  root.style.setProperty("--buttons-text", buttonsText);
  root.style.setProperty("--black", black);
};

//BACKGROUND DARK
bg2.addEventListener("click", (e) => {
  e.preventDefault();
  backgroundWhite = "black";
  backgroundLight = "hsl(252, 30%, 17%)";
  buttonsBackground = "white";
  buttonsText = "black";
  black = "white";

  let savedDark = true;
  localStorage.setItem("darkModeEnabled", savedDark);

  changeBg();
});

bg1.addEventListener("click", (e) => {
  e.preventDefault();
  backgroundWhite = "white";
  backgroundLight = "hsl(252, 30%, 95%)";
  buttonsBackground = "black";
  buttonsText = "white";
  black = "black";

  let savedDark = false;
  localStorage.setItem("darkModeEnabled", savedDark);

  changeBg();
});

//LOAD FUNCTION FOR THEME
window.onload = function () {

  window.scrollTo(0, 0);
  //scroll function


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

// // MESSAGE CLICK
// const message = document.getElementById("messages");
// message.addEventListener("click", (e) => {
//   e.preventDefault();
//   window.location.href = "localhost:5000/messaging";
// });
document.addEventListener('DOMContentLoaded', function() {
  const createButton = document.getElementById('create');
  const modal = document.getElementById('createPostModal');
  const closeButton = document.querySelector('.modal .close');
  const createPostForm = document.getElementById('createPostForm');
  const postImageInput = document.getElementById('postImage');
  const imagePreview = document.getElementById('imagePreview');
  const imagePreviewImage = document.querySelector('.image-preview__image');
  const imagePreviewDefaultText = document.querySelector('.image-preview__default-text');

  createButton.addEventListener('click', function() {
    modal.style.display = 'block';
  });

  closeButton.addEventListener('click', function() {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  postImageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      imagePreviewDefaultText.style.display = 'none';
      imagePreviewImage.style.display = 'block';

      reader.addEventListener('load', function() {
        imagePreviewImage.setAttribute('src', this.result);
      });

      reader.readAsDataURL(file);
    } else {
      imagePreviewDefaultText.style.display = 'block';
      imagePreviewImage.style.display = 'none';
      imagePreviewImage.setAttribute('src', '');
    }
  });

  createPostForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const postContent = document.getElementById('postContent').value;
    const postImage = postImageInput.files[0];
    const formData = new FormData();

    formData.append('postContent', postContent);
    if (postImage) {
      formData.append('postImage', postImage);
    }

    fetch('/createPost', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.text())
      .then(data => {
        console.log(data);

        // Clear the form and hide the modal
        createPostForm.reset();
        imagePreviewDefaultText.style.display = 'block';
        imagePreviewImage.style.display = 'none';
        imagePreviewImage.setAttribute('src', '');
        modal.style.display = 'none';
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
});


function toggleMenu(icon) {
  const menu = icon.nextElementSibling;
  if (menu.style.display === "block") {
    menu.style.display = "none";
  } else {
    menu.style.display = "block";
  }
}

// Close the menu if clicked outside
document.addEventListener('click', function(event) {
  const menus = document.querySelectorAll('.menu-content');
  menus.forEach(menu => {
    if (!menu.contains(event.target) && !menu.previousElementSibling.contains(event.target)) {
      menu.style.display = 'none';
    }
  });
});

// Training Centre
