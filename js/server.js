var mysql = require("mysql");
const env = require("dotenv").config({path: '.env'});

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: `${process.env.}`,
    database: "employeedata_DB"
});


connection.connect(function(err){
    if (err) throw err;
})
