from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from rag_chatbot import get_answer 

app = FastAPI()

# 1. Node.js data shape
class ChatRequest(BaseModel):
    message: str
    history: list | None = None  

# 2. API Endpoint
@app.post("/ask")
def ask_chatbot(request: ChatRequest):
    user_message = request.message
    print(f"📥 Received from Node.js: {user_message}")
    
    try:
        
        bot_response = get_answer(user_message)
        print(f"📤 Sending back: {bot_response[:50]}...") 
        return {"reply": bot_response}
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return {"reply": "I'm having trouble thinking right now. Please check the server logs."}

# 3. Server Start Logic
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)