const express = require('express') // chargement du module express
const database = require('./database')
const util = require("util");

var app = express();
app.use("/", express.static("..", { index: 'html/index.html' }))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

var server = app.listen(3000, function () {
    console.log('Express server listening on port 3000')
});

app.post("/html/login", function (req, res) {

    new Promise((resolve, reject) => {
        database.getUsers(resolve, reject)
    }).then((data) => {
        let login = req.body.login;
        let passwd = req.body.passwd;
        let found = false;
        data.rows.map(user => {
            if (user.login === login && user.password === passwd) {
                found = true;
            }
        })
        res.send({res : found, login : login})
    })
})

app.post("/html/get_favori", function(req, res) {
    new Promise((resolve, reject) => {
        database.getFavori(req.body.login, resolve, reject);
    }).then((data) => {
        data.rows.map(favori => {
        })
        res.send({listFavori : data.rows});
    })
})

app.post("/html/del_favori", function(req, res) {
    new Promise((resolve, reject) => {
        database.delFavori(req.body.login, req.body.idFilm, resolve, reject);
    }).then((data) => {
        res.send({});
    })
})

app.post("/html/add_favori", function(req, res) {
    new Promise((resolve, reject) => {
        database.addFavori(req.body.login, req.body.idFilm, resolve, reject);
    }).then((data) => {
        res.send({});
    })
})

app.post("/html/modif_passwd", function(req, res) {
    new Promise((resolve, reject) => {
        database.updateUserPasswd(req.body.login, req.body.passwd, resolve, reject);
    }).then((data) => {
        res.send({});
    })
})