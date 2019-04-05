#NodeJS Backend Project
By Harvey Zheng and Liv Maertens
## Getting Started
Dependencies:
- MySQL
- NodeJS

First, run
```sh
$ npm install
```
To get the right packages installed.
Then, create a file name ".env" and put the following variables in it:
- DB_HOST=*your_db_host*
    - This will typically be localhost
- DB_USER=*your_db_username*
    - This will typically be root
- DB_HOST=*your_db_password*
    - This is what the password to your MySQL Database is
- API_KEY=*your_google_geocoding_api_key*
- DATABASE=*name_of_database*
    - Before starting to play with this locally, you'll want to set up a new database in MySQL. Put the name of that database in here.
- PORT=*port_of_your_choosing*

Once that's done, to get the server up and running just run
```sh
$ node index.js
```
## Sending HTTP Requests

### GET
The following get requests are available on this site
```sh
http://localhost:3000/users
```
Displays all users
```sh
http://localhost:3000/users/[:user_id]
```
Displays the single user's info
```sh
http://localhost:3000/users/[:user_id]/poi
```
Display's the single user's points of interest
```sh
http://localhost:3000/poi
```
Displays all points of interest, or locations.
Note that the "http://localhost:3000" can be changed to "https://csc-630-project.herokuapp.com"
### POST
You can post to the server by following this format:
```sh
$ curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"display_name":"foobar","username":"foo_bar_the_great", "latitude": 2, "longitude": 2}' \
    http://localhost:3000/users
```
You can replace the attributes as you want, and change the url as appropriate, since it can change depending on your port.
This POST request inserts a new row into the users table of the database.
A POST request that inserts  row into the locations table could look like this:
```sh
$ curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"user_id":1,"title":"foo_bar_the_great", "address": "180 Main Street, Andover MA"}' \
    http://localhost:3000/poi
```
and once again, change the attributes and the url as necessary.
### PUT
You can update rows in the server with this format:
```sh
$ curl --header "Content-Type: application/json" \
    --request POST \
    --data '{'id': 1, "display_name":"funbar","username":"fun_bar_the_great", "latitude": 3, "longitude": 14}' \
    http://localhost:3000/users
```
Make sure when you try to update something, the id is correct. Same idea follows as before, though: change the attributes as you like/need to
This PUT request updates the row of the specified id of the user.
To update a location, follow this example:
```sh
$ curl --header "Content-Type: application/json" \
    --request PUT \
    --data '{"id": 1, user_id":2,"title":"The Googs", "address": "1600 Amphitheatre Parkway, Mountain View, CA"}' \
    http://localhost:3000/poi
```
again, changing any attribtues necessary.
### DELETE
To delete a row from the server, follow this format:
```sh
$ curl --header "Content-Type: application/json" \
    --request DELETE \
    --data '{"id": 1}' \
    http://localhost:3000/users
```
Similar to PUT requests, you need to make sure that the ID is valid and is of the row you want to delete. Change the url as necessary.
Locations is similar, just change the url from
```sh
http://.../users
```
to
```sh
http://.../poi
```
