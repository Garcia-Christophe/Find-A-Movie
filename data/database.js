var pg = require('pg');

var conString = "postgres://rwvzheny:GQskCZGhvKWErBn4N-XvZ-MaVFF0wbAm@hattie.db.elephantsql.com/rwvzheny";
function getUsers(){
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query('SELECT * FROM public.user', function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            result.rows.map(row => {
                console.log(row)
            })

            client.end();
        });
    });
}

function addUser(fname, lname, passwd) {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query("insert into public.user (firstname, lastname, password) values ('" + fname + "', '" + lname + "', '" + passwd + "')", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            client.end();
        });
    });
}

function delUser(fname, lname) {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query("delete from public.user where firstname='" + fname + "' and lastname='" + lname + "'", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            client.end();
        });
    });
}

function updateUserFName(fname, lname, passwd) {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query("update public.user set firstname='" + fname +"' where lastname='" + lname + "' and password='" + passwd + "'", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            client.end();
        });
    });
}

function updateUserlName(fname, lname, passwd) {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query("update public.user set lastname='" + lname +"' where firstname='" + fname + "' and password='" + passwd + "'", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            client.end();
        });
    });
}

function updateUserPasswd(fname, lname, passwd) {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query("update public.user set password='" + passwd +"' where firstname='" + fname + "' and lastname='" + lname + "'", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            client.end();
        });
    });
}

//addUser("test", "test", "passwd")
delUser("test", "test")
updateUserFName("David", "test", "passwd")
updateUserlName("David", "Dubosc", "passwd")
updateUserPasswd("David", "Dubosc", "mdp1234")
getUsers()