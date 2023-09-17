const axios = require('axios')
const Question = require('../models/Question');
const User = require('../models/User');

const { noInputSubmit, customSubmit, testSubmit } = require('../utils/submitFunctions')

exports.viewQue = async (req, res, next) => {
    try {
        const questions = await Question.find();
        if (!questions || questions.length === 0) {
            return res.status(403).send("No questions found");
        }
        res.send(questions);
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.search = async (req, res) => {
    try {
        const { qname } = req.query;

        const question = await Question.findOne({ qname })

        if (!question) {
            return res.status(202).send("No question with this name found");
        }

        res.status(201).send(question);

    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).send('Something went wrong!');
    }
}

exports.check = (req, res) => {
    res.status(201).send(req.user.roles);
}

exports.compile = async (req, res, next) => {
    try {
        let { qname, language, code, input } = req.body;

        let TestPresent = 'false';
        let expected;

        const encodedCode = Buffer.from(code).toString('base64');

        //If no custom input, make the default test case as the input
        //If no default test case, make request without input
        if (!input) {
            const { testCases } = await Question.findOne({ qname })

            //setting default test case as input
            if (testCases.length != 0) {
                input = testCases[0].input;
                TestPresent = 'true'
                expected = testCases[0].expected;

                await testSubmit(input, language, encodedCode, expected, res)
            }

            //Making compile request without any input
            else {
                await noInputSubmit(language, encodedCode, res)
            }
        }

        else {
            await customSubmit(input, language, encodedCode, res)
        }
    }
    catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send(error);
    }
}

exports.submit = async (req, res, next) => {
    try {
        const { qname, language, code } = req.body;

        const encodedCode = Buffer.from(code).toString('base64');

        const { testCases } = await Question.findOne({ qname })

        let output = []
        let check = 0;
        let status = [];

        for (const index in testCases) {

            const { input, expected } = testCases[index];

            const encInput = Buffer.from(input).toString('base64')

            console.log(testCases[index].input);


            // console.log(encInput);
            // console.log(encodedCode)

            // const options = {
            //     method: 'POST',
            //     url: 'https://online-code-compiler.p.rapidapi.com/v1/',
            //     headers: {
            //         'content-type': 'application/json',
            //         'X-RapidAPI-Key': '4275b8846bmsh1b59b1236d03d56p16f44ajsnd345868e2c5f',
            //         'X-RapidAPI-Host': 'online-code-compiler.p.rapidapi.com'
            //     },
            //     data: {
            //         language: language,
            //         code: encodedCode,
            //         input: encInput,
            //     }
            // };

            const options = {
                method: 'POST',
                url: 'https://judge0-ce.p.rapidapi.com/submissions',
                params: {
                    base64_encoded: 'true',
                    fields: '*'
                },
                headers: {
                    'content-type': 'application/json',
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': '4275b8846bmsh1b59b1236d03d56p16f44ajsnd345868e2c5f',
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                },
                data: {
                    language_id: language,
                    source_code: encodedCode,
                    stdin: encInput
                }
            };

            const { data } = await axios.request(options);
            const token = data.token;
            // console.log(token);
            let flag = 1;

            const options2 = {
                method: 'GET',
                url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
                params: {
                    base64_encoded: 'true',
                    fields: '*'
                },
                headers: {
                    'X-RapidAPI-Key': '4275b8846bmsh1b59b1236d03d56p16f44ajsnd345868e2c5f',
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                }
            };

            while (flag == 1) {
                // const {data} = await axios.request(options2);
                const response = await axios.request(options2);

                if (response.data.status_id > 2) {
                    flag = 0;

                    if (response.data.status_id > 4) {
                        const { compile_output, status } = response.data

                        const decodedCompileOutput = Buffer.from(compile_output, 'base64').toString()

                        console.log(decodedCompileOutput)

                        return res.status(202).send({ output: decodedCompileOutput, status_id: status.id, status: status.description });
                    }
                    const decodedOutput = Buffer.from(response.data.stdout, 'base64').toString()

                    output[index] = decodedOutput;

                    if (decodedOutput === expected) {
                        check++;
                        status[index] = 'true'
                    }
                    else {
                        status[index] = 'false'
                    }
                }
            }

            console.log(output, check);
        }

        res.status(200).send({ outputs: output, result: check, status: status });

    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send(error);
    }
}