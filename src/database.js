const pg = require('pg');

const conString = "postgres://rwvzheny:GQskCZGhvKWErBn4N-XvZ-MaVFF0wbAm@hattie.db.elephantsql.com/rwvzheny";


function getUsers(resolve, reject){
    var client = new pg.Client(conString);
    var listUser = [];
    client.connect(function(err) {
        if (err) {
            reject(err);
        }
        client.query('SELECT * FROM public.user', function (err, result) {
            if (err) {
                reject('error running query', err);
            }
            resolve(result);
            client.end();
        });
    });
    console.log(listUser)
}
function addUser(login, passwd) {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query("insert into public.user (login, password) values ('" + login + "', '" + passwd + "')", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            client.end();
        });
    });
}

function delUser(login) {
    var client = new pg.Client(conString);
    client.connect(function (err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }
        client.query("delete from public.user where login='" + login + "'", function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }
            client.end();
        });
    });
}

function updateUserPasswd(login, passwd) {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query("update public.user set password='" + passwd +"' where login='" + login + "'", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            client.end();
        });
    });
}

function getFavori(login, resolve, reject){
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query("select * from public.favoris where iduser='" + login +"'", function(err, result) {
            if(err) {
                reject(err);
            }
            resolve(result)
            client.end();
        });
    });
}

//addUser("test", "passwd")
//updateUserPasswd("test", "passwd")
//delUser("test", "passwd")
//getUsers()

module.exports = {
    getUsers: getUsers,
    getFavori : getFavori,
}