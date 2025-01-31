const db = require('../../config/db');
const axios = require('axios');

const fetchAllAgentService = (callback) => {
    const query = `SELECT * FROM agents`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
}
// fetchfetchAllResponsesService

const fetchfetchAllResponsesService = (callback) => {
    const query = `SELECT * FROM agent_prompt_responses`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
}

const addNewAgentService = (name,
    category,
    agent_prompt,
    inputType,
    outputType,
    modal,
    accuracy,
    status,
    purpose, callback) => {
    const insertQuery = `
        INSERT INTO agents (name, category, agent_prompt, inputType, outputType, modal, accuracy, status, purpose)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [name, category, agent_prompt, inputType, outputType, modal, accuracy, status, purpose];
    db.query(insertQuery, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
}

const fetchAgentDataService = (agent_id, callback) => {
    const query = `
    SELECT * FROM agent_data WHERE agent_id = ?
  `;
    db.query(query, [agent_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
};


const storeAgentResponseService = (agentData, callback) => {
    const query = `
    INSERT INTO agent_prompt_responses (agent_id, prompt_text, response_text)
    VALUES (?, ?, ?)
`;
    const { agent_id, prompt_text, response_text } = agentData;
    db.query(query, [agent_id, prompt_text, response_text], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
};



const generarteResponseService = async (textInputUser, prompt) => {
    try {
        const promptText = `${textInputUser} - ${prompt}`;
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: promptText || "Say this is a test!" }],
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
                },
            }
        );
        return response.data;
    } catch (err) {
        console.error('Error in API call:', err.message);
        throw new Error('Failed to generate response');
    }
}


module.exports = {
    fetchAgentDataService,
    addNewAgentService,
    storeAgentResponseService,
    generarteResponseService,
    fetchAllAgentService,
    fetchfetchAllResponsesService
};
