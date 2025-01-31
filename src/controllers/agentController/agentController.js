const fetchAgentDataSerivce = require("../../services/agentService/agentService");

const fetchAllAgentController = (req, res) => {
    fetchAgentDataSerivce.fetchAllAgentService((err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
}


const fetchAllResponsesController = (req, res) => {
    fetchAgentDataSerivce.fetchfetchAllResponsesService((err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
}



const addNewAgentController = (req, res) => {
    const {
        name,
        category,
        agent_prompt,
        inputType,
        outputType,
        modal,
        accuracy,
        status,
        purpose
    } = req.body;
    fetchAgentDataSerivce.addNewAgentService(name,
        category,
        agent_prompt,
        inputType,
        outputType,
        modal,
        accuracy,
        status,
        purpose, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
}

const fetchAgentDataController = (req, res) => {
    const { agent_id } = req.body;
    fetchAgentDataSerivce.fetchAgentDataService(agent_id, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

function replaceAllSquareBracketText(text, replacement) {
    return text.replace(/\[.*?\]/g, replacement);
}


const fetchResponseOfPrompt = async (req, res) => {
    const { textInputUser, PromtArrat } = req.body;
    let currentTextInput = textInputUser;
    let result = []
    try {
        for (const prompt of PromtArrat) {
            const properPrompt = replaceAllSquareBracketText(prompt.prompt, textInputUser)
            const response = await fetchAgentDataSerivce.generarteResponseService(currentTextInput, properPrompt);
            if (response && response.choices && response.choices.length > 0) {
                currentTextInput = response.choices[0].message.content;
                result.push({
                    prompt_text: properPrompt,
                    response_text: response.choices[0].message.content
                })
                let agentdata = {
                    agent_id: Math.floor(Math.random() * 50) + 1,
                    prompt_text: properPrompt,
                    response_text: response.choices[0].message.content
                }
                fetchAgentDataSerivce.storeAgentResponseService(agentdata, (err, results) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                });
            } else {
                throw new Error(`No valid response for ${prompt}`);
            }
        }
        res.json({ message: 'All prompts processed successfully', result });
    } catch (error) {
        res.status(500).json({ error: 'Error processing the prompts', details: error.message });
    }
}


module.exports = {
    fetchAgentDataController,
    addNewAgentController,
    fetchResponseOfPrompt,
    fetchAllAgentController,
    fetchAllResponsesController
};