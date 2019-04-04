const express = require('express')
const https = require('https')
const app = express()
const port = 4000
const onlineport = process.env.PORT
const api_key = "AIzaSyBDKo6Hf-ZLyroGPc-3GUpQVjorWvVMI7g"

let data = '';
let street = "Main Street"
let number = 180
let town = "Andover"
let state = "MA"
let country = "US"

https.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${number}+${street}+${town},${state}+${country}&key=${api_key}`, (res) => { 
/*give credit for this */
    res.on('data', (chunk) => {
        data += chunk;
    });
})
app.get('/', (req, res) => res.send(JSON.parse(data)['results'][0]['geometry']['location']))
app.listen(onlineport || port ,  () => console.log(`Example app listening on port ${port}!`));
/* promises */
