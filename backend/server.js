const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        const pythonApiResponse = await axios.post('http://localhost:8000/ask', { message, history });
        res.json({ reply: pythonApiResponse.data.reply });
    } catch (error) {
        res.status(500).json({ error: "Chatbot brain is not responding." });
    }
});

app.use('/api/services', require('./routes/serviceRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Manager's server is running on http://localhost:${PORT}`);
});