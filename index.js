/*Require the express module,
built in bodyParser middlware, and set our app and port variables.*/
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
//Allows access on browser at http://localhost:5000
//Can also be defined in .env file
const port = process.env.PORT || 5000; 

/*To get all the exported functions from queries.js, we'll 'require' the file and assign it to a variable.*/
const db = require('./db/queries.js')

// Use bodyParser to parse JSON
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//Static file declaration, which is the location of the React app
//Used in deployment by React app to access index.js
app.use(express.static(path.join(__dirname, 'client/build'))); 

app.get("/", (request, response) => {
  response.sendFile(__dirname + '/public/index.html');
})

app.get("/NewArrivals", db.getNewArrivals)
app.get("/Suggestions/:suggestionRequest", db.getSuggestions)

app.get("/BasicSearch/:basicInput", db.getBasicSearch)

app.get("/AdvSearch/:advTitle/:condTitAuth/:advAuthor/:condAuthYr/:advYearStart/:advYearEnd/:condYrPub/:advPublisher/:condPubSynp/:advSynopsis"
, db.getAdvSearch)

app.post("/Create-Borrowings", db.createBorrowings)
app.get("/Check-Borrowings", db.checkBorrowings)
app.delete("/Delete-Borrowings", db.deleteBorrowings)

//Put this last among all routes. Otherwise, it will return HTML to all fetch requests and trip up CORS. They interrupt each other
// For any request that doesn't match, this sends the index.html file from the client. This is used for all of our React code.
//Eliminates need to set redirect in package.json at start script with concurrently
app.get('*', (req, res) => {  
  res.sendFile(path.join(__dirname+'/client/public/index.html'));
})


/*set the app to listen on the port you set*/
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

