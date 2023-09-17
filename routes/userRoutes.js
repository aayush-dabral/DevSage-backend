const router = require('express').Router();
const {viewQue, check, submit, search, compile} = require('../controllers/userControllers')
const Authenticate = require('../middleware/Authenticate')

//View Questions
router.get('/questions', viewQue)

//Search a Question
router.get('/search', search)

//Check Authentication
router.get('/check', check)

//Compile code
router.post('/compile', compile) 

//Check the solution
router.post('/submission', submit)

module.exports = router;