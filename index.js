const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const http = require('http');
const mysql = require('mysql');
const express = require('express');
const app = express();

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
