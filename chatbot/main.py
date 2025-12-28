from langchain_core.messages import HumanMessage, AIMessage
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from rag_chatbot import get_qa_chain
from typing import List, Optional


app = FastAPI()

class QueryRequest(BaseModel):
    message: str          
    history: List[dict] = [] 

print("Loading Chatbot Model...")
qa_chain = get_qa_chain()
print("Chatbot Model Loaded!")

@app.post("/ask")
async def ask_question(request: QueryRequest):
    try:
        if qa_chain is None:
            raise HTTPException(status_code=500, detail="Model setup failed.")
            
        # cpnvert history for langchain format
        chat_history = []
        for msg in request.history:
            if msg.get('role') == 'human' or msg.get('role') == 'user':
                chat_history.append(HumanMessage(content=msg.get('content', '')))
            else:
                chat_history.append(AIMessage(content=msg.get('content', '')))
            
        # send history to the agent
        response = qa_chain.invoke({
            "input": request.message,
            "chat_history": chat_history 
        })
        
        return {"reply": response["output"]}
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return {"reply": "I'm sorry, I encountered an internal error. Please check the server logs."}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)