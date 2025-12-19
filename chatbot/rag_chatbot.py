import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain.tools.retriever import create_retriever_tool
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.prompts import ChatPromptTemplate

# 1. Load Environment Variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# 2. Setup Database 
DB_path = "vector_db"

def create_vector_db():
    if os.path.exists(DB_path):
        print("✅ Database already exists!")
        return

    print("⚠️ Database not found! Creating new one...")
    pdf_path = "pet_care_data.pdf"  

    if not os.path.exists(pdf_path):
        print(f"❌ Error: '{pdf_path}' file not found!")
        return

    print("📄 Loading PDF...")
    loader = PyPDFLoader(pdf_path)
    docs = loader.load()

    print(f"✂️ Splitting text ({len(docs)} pages)...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(docs)

    print("🧠 Generating Embeddings locally (HuggingFace)...")
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    print("💾 Saving to FAISS Vector DB...")
    db = FAISS.from_documents(splits, embeddings)
    db.save_local(DB_path)
    print("✅ Database created successfully!")

# 3. Create the Agent
def get_qa_chain():
    if not os.path.exists(DB_path):
        create_vector_db()

    # Load Database
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    try:
        db = FAISS.load_local(DB_path, embeddings, allow_dangerous_deserialization=True)
    except:
        db = FAISS.load_local(DB_path, embeddings)

    
    # Tool 1: PDF Retriever
    retriever = db.as_retriever()
    retriever_tool = create_retriever_tool(
        retriever,
        "pet_care_pdf_search",
        "Search for specific pet care information, diseases, and guidelines explicitly found in the uploaded PDF document."
    )

    # Tool 2: Web Search (DuckDuckGo)
    search = DuckDuckGoSearchRun()
    from langchain.tools import Tool
    search_tool = Tool(
        name="web_search",
        func=search.run,
        description="Use this to search the internet for general knowledge, current events, or if the answer is NOT found in the PDF."
    )

    tools = [retriever_tool, search_tool]

    #making llm
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.7)

    #making the prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a super friendly and empathetic Pet Care Assistant 🐶. 
        
        Your goal is to help pet owners with their questions.
        1. FIRST, check the 'pet_care_pdf_search' tool to see if the answer is in the guide.
        2. IF the answer is NOT in the PDF, use the 'web_search' tool to find the answer from Google.
        3. Always verify the information and provide a safe, helpful answer.
        
        Tone:
        - Be warm, encouraging, and use emojis (🐾, 🐱, 💊).
        - If the topic is serious (like a sickness), be empathetic but advise seeing a vet.
        - Don't mention "I found this in the PDF" or "I searched Google". Just give the answer naturally.
        """),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}"),
    ])

    agent = create_tool_calling_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

    return agent_executor