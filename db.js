const mysql = require('mysql2');
const { mysqlDbConfig } = require('./config/default');
const pool = mysql.createPool(mysqlDbConfig);
function commonQuery(query, params) {
    return new Promise(function (res,rej) {
        pool.getConnection(function (err, connection){
            if(!err){
                connection.query(query, params, function (err, results){
                    connection.release();
                    if(!err){
                        res(results);
                    } else {
                        rej(err);
                    }
                })
            } else {
                console.log("Error Occurred", err);
                rej(err);
            }
        }) 
    })
}

module.exports = {commonQuery};