const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
    try {
        const { message, history } = req.body;
        const pythonApiResponse = await axios.post('https://yemani-petcare-chatbot-new.hf.space/ask', { message, history });
        res.json({ reply: pythonApiResponse.data.reply });
    } catch (error) {
        console.error("Error in /chat route:", error.message);
        res.status(500).json({ error: "Chatbot brain is not responding." });
    }
});

module.exports = router;