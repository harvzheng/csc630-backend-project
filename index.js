const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const http = require('http');
const mysql = require('mysql');
const express = require('express');
const app = express();
const https = require('https')

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'project1',
});

con.connect(function(err){
  if (err) throw err
  console.log("Connected with database");
});

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

const server = app.listen(process.env.PORT || 3000);

app.get('/', function(req, res) {
  res.send("test");
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
  /*give credit for this */
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
  /*give credit for this */
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
