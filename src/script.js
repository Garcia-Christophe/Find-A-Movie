function connection() {
  let login = document.getElementById("login").value;
  let mdp = document.getElementById("passwd").value;
  $.ajax({
    method: "post",
    url: "login",
    data: {
      login: login,
      passwd: mdp,
    },
    dataType: "json",
    success: function (data) {
      // message à afficher

      if (data.res) {
        document.getElementById("mess").textContent = "connecté";
        document.getElementById("mess").style = "color: green";
        document.getElementById("connection").hidden = true;
        document.getElementById("connecte").hidden = false;
        sessionStorage.setItem("login", data.login);
        getFavori();
      } else {
        document.getElementById("mess").textContent = "non connecté";
        document.getElementById("mess").style = "color: red";
      }
    },
  });
}

function signup() {
  let name = document.getElementById("name").value;
  let mdp = document.getElementById("passwd").value;
  $.ajax({
    method: "post",
    url: "add_user",
    data: {
      login: name,
      passwd: mdp,
    },
    dataType: "json",
    success: function (data) {
      console.log("succes");
      document.location.href = "/html/signin.html";
    },
  });
}

function getFavori() {
  $.ajax({
    method: "post",
    url: "get_favori",
    data: {
      login: sessionStorage.getItem("login"),
    },
    dataType: "json",
    success: function (data) {
      let listFavori = document.getElementById("favoris");
      listFavori.innerHTML = "";
      data.listFavori.map((favori) => {
        let li = document.createElement("li");
        li.innerText = favori.idfilm;
        li.id = favori.idfilm;
        let button = document.createElement("button");
        button.innerText = "suppr";
        button.addEventListener("click", () => {
          sessionStorage.setItem("film", favori.idfilm);
          delFavori();
        });
        li.appendChild(button);
        listFavori.appendChild(li);
      });
    },
  });
}

function addFavori() {
  let film = document.getElementById("add").value;
  $.ajax({
    method: "post",
    url: "add_favori",
    data: {
      login: sessionStorage.getItem("login"),
      idFilm: film,
    },
    dataType: "json",
    success: function (data) {
      getFavori();
    },
  });
}

function delFavori() {
  $.ajax({
    method: "post",
    url: "del_favori",
    data: {
      login: sessionStorage.getItem("login"),
      idFilm: sessionStorage.getItem("film"),
    },
    dataType: "json",
    success: function (data) {
      sessionStorage.removeItem("film");
      getFavori();
    },
  });
}

function modifPasswd() {
  $.ajax({
    method: "post",
    url: "modif_passwd",
    data: {
      login: sessionStorage.getItem("login"),
      passwd: document.getElementById("modif_passwd").value,
    },
    dataType: "json",
    success: function (data) {
      console.log("modifier");
    },
  });
}

function deconnection() {
  document.getElementById("connection").hidden = false;
  document.getElementById("connecte").hidden = true;
  sessionStorage.removeItem("login");
}

sessionStorage.clear();
