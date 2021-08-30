const router = require('express').Router();
const { login, signup } = require('../controllers/auth');
const { addMovie, addTimings, purchaseTicket, searchMovie } = require('../controllers/movies');
router.post('/login', login);
router.post('/signup', signup);
// add movie POST  /admin/movie       required fields( movie name, description, director, duration)
// add timings POST /admin/timings    add timings,price,total tickets for existing added movies. 
// purchase tickets POST /purchase already added movie at a specific time
router.post('/movie',addMovie);
router.post('/timings',addTimings);
router.patch('/purchase',purchaseTicket);
router.get('/movie', searchMovie)


module.exports = router;