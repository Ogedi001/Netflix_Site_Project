
const router = require('express').Router(),

    { hompage, getMovie, getRegister, getLogin, login, logout, searchMovie, registerUser } = require('./../controllers/app.controller'),

    requireAuth = require('./../middleware/UserAuth')



router.get('/home', requireAuth, hompage)
router.get('/movie', getMovie)

router.get('/search', searchMovie)

router.get('/register', getRegister)

router.post('/register', registerUser)

router.get('/login', getLogin)

router.post('/login', login)
router.get('/logout', logout)

module.exports = router