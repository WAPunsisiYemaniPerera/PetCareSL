const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json()); //understand the JSON data from frontend

//accepting /chat requests
app.post('/chat', async (req,res)=>{
    try{
        //get the message from the frontend
        const {message} = req.body;

        //send that message to Python API
        const pythonApiResponse = await axios.post('http://localhost:8000/ask',{
            message : message
        });

        //send the responnse from Python API to Frontend
        res.json({
            reply: pythonApiResponse.data.reply
        });
    } catch (error){
        console.error("Error communicating with Python API: ", error.message);
        res.status(500).json({
            error: "Sorry, something went wrong with the chatbot brain."
        });
    }
});

const PORT = 5000;
app.listen(PORT, ()=>{
    console.log('Manager server is running on http://localhost:${PORT}');
})

