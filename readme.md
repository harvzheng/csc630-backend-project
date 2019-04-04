# Getting Started
Dependencies:
- MySQL
- NodeJS

After downloading the files, run
```sh
$ npm install
```

Next, create a file named ".env" and put the following variables in it:
1. DB_HOST=*your_db_host*
    - This will typically be localhost
2. DB_USER=*your_db_username*
    - This will typically be root
3. DB_HOST=*your_db_password*
    - This is what the password to your MySQL Database is

<<<<<<< Updated upstream
Then, you'll want to set up the right tables. You can do this by running
```sh
$ node server.js
```

Once that's done, to get the server up and running just run
```sh
$ node index.js
```
# Sending HTTP Requests

### GET
All you'll need to do is go to:
```sh
http://localhost:3000/users
```
and you'll see the database in JSON format
### POST
You can post to the server by following this format:
```sh
curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"display_name":"foobar","username":"foo_bar_the_great", "latitude": 2, "longitude": 2}' \
    http://localhost:3000/users
```
You can replace the attributes as you want, and change the url as appropriate, since it can change depending on your port.
This POST request inserts a new row into the users table of the database.

### PUT
You can update rows in the server with this format:
```sh
curl --header "Content-Type: application/json" \
    --request POST \
    --data '{'id': 1, "display_name":"funbar","username":"fun_bar_the_great", "latitude": 3, "longitude": 14}' \
    http://localhost:3000/users
```
Make sure when you try to update something, the id is correct. Same idea follows as before, though: change the attributes as you like/need to
This PUT request updates the row of the specified id.

### DELETE
To delete a row from the server, follow this format:
```sh
curl --header "Content-Type: application/json" \
    --request DELETE \
    --data '{"id": 1}' \
    http://localhost:3000/users
```
Similar to PUT requests, you need to make sure that the ID is valid and is of the row you want to delete. Change the url as necessary.
