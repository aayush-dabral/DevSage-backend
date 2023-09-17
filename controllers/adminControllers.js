const Question = require('../models/Question')

exports.viewQue = async (req, res, next) => {
    try {
        const questions = await Question.find();
        if(!questions || questions.length === 0){
            return res.status(403).send("No questions found");
        }
        res.send(questions);
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.createQue = async (req, res, next) => {
    try {
        const { qname, qbody, inpFormat, tags, testCases } = req.body;
        const match = await Question.findOne({ qname });
        if (match) {
            return res.status(202).send("A question with this name already exists");
        }

        const question = new Question(req.body);
        // console.log(question);
        await question.save();
        return res.send("Question created successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while creating the question");
    }
}

exports.updateQue = async (req, res) => {
    try {
        const { questionName, name, qbody, difficulty, inpFormat, tags, testCases } = req.body;
        let question = await Question.findOne({ qname: questionName });
        if(!question){
            return res.status(202).send("No question found")
        }
        //update question fields individually
        question.qname = name;
        question.qbody = qbody;
        question.difficulty = difficulty;
        question.inpFormat = inpFormat;
        question.tags = tags;
        question.testCases = testCases;

        await question.save();

        res.status(201).send("Question updated successfully")
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occured while updating the question")
    }
}

exports.deleteQue = async (req, res) => {
    try {
        const {qname} = req.body;
        const question = await Question.findOne({qname});
        if(!question){
            return res.status(202).send("No question found")
        }

        await Question.deleteOne({qname})
        res.status(200).send("Question deleted successfully");
    } catch (error) {
        console.log(error)
        res.status(500).send("An error occured while deleting the question")
    }
}