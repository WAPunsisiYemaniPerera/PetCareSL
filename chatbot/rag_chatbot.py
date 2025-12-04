import os
from dotenv import load_dotenv

#google gemini embeddings
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
#vector db (FAISS)
from langchain_community.vectorstores import FAISS
#websearch tool (DuckDuckGo)
from langchain_community.tools import DuckDuckGoSearchRun
#prompt templates
from langchain.prompts import PromptTemplate

#Load API keys
load_dotenv()
GOOGLE_API_KEY=os.getenv("GOOGLE_API_KEY")

#setup
llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)

#embedding model
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

#load the saved db
try:
    vector_db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    retriever = vector_db.as_retriever()
    print("Local Knowledge Base Loaded.")
except:
    print("Erro: 'faiss_index' not found.")
    exit()