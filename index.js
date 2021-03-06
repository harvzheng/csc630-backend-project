/*
A CSC630 project by Harvey Zheng and Liv Martens.
The source code is available on GitHub and the actual server can be
accessed at csc-630-project.herokuapp.com. The code can be run locally if a .env file with a valid API key is present.
*/

const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const http = require('http');
const mysql = require('mysql');
const express = require('express');
const app = express();
const https = require('https')
const server = app.listen(process.env.PORT);
const con = mysql.createConnection({
//if this is used locally, a .env file is required
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DATABASE,
});
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.API_KEY,
  Promise: Promise,
});
//this tutorial was used for table creation: https://www.w3schools.com/nodejs/nodejs_mysql.asp
//data type for lat/long is taken from here: https://stackoverflow.com/questions/1196415/what-datatype-to-use-when-storing-latitude-and-longitude-data-in-sql-databases

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var users = "CREATE TABLE IF NOT EXISTS `users` (`id` int(5) AUTO_INCREMENT, `display_name` varchar(255), `username` varchar(255), `latitude` Decimal(9,6), `longitude` Decimal(9,6), PRIMARY KEY (`id`));";
  con.query(users, function (err, result) {
    if (err) throw err;
  });
  con.query("DROP TABLE IF EXISTS `locations`", function (err, result){
    if (err) throw err;
  });
  var loc = "CREATE TABLE IF NOT EXISTS `locations` (`id` int(5) AUTO_INCREMENT, `user_id` varchar(255), `title` varchar(255), `address` varchar(255), `latitude` Decimal(9,6), `longitude` Decimal(9,6), PRIMARY KEY (`id`));";
  con.query(loc, function (err, result){
    if (err) throw err;
  });
});

app.use(bodyParser.json());

//routing
app.get('/', function(req, res) {
  res.send("CSC630 project by Harvey and Liv");
});

//routing users requests
//much of this code is modified from: https://medium.com/@avanthikameenakshi/building-restful-api-with-nodejs-and-mysql-in-10-min-ff740043d4be
//and https://www.restapiexample.com/build-rest-api/create-rest-api-using-node-js-mysql-express/

app.get('/users', function(req, res) {
  con.query('SELECT * FROM users', function(error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

app.get('/users/:id', function(req, res) {
  con.query('SELECT * FROM users WHERE id=?', [req.params.id], function(error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

app.post('/users', function (req, res) {
  console.log(req.body)
  con.query('INSERT INTO users (display_name, username, latitude, longitude) VALUES (?, ?, ?, ?)', [req.body.display_name, req.body.username, req.body.latitude, req.body.longitude], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

app.put('/users', function (req, res) {
   con.query('UPDATE `users` SET `display_name`=?,`username`=?,`latitude`=?,`longitude`=? where `id`=?', [req.body.display_name, req.body.username, req.body.latitude, req.body.longitude, req.body.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

app.delete('/users', function (req, res) {
   con.query('DELETE FROM `users` WHERE `id`=?', [req.body.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end('User has been deleted!');
	});
});

//routing locations requests
app.get('/users/:id/poi', function (req, res) {
   con.query('SELECT locations.title, locations.longitude, locations.latitude FROM locations WHERE locations.user_id=?', [req.params.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

app.get('/poi', function (req, res) {
   con.query('SELECT * FROM locations', [req.params.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

app.post('/poi', function (req, res) {
  googleMapsClient.geocode({address: req.body.address})
    .asPromise()
    .then((response) => {
      coords = response.json.results[0]['geometry']['location'];
      con.query('INSERT INTO locations (user_id, title, address, latitude, longitude) VALUES (?, ?, ?, ?, ?)', [req.body.user_id, req.body.title, req.body.address, coords.lat, coords.lng], function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
      });
    })
    .catch((err) => {
      throw err;
  });
});

app.put('/poi', function (req, res) {
  googleMapsClient.geocode({address: req.body.address})
    .asPromise()
    .then((response) => {
      coords = response.json.results[0]['geometry']['location'];
      con.query('UPDATE `locations` SET `user_id`=?,`title`=?,`address`=?, `latitude`=?, `longitude`=? where `id`=?', [req.body.user_id, req.body.title, req.body.address, coords.lat, coords.lng, req.body.id], function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
      });
    })
    .catch((err) => {
      throw err;
  });
});

app.delete('/poi', function (req, res) {
   con.query('DELETE FROM `locations` WHERE `id`=?', [req.body.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end('Location has been deleted!');
	});
});
