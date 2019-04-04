curl --header "Content-Type: application/json" --request POST --data '{"display_name":"abc","username":"xyz", "latitude": 0, "longitude": 1}' http://localhost:3000/users


curl --header "Content-Type: application/json" --request PUT --data '{"id": 1, "display_name":"def","username":"zzz", "latitude": 2, "longitude": 3.3}' http://localhost:3000/users

curl --header "Content-Type: application/json" --request DELETE --data '{"id": 1}' http://localhost:3000/users
