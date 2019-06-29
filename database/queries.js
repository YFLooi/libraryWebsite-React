/*sets up the configuration of your PostgreSQL connection*/
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'booklibrary',
  password: 'x',
  port: 5432,
})

/*Selects all items in the 'newarrival' table*/
const getNewArrivals = (request, response) => {
    pool.query('SELECT * FROM newarrival ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

/*Selects all items in the "catalog" table where title partially matches [basicInput]*/
const getSuggestions = (request, response) => {
    let basicInput = request.params.basicInput;
    console.log(basicInput);

    pool.query('SELECT title FROM catalog WHERE title ~* $1 ORDER BY id ASC', [basicInput], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

/*Basic search*/
const getBasicSearch = (request, response) => {
    let basicInput = request.params.basicInput;
    console.log(basicInput);
    
    pool.query('SELECT * FROM catalog WHERE title ~* $1 OR author ~* $1', [basicInput], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

/*Adv search*/
const getAdvSearch = (request, response) => {
    /*Corresponds to: 
    AdvSearch/:advTitle/:condTitAuth/:advAuthor/:condAuthYr/:advYearStart/:advYearEnd/:condYrPub
    /:advPublisher/:condPubSynp/:advSynopsis */
    let advTitle = request.params.advTitle;
    let condTitAuth = request.params.condTitAuth;
    let advAuthor = request.params.advAuthor;
   
    
    let condAuthYr = request.params.condAuthYr;
    let advYearStart = request.params.advYearStart;

    let advYearEnd = request.params.advYearEnd;
    let condYrPub = request.params.condYrPub;
    let advPublisher = request.params.advPublisher;
    let condPubSynp = request.params.condPubSynp;
    let advSynopsis = request.params.advSynopsis; /** */
    console.log("Query received: Title:"+advTitle+" "+condTitAuth+" Author:"+advAuthor+" "
    +condAuthYr+" Where YearStart:"+advYearStart+" until YearEnd:"+advYearEnd+" "+condYrPub+" Publisher:"+advPublisher+" "+condPubSynp+" Synopsis text:"+advSynopsis);
    
    /*Inserting AND/OR must use graves (``) for string interpolation. Using ("++") causes the SQL query 
    to bug out
    How to insert a range of years for the query?*/
    const text = `SELECT * FROM catalog WHERE title ~* $1 ${condTitAuth} author ~* $2
    ${condAuthYr} (year >=$3 AND year <=$4) ${condYrPub} publisher ~* $5 ${condPubSynp}
    synopsis ~* $6`;
    const values = [advTitle, advAuthor, advYearStart, advYearEnd, advPublisher, advSynopsis]
    pool.query(text, values, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
        
    })
    
}

const createBorrowings = (request, response) => {
    console.log("POST request made to insert borrowing record");

    //pg automatically runs JSON.parse() on the JSON sent in
    const borrowerid = request.body.borrowerid
    const borrowdate = request.body.borrowdate
    const returndue = request.body.returndue

    /**Necessary to re-stringify because when pg is given the JSON.parse()-ed: 
     * [ { id: '1', title: 'Fables' }, { id: '2', title: 'FablesXXX' }]
     * During the pool.query() step, pg interprets and stores it as:
     * {"{ \"id\": \"1\", \"title\": \"Fables\" }"", "{ \"id\": \"2\", \"title\": \"FablesXXX\" }"}
     * Which is a form that cannot be interpreted by JSON.parse() later on the client side!!!
    */
    const books = JSON.stringify(request.body.books)

    console.log("Request made: ");
    console.log(request.body);
    console.log("for: "+request.body.borrowerid);
    console.log("containing books of: ");
    console.log(books)

    pool.query('INSERT INTO borrowings (borrowerid, borrowdate, returndue, books) VALUES ($1, $2, $3, $4)', 
    [borrowerid, borrowdate, returndue, books], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(`SERVER RESP: Borrowings added for borrower ${request.body.borrowerid}`)
    })
}

const checkBorrowings = (request, response) => {
    pool.query('SELECT * FROM borrowings', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const deleteBorrowings = (request, response) => {
    const borrowerid = request.body.targetBorrowerId
    const borrowdate = parseInt(request.body.targetBorrowDate)
    console.log(`Request made for borrower with id of ${borrowerid} and borrow date of ${borrowdate}`)

    pool.query('DELETE FROM borrowings WHERE borrowerid = $1 AND borrowdate = $2', [borrowerid, borrowdate], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(`SERVER RESP: Borrow record on ${new Date(borrowdate)} deleted for userID: ${borrowerid}`)
    })
}

/* 
const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createUser = (request, response) => {
    const { name, email } = request.body

    pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`User added with ID: ${result.insertId}`)
    })
}

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body

    pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [name, email, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`User modified with ID: ${id}`)
        }
    )
}

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
}
*/

/*'module.export' allows multiple functions to be exported at the same time! No need to declare
 one by one (ie export const deleteUser(){}).
 With ES6 syntax, its getUsers instead of getUsers:getUsers*/
module.exports = {
    getNewArrivals,
    getSuggestions,
    getBasicSearch,
    getAdvSearch,
    createBorrowings,
    checkBorrowings,
    deleteBorrowings,
    /*Trailing comma ok*/
}



