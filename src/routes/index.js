const express = require('express');
const fetchAgentDataController = require('../controllers/agentController/agentController');
const router = express.Router();

// for testing only 

router.post('/fetchAllAgents', fetchAgentDataController.fetchAllAgentController);
router.post('/fetchAllResponse', fetchAgentDataController.fetchAllResponsesController)
router.post('/addNewAgent', fetchAgentDataController.addNewAgentController);
router.post('/fetchAgentdata', fetchAgentDataController.fetchAgentDataController);
router.post('/generarteResponse', fetchAgentDataController.fetchResponseOfPrompt);

module.exports = router;
