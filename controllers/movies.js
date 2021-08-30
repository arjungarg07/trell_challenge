const {commonQuery} = require('../db');

async function addMovie(req,res) {
    try{
        const {name, description, director, duration, price} = req.body;
        const duplicationCheck = await commonQuery(`SELECT id FROM mydb.movies WHERE name = "${name}"`);
        if(!name && !description && !duration && !price || (duplicationCheck.length || price<0)) {
            res.status(422).json({
                message: 'Please enter all the required fields or the movie already exists',
                success: 'false',
            })
            return;
        }
        const INSERT_QUERY = `INSERT INTO mydb.Movies SET ?;`;
        await commonQuery(INSERT_QUERY,{
            name,
            description,
            director,
            duration,
            price
        });
        res.json({
            message: "Successfully added movie",
            success: true
        })
    } catch(err){
        console.log(err);
        res.json({
                    message: 'Internal Server Error',
                    success: 'false',
        })
    }
}

async function addTimings(req,res) {
    // add timings,price,total tickets for existing added movies. 
    try{
        const {name: movieName} = req.query;
        if(!movieName) {
            res.status(422).json({
                message: 'Please enter movie name',
                success: 'false',
            })
            return;
        }
        const result = await commonQuery(`SELECT id FROM mydb.movies WHERE name = "${movieName}";`);
        if(!result.length){
            res.status(422).json({
                message: "Movie doesn't exist",
                success: true
            })
            return;
        }

        const movieId = result[0].id;

        const {timing: unformattedTimings,tickets} = req.body;
        const timings = unformattedTimings.split('-');
        const startTime = Number(timings[0].split(':')[0]*100) + Number(timings[0].split(':')[1]);
        const endTime = Number(timings[1].split(':')[0]*100) + Number(timings[1].split(':')[1]);

        const INSERT_QUERY = `INSERT mydb.Timings SET ?;`;
        await commonQuery(INSERT_QUERY,{
            startTime,
            endTime,
            movieId,
            tickets,
        });
        res.json({
            message: "Successfully added movie timing",
            success: true
        })
    } catch(err){
        console.log(err);
        res.json({
            message: 'Internal Server Error',
            success: 'false',
        })
    }
}

async function purchaseTicket(req,res) {
    try{
        const {name: movieName} = req.query;
        if(!movieName) {
            res.status(422).json({
                message: 'Please enter movie name',
                success: 'false',
            })
            return;
        }
        const result = await commonQuery(`SELECT id FROM mydb.movies WHERE name = "${movieName}";`);
        if(!result.length){
            res.status(422).json({
                message: "Movie doesn't exist",
                success: true
            })
            return;
        }

        const movieId = result[0].id;

        const {timing: unformattedTimings} = req.body;
        const timings = unformattedTimings.split('-');
        const startTime = Number(timings[0].split(':')[0]*100) + Number(timings[0].split(':')[1]);
        const endTime = Number(timings[1].split(':')[0]*100) + Number(timings[1].split(':')[1]);

        const CHECK_QUERY = `SELECT tickets FROM mydb.Timings WHERE movieId = "${movieId}" AND startTime = "${startTime}" AND endTime = "${endTime}";`;
        const MovieTimingExists = await commonQuery(CHECK_QUERY);
        if(!MovieTimingExists.length || !(MovieTimingExists[0].tickets)){
            res.status(422).json({
                message: "You have selected wrong timing or houseful",
                success: true
            })
        }
        const updatedTicket = MovieTimingExists[0].tickets -1;
        const TICKET_UPDATE = `UPDATE mydb.Timings SET ? WHERE movieId = "${movieId}" AND startTime = "${startTime}" AND endTime = "${endTime}";`;
        const ticketUpdateResult = await commonQuery(TICKET_UPDATE,{
            tickets: updatedTicket
        })

        res.json({
            message: "Successfully purchased Ticket",
            success: true
        })
    } catch(err){
        console.log(err);
        res.json({
            message: 'Internal Server Error',
            success: 'false',
        })
    }
}

async function searchMovie(req,res) {
    try{
        const {name: movieName} = req.query;
        if(!movieName) {
            res.status(422).json({
                message: 'Please enter movie name',
                success: 'false',
            })
        }
        const result = await commonQuery(`SELECT id, description, director, duration, price FROM mydb.movies WHERE name = "${movieName}";`);
        if(!result.length){
            res.status(422).json({
                message: "Movie doesn't exist",
                success: true
            })
            return;
        }
        // console.log(result);
        const {id:movieId , description, director, duration, price} = result[0];
        const movieTimings = await commonQuery(`SELECT * FROM mydb.timings WHERE movieId = "${movieId}";`);
        let timingArr = [];
        for(timing of movieTimings){
            const { startTime: unformattedStartTime, endTime: unformattedEndTime, tickets} = timing;
            console.log(timing)
            const startTime = `${unformattedStartTime/100}:${unformattedStartTime%100}0`;
            const endTime = `${unformattedEndTime/100}:${unformattedEndTime%100}0`;
            const current = {startTime, endTime,tickets};
            timingArr.push(current);
        }
        const movie = {description, director, duration, price, timingArr};
        res.json({
            message: "Successfully fetched movie information",
            success: true,
            movie
        })
    } catch(err){
        console.log(err);
        res.json({
            message: 'Internal Server Error',
            success: 'false',
        })
    }
}
module.exports = {addMovie, addTimings, purchaseTicket, searchMovie};