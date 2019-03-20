/*Require the express module,
built in bodyParser middlware, and set our app and port variables.*/
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const port = 3005 /*Allows access on browser at http://localhost:3001*/

/*morgan and bodyparser too?*/

/*To get all the exported functions from queries.js, we�ll 'require' the file and assign it to a variable.*/
const db = require('./queries.js')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

/*Allows CORS to allow cross-origin requests on browser. Typically blocked to prevent attacks, but we'll need this for testing*/
app.use(cors())
app.use(function(request, response, next){
  response.header("Access-Control-Allow-Origin","*");
  response.header("Access-Control-Allow-Header","Origin, X-Requested-With, Content-Type, Access");
  next();
})

/*tell a route to look for a GET request on the root (/) URL, 
and return some JSON.*/
app.get('/', db.getUsers, (request, response) => {
  response.json({ info: 'Server running on Node.js, Express, and Postgres API' });
})
/*This sets up the HTTP request method, the endpoint URL path, and the relevant function to access each function 
that modifies the db specified in queries.js*/
app.get('/users', db.getUsers) /*Means: On activation of endpoint '/users', go to const db and run function 'getUsers()'*/
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

/*set the app to listen on the port you set*/
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

