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

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
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

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', function(req, res) {
  res.send("CSC630 project by Harvey and Liv");
});

//much of this code is modified from: https://medium.com/@avanthikameenakshi/building-restful-api-with-nodejs-and-mysql-in-10-min-ff740043d4be

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
	  res.end('Record has been deleted!');
	});
});

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
  let data = ''
  https.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.house_number}+${req.body.street}+${req.body.city},${req.body.state}+${req.body.country}&key=${process.env.API_KEY}`, (response) => {
  //http request handled in a way that is modified from https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html  
      response.on('data', (chunk) => {
          data += chunk;
      })
      response.on('end', function(){
        let lat = JSON.parse(data)['results'][0]['geometry']['location']['lat']
        let lng = JSON.parse(data)['results'][0]['geometry']['location']['lng']
        con.query('INSERT INTO locations (user_id, title, house_number, street, city, country, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [req.body.user_id, req.body.title, req.body.house_number, req.body.street, req.body.city, req.body.country, lat, lng], function (error, results, fields) {
          if (error) throw error;
          res.end(JSON.stringify(results));
        });
      });

  });
});

app.put('/poi', function (req, res) {
  let data = ''
  https.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.house_number}+${req.body.street}+${req.body.city},${req.body.state}+${req.body.country}&key=${process.env.API_KEY}`, (response) => {
  //http request handled in a way that is modified from https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
      response.on('data', (chunk) => {
          data += chunk;
      })
      response.on('end', function(){
        let lat = JSON.parse(data)['results'][0]['geometry']['location']['lat']
        let lng = JSON.parse(data)['results'][0]['geometry']['location']['lng']
        con.query('UPDATE `locations` SET `user_id`=?,`title`=?,`house_number`=?,`street`=?, `city`=?, `country`=?, `latitude`=?, `longitude`=? where `id`=?', [req.body.user_id, req.body.title, req.body.house_number, req.body.street, req.body.city, req.body.country, lat, lng, req.body.id], function (error, results, fields) {
       	  if (error) throw error;
       	  res.end(JSON.stringify(results));
       	});
      });

  });
});

app.delete('/poi', function (req, res) {
   con.query('DELETE FROM `locations` WHERE `id`=?', [req.body.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end('Record has been deleted!');
	});
});
