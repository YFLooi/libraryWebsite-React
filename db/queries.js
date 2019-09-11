require('dotenv').config(); //Allows retriving variables from the .env file
const pgp = require('pg-promise')(); // https://www.npmjs.com/package/pg-promise
//Selects db to use based on value in the .env file's NODE_ENV parameter
const dbaseURL = process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_DATABASE : process.env.DEPLOYMENT_DATABASE
//const dbaseURL = 'postgres://qqzdpxpy:6poqhwoSsUVeCwDUdp2xhPk8C_UnvQqe@rosie.db.elephantsql.com:5432/qqzdpxpy';
const dbase = pgp(dbaseURL); // Connect to database at URL defined in .env file

//Selects the 20 newest books stored in the 'catalog' table
//OFFSET sets the start point for collecting row data, LIMIT sets the max no. of rows from
//the start point to collect data
async function getNewArrivals (request, response) {
    console.log('Request for new arrivals received');

    try{
        const rowList = await dbase.query('SELECT * FROM catalog ORDER BY id ASC OFFSET 99 LIMIT 20');
        response.send(rowList);
    } catch (error){
        console.log('Error retrieving new arrivals. Log:')
        console.log(error);
    }
}

/*Selects all items in the "catalog" table where title partially matches [basicInput]*/
async function getSuggestions (request, response){
    let suggestionString = `^${request.params.suggestionRequest}`;
    console.log(`suggestionRequest string: ${suggestionString}`);

    try{
        if (suggestionString !== ``){
            const results = await dbase.query(`SELECT title FROM catalog WHERE title ~* $1 ORDER BY id ASC`, [suggestionString]);
            response.status(200).send(results);
        } else {
            response.status(400).json('Blank suggestionString received')
        }
    } catch (error){
        console.log('Error getting suggestions. Log:')
        console.log(error)
    }
}

//Basic search
async function getBasicSearch(request, response){
    let basicInput = request.params.basicInput;
    console.log(basicInput);
    
    //'titlekeyword' is the book title in lowercase without spaces and special characters
    //Necessary because PSQL cannot find strings with special characters unless query wrapped in 
    //escape characters.
    try{
        if (basicInput !== ``){
            const results = await dbase.query('SELECT * FROM catalog WHERE title ~* $1 OR author ~* $1 OR titlekeyword ~* $1 ORDER BY id ASC', [basicInput]);
            response.status(200).send(results);
        } else {
            response.status(400).json('Blank basicInput received')
        }
    } catch (error){
        console.log('Error getting basic search results. Log:')
        console.log(error)
    }
}

/*Adv search*/
async function getAdvSearch(request, response){
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
    
    //Inserting AND/OR must use graves (``) for string interpolation. Using ("++") 
    //causes the SQL query to bug out
    //'titlekeyword' added as part of title search to ensure match on exact title
    const query = `SELECT * FROM catalog WHERE title ~* $1 OR titlekeyword ~* $1 ${condTitAuth} author ~* $2
    ${condAuthYr} (year >=$3 AND year <=$4) ${condYrPub} publisher ~* $5 ${condPubSynp}
    synopsis ~* $6`;
    const values = [advTitle, advAuthor, advYearStart, advYearEnd, advPublisher, advSynopsis]

    try{
        const results = await dbase.query(query, values);
        response.status(200).send(results);    
    } catch (error){
        console.log('Error getting advanced search results. Log:')
        console.log(error)
    }
}

async function postCommentReply (request,response){
    const newComment = JSON.stringify(request.body);
    const bookId = request.params.bookId;

    try{
        const query = `UPDATE catalog SET comments=$1 WHERE id=$2`
        const values = [newComment,bookId]
        await dbase.query(query, values);
       
        response.status(200).json(`SERVER RESP: Comments added to book of ID ${bookId}`);
    } catch (error) {
        console.log(error)
        response.status(404).json(`SERVER RESP: Error adding comments to book of ID ${bookId}`);
    }
}
async function updateCommentReply (request,response){
    console.log('updateComment triggered');
}
async function deleteCommentReply (request,response){
    console.log('deleteComment triggered');
}

async function createBorrowings(request, response){
    console.log("POST request made to insert borrowing record");

    //pg automatically runs JSON.parse() on the JSON sent in
    const borrowerid = request.body.borrowerid
    const borrowdate = request.body.borrowdate
    const returndue = request.body.returndue

    /**Necessary to re-stringify because when pg is given the JSON.parse()-ed: 
     * [ { id: '1', title: 'Fables' }, { id: '2', title: 'FablesXXX' }]
     * During the dbase.query() step, pg interprets and stores it as:
     * {"{ \"id\": \"1\", \"title\": \"Fables\" }"", "{ \"id\": \"2\", \"title\": \"FablesXXX\" }"}
     * Which is a form that cannot be interpreted by JSON.parse() later on the client side!!!
    */
    const books = JSON.stringify(request.body.books)

    console.log("Request made: ");
    console.log(request.body);
    console.log("for: "+request.body.borrowerid);
    console.log("containing books of: ");
    console.log(books)
    
    const query = 'INSERT INTO borrowings (borrowerid, borrowdate, returndue, books) VALUES ($1, $2, $3, $4)';
    const values = [borrowerid, borrowdate, returndue, books];
    try{
        await dbase.query(query, values);
        response.status(200).json(`SERVER RESP: Borrowings added for borrower ${request.body.borrowerid}`);
    } catch (error){
        console.log('Error creating new borrowing entry. Log:')
        console.log(error)
    }
}

async function checkBorrowings(request, response){
    try{
        const results = await dbase.query('SELECT * FROM borrowings');
        response.status(200).send(results);
    } catch (error){
        console.log('Error retriving borrowings. Log:')
        console.log(error)
    }
}

async function deleteBorrowings(request, response){
    const borrowerid = request.body.targetBorrowerId;
    const borrowdate = request.body.targetBorrowDate;
    console.log(`Request made for borrower with id of ${borrowerid} and borrow date of ${borrowdate}`)

    const query = `DELETE FROM borrowings WHERE (borrowerid=$1 AND borrowdate=$2)`
    //borrowdate has to be converted to string, otherwise ElephantSQL will have trouble deleting
    //because it interprets it as a very large numeric entry
    const values = [borrowerid, borrowdate.toString()]

    try{
        await dbase.query(query, values);
        response.status(200).json(`SERVER RESP: Borrow record on ${new Date(parseInt(borrowdate)).toDateString()} deleted for userID: ${borrowerid}`);
    } catch (error){
        console.log('Error deleting borrowing. Log:')
        console.log(error)
    }
}

async function getExploreData (request, response) {
    const targetGenre = request.params.genre;
    console.log(`Request received for books of genre ${targetGenre}`);
    
    try{
        const rowList = await dbase.query('SELECT * FROM catalog WHERE genre = $1 ORDER BY id ASC', [targetGenre]);
        response.status(200).send(rowList);
    } catch (error){
        console.log('Error getting "Explore" suggestions. Log:')
        console.log(error)
    }
}

/*'module.export' allows multiple functions to be exported at the same time! No need to declare
 one by one (ie export const deleteUser(){}).
 With ES6 syntax, its getUsers instead of getUsers:getUsers*/
module.exports = {
    getNewArrivals,
    getSuggestions,
    getBasicSearch,
    getAdvSearch,
    postCommentReply,
    updateCommentReply,
    deleteCommentReply,
    createBorrowings,
    checkBorrowings,
    deleteBorrowings,
    getExploreData
}

