const authButton =
  document.getElementById("register") || document.getElementById("login");
const forgotpass = document.getElementById("forgot-password");
window.addEventListener("DOMContentLoaded", () => {
  const pageUrl = window.location.href;
  const page = pageUrl.split("/");
  const authPage = page[page.length - 1].split(".")[0];
  if (authPage == "register") {
    authButton.addEventListener("click", addUser);
  } else {
    authButton.addEventListener("click", getUser);
    forgotpass.addEventListener("click", changepass);
  }
});

function changepass() {
  // console.log("oke lets c");
  document.getElementsByClassName("form-forgotpass")[0].classList.add("active");
  document
    .getElementsByClassName("form-exit")[0]
    .addEventListener("click", () => {
      document
        .getElementsByClassName("form-forgotpass")[0]
        .classList.remove("active");
    });
  document.getElementById("change-pass").addEventListener("click", newpass);
}

async function newpass(e) {
  e.preventDefault();
  const forgotemail = document.getElementById("forgotemail").value;
  // console.log("he pressed it ");
  const result = await axios.post("http://localhost:3000/forgotpass", {
    email: forgotemail,
  });
  console.log(result);
  if (result.data.link) {
    // alert(`pass link = ${result.data.link}`);
    var a = document.createElement("a");
    a.href = result.data.link;
    a.click();
  }
}

async function addUser(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (!username || !email || !password) {
    //console.log("input required");
    sendMessage("input required");
    return false;
  }
  try {
    const result = await axios.post("http://localhost:3000/postUser", {
      username,
      email,
      password,
    });
    // console.log(result.data);
    if (!result.data.msg) {
      sendMessage("check email");
      return;
    }
    // console.log(result.data);
    window.location.href =
      "file:///C:/Users/roshi/Desktop/backendSharpener/expenseTracker/frontEnd/login.html";
    return;
  } catch (err) {
    console.log(err);
    return;
  }
}

async function getUser(e) {
  e.preventDefault();
  const loginbtn = document.getElementById("login");
  // console.log(loginbtn);
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  // console.log(window.location);

  if (!email || !password) {
    sendMessage("input required");
    return false;
  }
  try {
    const result = await axios.post("http://localhost:3000/getUser", {
      email,
      password,
    });
    // console.log(result);
    sendMessage(result.data.msg);
    localStorage.setItem("token", result.data.token);
    window.location.href =
      "file:///C:/Users/roshi/Desktop/backendSharpener/expenseTracker/frontEnd/home.html";
    // console.log(result.data);

    return;
  } catch (err) {
    console.log(err);
    sendMessage("password wrong!");
    return true;
  }
}

function sendMessage(msg) {
  const panelContainer = document.getElementsByClassName("panel-container")[0];
  const message = document.createElement("div");
  message.className = "message";
  message.innerHTML = `<h1>${msg}</h1`;
  panelContainer.appendChild(message);
  //console.log(panelContainer);
  setTimeout(() => {
    message.remove();
  }, 2000);
}
