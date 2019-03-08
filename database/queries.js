/*sets up the configuration of your PostgreSQL connection*/
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'x',
  port: 5432,
})


/*Routes to interface with app.get() in index.js:
    GET — / | displayHome()
    GET — /users | getUsers()
    GET — /users/:id | getUserById()
    POST — users | createUser()
    PUT — /users/:id | updateUser()
    DELETE — /users/:id | deleteUser()

    All of them talk to app.db through 'pool'
*/
/*Selects all users and ORDER-s by ID*/
const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

/*Selects specific users by ID*/
const getUserById = (request, response) => {
    const id = parseInt(request.params.id)

    /*'$1' is a numbered placeholder. Other SQL use '?'*/
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

/*The '/users' endpoint will take both GET (getUsers()) and POST (createUser()) requests. 
This function extracts the 'name' and 'email' properties from the request body for INSERTing into the 'users' table. */
const createUser = (request, response) => {
    const { name, email } = request.body

    pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`User added with ID: ${result.insertId}`)
    })
}

/*The '/users/:id' endpoint will takes a GET (getUserById()), a DELETE (deleteUser()) and PUT (updateUser()) requests. 
This function modifies data already in the table*/
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

/*The 'DELETE' SQL clause is used to remove data*/
const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
}

/*'module.export' allows multiple functions to be exported at the same time! No need to declare
 one by one (ie export const deleteUser(){}).
 With ES6 syntax, its getUsers instead of getUsers:getUsers*/
module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser, /*Trailing comma ok?*/
}



