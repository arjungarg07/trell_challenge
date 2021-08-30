const bcrypt = require('bcrypt');
const saltRounds = 10;

const {commonQuery} = require('../db');

async function signup(req,res) {
    try{
        const {name, username, password} = req.body;
        await bcrypt.hash(password, saltRounds, async function(err, hash) {
            if(err) throw new Error(err);
            const INSERT_QUERY = `INSERT INTO mydb.Users SET ?;`;
            const result = await commonQuery(INSERT_QUERY,{
                name,
                username,
                password: hash
            });
            // console.log(result);
        });
        if(!name && !username && !password) {
            res.status(422).json({
                message: 'Please enter all the required fields',
                success: 'false',
            })
        }
        res.status(200).redirect('/login');
        // res.json({
        //     message: 'Successfully signed up a user',
        //     success: true
        // });
    } catch(err){
        console.log(err);
        res.json({
                    message: 'Internal Server Error',
                    success: 'false',
        })
    }
}

async function login (req,res) {
    try{
        const {username, password} = req.body;
        const USER_FIND_QUERY = `SELECT id, username, password FROM mydb.Users WHERE username = ${username};`;
        const credentials = await commonQuery(USER_FIND_QUERY);
        console.log(credentials);
        // bcrypt.compare(password, hash, function(err, result) {
        //     // result == true
        // });
    } catch(err){
        console.log(err);
        res.json({
            message: 'Internal Server Error',
            success: 'false',
        })
    }
}
module.exports = {signup, login};