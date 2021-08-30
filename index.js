const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();
const {commonQuery} = require('./db');
const router = require('./routes/index')
;
const PORT = 8000;
app.use(express.urlencoded({extended: 'true'}));
app.use('/',router);

app.get('/login', (req, res) => {
    res.sendFile('./login.html', { root: __dirname });
});

app.get('/signup', (req, res) => {
    res.sendFile('./signup.html', { root: __dirname });
});

// add movie POST  /admin/movie       required fields( movie name, description, director, duration)
// add timings POST /admin/timings    add timings,price,total tickets for existing added movies. 
// purchase tickets POST /purchase already added movie at a specific time
// const CREATE_USER_TABLE_QUERY  = `CREATE TABLE mydb.Users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL)`;
// const CREATE_MOVIES_TABLE_QUERY =  `CREATE TABLE mydb.Movies (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, director VARCHAR(255), duration INT,price INT);`;
// const TIMINGS_TABLE_QUERY =  `CREATE TABLE mydb.Timings (id INT AUTO_INCREMENT PRIMARY KEY, movieId INT NOT NULL, startTime INT, endTime INT, tickets INT);`;

// const query = 'DROP TABLE mydb.';
(async()=>{
    // const userTable = await commonQuery(CREATE_MOVIES_TABLE_QUERY);
    // const moviesTable = await commonQuery(CREATE_MOVIES_TABLE_QUERY);
    // console.log(userTable);
    // console.log(moviesTable);
})();


app.listen(PORT,()=>{
    console.log(`Server listening on ${PORT}`);
});