/*Require the express module,
built in bodyParser middlware, and set our app and port variables.*/
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000 /*Allows acces on browser at http://localhost:3000*/

/*To get all the exported functions from queries.js, we’ll 'require' the file and assign it to a variable.*/
const db = require('./queries.js')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

/*tell a route to look for a GET request on the root (/) URL, 
and return some JSON.*/
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
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

