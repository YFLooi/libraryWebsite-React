# libraryWebsite-React
A new spin on the OPAC system today's libraries with the interactivity of Goodreads
* Users search, explore comment, suggest, and borrow books. 
* Librarians track borrowings and late returns. Stack consists of React, Material UI, and PostgreSQL

The site reactively scales by platform:<br/>
**Mobile**<br/>
![mobile function gif](libraryWebsiteMobile.gif)<br/>

**Desktop**<br/>
![desktop function gif](libraryWebsite.gif)<br/>

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
(Version numbers were at time of deployment in 2019) <br/>
For runtime environment: <br/>  
*  nodejs: v8.10.0
*  npm v5.6.0

Dependencies:  
* "body-parser": "^1.19.0",
* "dotenv": "^8.0.0",
* "express": "^4.17.1",
* "express-promise-router": "^3.0.3",
* "path": "^0.12.7",
* "pg": "^7.11.0",
* "pg-promise": "^8.7.5"

### Installing
1. Clone this repo at https://github.com/YFLooi/libraryWebsite-React.git
2. There are 2 package.json files in this repo, the first in the root folder, the second in /root/client. Open the console in both and run 'npm install' in both. This should create a 'node_modules' folder in the root and /root/client folders
2. Download and install [PostgreSQL](https://www.postgresql.org/download/). Make sure a path is created to the /bin and /lib files of the installation ([Example for Windows](https://stackoverflow.com/questions/11460823/setting-windows-path-for-postgres-tools)) so that the database can be accessed from the console
3. Download and install a GUI-based PostgreSQL administration tool to simplify the uploading process to PostgreSQL. I use [dBeaver](https://dbeaver.io)
4. Open a console then create a new user, password, and link it to a database. Use these instructions by [LogRocket](https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/)
5. Open your GUI PostgreSQL administration tool and upload the data in /root/DataTables into the new database. There MUST be two tables: One named 'catalog' which must contain the data of catalog.csv and another named 'borrowings' which must contain the data in borrowings.csv. 
6. Go to queries.js and look for 'const dbaseUrl'. Paste in your database login details in the form of this URL: postgres://username:password@localhost:5432/NameOfDatabase
7. Run 'npm start' in the root folder and in the /root/clients folder. This starts up the Express backend and the React front end respectively. If all goes well, the Carousel on the main page should display a selection of books.

## Authors
Looi Yih Foo (https://github.com/YFLooi/)

## Built with
* Front end: [React](https://reactjs.org/), [Material UI](https://material-ui.com/)
* Back end: [PostgreSQL](https://www.postgresql.org/), [Express](https://expressjs.com/)
