const mysql = require('mysql');

const db = mysql.createConnection({
host: "localhost",
user: "root",
password: "",
database:"socialmedia" ,
multipleStatements: true
});

module.exports = db;