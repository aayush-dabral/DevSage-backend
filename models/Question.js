const mongoose = require('mongoose')

const qTag = new mongoose.Schema({
    type: String
})

const Case = new mongoose.Schema({
    input:{
        type: String,
        required: true,
    },
    expected:{
        type: String,
        required: true,
    }
})

const questionSchema = new mongoose.Schema({
    qname:{
        type: String,
        required: true,
        unique: true,
    },
    qbody: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    inpFormat: {
        type: String,
        required: true,
    },
    tags: {
        type: [String]
    },
    testCases: [Case],
})

const Question = mongoose.model('question', questionSchema);
module.exports = Question;