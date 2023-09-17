const axios = require('axios')

const noInputSubmit = async (language, encodedCode, res) => {
    try {
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
                source_code: encodedCode
            }
        };

        const { data } = await axios.request(options);
        const token = data.token;

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

        let response;

        while (flag == 1) {
            // const {data} = await axios.request(options2);
            const response = await axios.request(options2);

            if (response.data.status_id > 2) {
                flag = 0;

                if (response.data.status_id > 4) {
                    const { compile_output, status } = response.data

                    const decodedCompileOutput = Buffer.from(compile_output, 'base64').toString()

                    console.log(decodedCompileOutput)

                    return res.status(202).send({ response: response, output: decodedCompileOutput, status_id: status.id, status: status.description });
                }

                const decodedOutput = Buffer.from(response.data.stdout, 'base64').toString()

                return res.status(202).send({ response: response.data, output: decodedOutput });
            }
        }

        console.log(output);

        return res.status(201).send({ output: decodedOutput })
    } catch (error) {
        console.log("Some error occurred", error.message)
        res.status(500).send(error);
    }
}





const customSubmit = async (input, language, encodedCode, res) => {
    try {
        const encInput = Buffer.from(input).toString('base64')

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

        let decodedOutput;

        while (flag == 1) {
            // const {data} = await axios.request(options2);
            const response = await axios.request(options2);

            if (response.data.status_id > 2) {
                flag = 0;

                if (response.data.status_id > 4) {
                    const { compile_output, status } = response.data

                    const decodedCompileOutput = Buffer.from(compile_output, 'base64').toString()

                    console.log(decodedCompileOutput)

                    return res.status(202).send({ response: response.data, output: decodedCompileOutput });
                }

                decodedOutput = Buffer.from(response.data.stdout, 'base64').toString()

                return res.status(201).send({ response: response.data, output: decodedOutput })
            }
        }

        //This will run if input is custom input
        return res.status(201).send({ response: response.data, output: decodedOutput })
    } catch (error) {
        console.log("Some error occurred", error.message)
        res.status(500).send(error);
    }

}





const testSubmit = async (input, language, encodedCode, expected, res) => {
    try {
        console.log(input)
        const encInput = Buffer.from(input).toString('base64')

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

                    return res.status(202).send({ response: response.data, output: decodedCompileOutput, status_id: status.id, status: status.description });
                }

                const decodedOutput = Buffer.from(response.data.stdout, 'base64').toString()


                if (decodedOutput === expected) {
                    console.log(decodedOutput)
                    return res.status(201).send({ response: response.data, output: decodedOutput, status: 'true' })
                }
                else {
                    console.log(decodedOutput)
                    return res.status(201).send({ response: response.data, output: decodedOutput, status: 'false' })
                }

            }
        }

        console.log(output, check);

        //This will run if input is custom input
        // return res.status(201).send({ output: decodedOutput })
        return res.status(201).send({ response: response.data, output: decodedOutput, status: 'true' })

    } catch (error) {
        console.log("Some error occurred", error.message)
        res.status(500).send(error);
    }

}

module.exports = { noInputSubmit, customSubmit, testSubmit }