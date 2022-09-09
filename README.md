# Backend Application

## This is to fulfill the following requirements

1. Functionality
   1. Typical RESTful API
   2. Data is saved in DB
   3. Proper unit test
   4. Proper API document
2. Tech Stack

   1. Node.js, MongoDB
   2. Express, Mongoose
   3. NoSQL DB is used

3. Bonus

   1. Clear documentation on how it's designed and how to run the code
   2. In-code comments
   3. Commit messages

4. Advanced requirements
   1. Provide a complete logging strategy

## About the app

This backend app is created so that it provides RESTful HTTP API. it can execute different operations on resources.
The operation to be executed is defined by the HTTP verb:

| URL      | verb   | functionality                                                    |
| -------- | ------ | ---------------------------------------------------------------- |
| users/11 | GET    | fetches a single resource                                        |
| users    | GET    | fetches all resources in the collection                          |
| users    | POST   | creates a new resource based on the request data                 |
| users/11 | DELETE | removes the identified resource                                  |
| users/11 | PUT    | replaces the entire identified resource with the request data    |
| users/11 | Patch  | replaces a part of the identified resource with the request data |

1. index.js file purpose is to launch the application at the specified port(3003) with Node's built-in http object
2. app.js contains the main Express application and middleware loading
3. mongo.js is the file that was used to test the connection to mongodb before the app was built
4. .env contains all the environment URI that are needed during production or test, as well as the port being used
5. all mongoose models and schemas are located inside models folder with the appropriate naming (e.g user.js for user model)
6. all route handlers and controllers are located inside controllers folders with the appropriate naming (e.g users.js serving /api/users has methods to get,create,delete,update resources)
7. all tests related files are located insided tests folder
8. config.js inside utils folder is the file that determines which url/uri is gonna used according to the environment
9. logger.js inside utils folder provides the logging necessary for the middlewares and the execution of the application
10. middleware.js contains all the custom middlewares used on the app

## Start

1. npm install
2. npm start
3. The API will become available at http://localhost:3003
4. http://localhost:3003/api will display the available routes
5. http://localhost:3003/api/users will display all the users
6. http://localhost3003/api/users/:id will display a particular user with the related id
   ```json
   {
     "name": "Ramos",
     "dob": "1996-12-26T16:00:00.000Z",
     "address": "92 Jurong West",
     "description": "description here",
     "createdAt": "2022-09-09T08:04:26.263Z",
     "id": "631af38a05e5c933c09938d6"
   }
   ```

## Making Requests

Some of the ways to make requests:

1. Postman desktop client
2. Visual Studio REST client
3. curl
   1. GET => curl http://localhost:3003
   2. POST => curl -d '{"name":"arash","dob":"1990-11-22","address":"Silvian Lane","description":""}' -H "Content-Type: application/json" -X POST http://localhost:3003/api/users
   3. PUT => curl -d '{"name":"arash","dob":"1990-11-22","address":"Silvian Lane","description":""}' -H "Content-Type: application/json" -X PUT http://localhost:3003/api/users/:id
   4. DELETE => curl -X DELETE http://localhost:3003/api/users/:id

## Testing

1. To test all => npm test
2. To test a particular test cases => npm test -- -t "describe"
