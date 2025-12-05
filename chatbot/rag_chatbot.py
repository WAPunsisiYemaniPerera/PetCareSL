import os
from dotenv import load_dotenv

# Google Gemini for the "Brain" (LLM)
from langchain_google_genai import ChatGoogleGenerativeAI

# Cohere for "Memory" (Embeddings) - MUST match create_vector_db.py
from langchain_cohere import CohereEmbeddings

# Vector DB (FAISS)
from langchain_community.vectorstores import FAISS

# Web Search Tool (DuckDuckGo)
from langchain_community.tools import DuckDuckGoSearchRun

# Prompt Templates
from langchain_core.prompts import PromptTemplate

# Load API keys from .env
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
COHERE_API_KEY = os.getenv("COHERE_API_KEY")

# Check if keys exist
if not GOOGLE_API_KEY:
    print("Error: GOOGLE_API_KEY not found in .env!")
    exit()
if not COHERE_API_KEY:
    print("Error: COHERE_API_KEY not found in .env!")
    exit()

# 1. Setup LLM (The Brain) - We still use Gemini Pro for high-quality answers
llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)

# 2. Setup Embeddings (The Memory) - Using Cohere to match the database
# Note: This model name must be the same as used in create_vector_db.py
embeddings = CohereEmbeddings(
    model="embed-english-v3.0", 
    user_agent="pet_chatbot"
)

# 3. Load the saved Database
try:
    # loading the FAISS index with the Cohere embeddings
    vector_db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    retriever = vector_db.as_retriever()
    print("✅ Local Knowledge Base Loaded Successfully.")
except Exception as e:
    print(f"❌ Error loading database: {e}")
    print("Please run 'create_vector_db.py' first.")
    exit()

# Web search tool setup
search_tool = DuckDuckGoSearchRun()

# Chat function logic
def get_answer(question):
    print(f"\n🤔 Thinking about: '{question}'...")

    # 1. Search from the PDF (Local Knowledge)
    docs = retriever.invoke(question)
    context_text = "\n\n".join([doc.page_content for doc in docs])

    # Prompt Template for Local Data
    prompt_template_str = """
    You are a helpful Pet Care Assistant.
    Answer the question based ONLY on the following context.
    
    Context:
    {context}
    
    Question: {question}
    
    If the answer is not in the context, simply say "I_DONT_KNOW". Do not make up an answer.
    """

    prompt = PromptTemplate(template=prompt_template_str, input_variables=["context", "question"])
    chain = prompt | llm

    # Ask the LLM
    response = chain.invoke({"context": context_text, "question": question})
    final_answer = response.content.strip()

    # 2. Fallback Mechanism: If PDF has no answer, search the Web
    if final_answer == "I_DONT_KNOW":
        print("🌍 Answer not found in PDF. Searching the Web...")

        # Search from Google (DuckDuckGo)
        try:
            web_results = search_tool.run(question)
        except:
            return "I'm sorry, I couldn't find information in the manual or connect to the web."

        # Prompt Template for Web Data
        web_prompt_template_str = """
        You are a helpful Pet Care Assistant.
        The user asked a question that was not in your manual.
        Here is some information found on the web:
        
        Web Results:
        {web_data}
        
        Question: {question}
        
        Please synthesize a helpful answer based on these web results.
        """

        web_prompt = PromptTemplate(template=web_prompt_template_str, input_variables=["web_data", "question"])
        web_chain = web_prompt | llm

        final_answer = web_chain.invoke({"web_data": web_results, "question": question}).content
        final_answer += "\n\n(Note: This information was sourced from the web 🌍)"
    
    return final_answer

# Main Loop
if __name__ == "__main__":
    print("🤖 RAG Chatbot is Ready! (Type 'exit' to stop)")
    print("-" * 50)

    while True:
        user_input = input("\nYou: ")

        if user_input.lower() in ['exit', 'quit', 'bye']:
            print("👋 Goodbye!")
            break

        answer = get_answer(user_input)
        print(f"Bot: {answer}")