from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from chatbot import chatbot_instance

class ChatRequest(BaseModel):
    message: str

app = FastAPI(
    title="PetCareSL Chatbot API",
    description="APU for the PetCareSL RAG chatbot.",
    version="1.0.0"
)

@app.post("/ask", tags=["Chatbot"])

def ask_chatbot(request: ChatRequest):
    """
    Receives a question, sends it to the chatbot brain, and returns the response.
    """
    user_message = request.message

    #Get the answer itself
    bot_response = chatbot_instance.get_response(user_message)

    return {"reply": bot_response}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)