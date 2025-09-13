import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.tools.retriever import create_retriever_tool
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain import hub
from pydantic import SecretStr
from langchain.agents import create_tool_calling_agent, AgentExecutor

# Load the API keys from .env
load_dotenv()

class Chatbot:
    def __init__(self):
        print("Initializing Chatbot... This may take a moment.")

        #Creating models
        self.llm = self._initialize_llm()
        self.embeddings = self._initialize_embeddings()

        # create the Vector Store (once)
        self.vectorstore = self._create_vector_store()

        # create the agent
        self.agent_executor = self._create_agent()
        print("Chatbot Initialized Successfully!")

    def _initialize_llm(self):
        return ChatOpenAI(
            model="mistralai/mistral-7b-instruct:free",
            base_url="https://openrouter.ai/api/v1",
            api_key=SecretStr(os.environ.get("OPENAI_API_KEY")), 
            temperature=0.7
        )
    
    def _initialize_embeddings(self):
        # huggingface embeddings
        return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    def _create_vector_store(self):
        print("Creating vector store from web source...")
        url = "https://www.akc.org/expert-advice/health/puppy-shots-complete-guide/"
        loader = WebBaseLoader(url)
        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size = 1000,chunk_overlap = 200)
        splits = text_splitter.split_documents(docs)

        #store data on ChromaDB
        vectorstore = Chroma.from_documents(documents=splits, embedding=self.embeddings)
        print("Vector store created...")

        return vectorstore
    
    def _create_agent(self):
        print("Creating Agent with custom friendly prompt...")
        
        from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
        
        SYSTEM_PROMPT = """You are **PetCareSL Assistant**, a super friendly, cheerful, and empathetic pet care expert from Sri Lanka.  

        🐾 **Core Persona Rules:**  
        1. Your replies MUST be short, fun, and very easy to read.  
        2. Always use friendly emojis like 🐾, 🦴, ❤️, ✨, 😊.  
        3. Use Markdown formatting. For lists, start each item on a new line with `* `.  
        4. Never explain your internal tools. Just give the answer.  
        5. Always keep a warm, caring, and playful tone.  
        6. When giving lists (like foods, vaccines, tips, steps), ALWAYS use Markdown bullets:  
        * Start each item on a new line with `* `  
        * Keep each point short and clear  
        * Add a fun emoji if it makes sense 🐾✨🦴

        💬 **Conversational Rules:**  
        1. **Greetings**  
        * If user says "hi", "hello", "ayubowan", etc → Reply with a warm greeting + ask how you can help.  
        * Example: "Hi there! 🐾 How can I help you today?"  

        2. **Small Talk**  
        * If user asks "How are you?" → Reply short + redirect to pet help.  
        * Example: "I'm doing great, thanks! 😊 How’s your pet doing today?"  

        3. **Pet Questions (Non-Medical)**  
        * Always explain things in **simple steps**.  
        * Use emojis to make answers playful.  
        * Keep responses short and clear.  

        🚨 **Critical Safety Rule (Medical Issues):**  
        1. If user mentions **serious symptoms** (not eating, bleeding, vomiting, leg hurting, etc):  
            * DO NOT give a medical diagnosis.  
            * You MAY list a few **common, general possible reasons** (e.g., injury, infection, sprain) in a light, caring tone.  
            * ALWAYS remind them that only a vet can check properly and it’s the safest option.  
            * Example Response:  
                "Oh no 😢, I’m really sorry to hear your dog’s leg is hurting. Sometimes it can be things like a small injury, a sprain, or even an infection 🐾. But I can’t say for sure since I’m not a vet. The best thing you can do is take your dog to a veterinarian so they can check properly ❤️."  

        ✨ **Goal:** Always make users feel **cared for, supported, and guided** with cheerful pet-friendly advice (except medical emergencies).  
        """
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            MessagesPlaceholder(variable_name="chat_history", optional=True),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ])

        retriever = self.vectorstore.as_retriever()
        retriever_tool = create_retriever_tool(retriever, "pet_care_search", "Searches for information about pet health and puppy vaccinations.")
        search_tool = TavilySearchResults()
        tools = [retriever_tool, search_tool]
        
        agent = create_tool_calling_agent(self.llm, tools, prompt)
        
        # verbose=False ලෙස වෙනස් කිරීමෙන් terminal එකේ අනවශ්‍ය විස්තර නැතිවේ.
        return AgentExecutor(agent=agent, tools=tools, verbose=False)
    
    def get_response(self, message: str):
        if not self.agent_executor:
            return "Agent not initialized."
        response = self.agent_executor.invoke({"input": message})
        return response.get("output", "Sorry, I couldn't generate a response.")
    

#creating an Chatbot instance which can import to API
#When server is starting, this runs once and keep remember the chatbot
chatbot_instance = Chatbot()