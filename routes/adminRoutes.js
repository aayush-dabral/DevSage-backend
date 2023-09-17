const router = require('express').Router()
const {createQue, viewQue, updateQue, deleteQue} = require('../controllers/adminControllers')

//Routing for displaying all questions
router.get('/questions', viewQue)

//Route for creating questions
router.post('/create', createQue)

//Route for updating questions
router.put('/update', updateQue)

//Route for deleting questions
router.delete('/delete', deleteQue)

module.exports = router;