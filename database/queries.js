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

/*Basic search*/
const getBasicSearch = (request, response) => {
    let input = request.params.input;
    console.log(input);
    
    pool.query('SELECT * FROM catalog WHERE title ~* $1 OR author ~*$1', [input], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

/*Adv search*/
const getAdvSearch = (request, response) => {
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
    
    /*This way of inserting AND/OR causes SQL query to bug out. How to fix?
    response.status(200).json("Advanced query received at server")

    pool.query("SELECT * FROM catalog WHERE title ~* $1 "+condTitAuth+" author ~*$2", [advTitle,advAuthor], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
        
    })
    */
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
    getBasicSearch,
    getAdvSearch,
    /*Trailing comma ok*/
}



