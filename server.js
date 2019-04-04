const mysql = require('mysql')
const dotenv = require('dotenv').config();
const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DATABASE,
});
// modified from https://www.w3schools.com/nodejs/nodejs_mysql_create_table.asp

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("use ?", [process.env.DATABASE], function (err, result) {
    if (err) throw err;
  });
  var users = "CREATE TABLE IF NOT EXISTS `users` (`id` int(5) AUTO_INCREMENT, `display_name` varchar(255), `username` varchar(255), `latitude` Decimal(9,6), `longitude` Decimal(9,6), PRIMARY KEY (`id`));";
  con.query(users, function (err, result) {
    if (err) throw err;
    console.log("User table created");
  });
  var loc = "CREATE TABLE IF NOT EXISTS `locations` (`id` int(5) AUTO_INCREMENT, `user_id` varchar(255), `title` varchar(255), `house_number` int(7), `street` varchar(255), `city` varchar(255), `state` varchar(255), `country` varchar(255), `latitude` Decimal(9,6), `longitude` Decimal(9,6), PRIMARY KEY (`id`));";
  con.query(loc, function (err, result){
    if (err) throw err;
    console.log("Locations table created");
  });
});
