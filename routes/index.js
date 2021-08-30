const router = require('express').Router();
const { login, signup } = require('../controllers/auth');
const { addMovie, addTimings, purchaseTicket, searchMovie } = require('../controllers/movies');

router.post('/login', login);
router.post('/signup', signup);

router.post('/movie',addMovie);
router.post('/timings',addTimings);
router.patch('/purchase',purchaseTicket);
router.get('/movie', searchMovie)


module.exports = router;