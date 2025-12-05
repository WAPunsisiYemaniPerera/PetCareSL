import os
from dotenv import load_dotenv

# Google Gemini for the "Brain" (LLM)
from langchain_google_genai import ChatGoogleGenerativeAI

# Cohere for "Memory" (Embeddings)
from langchain_cohere import CohereEmbeddings

# Vector DB (FAISS)
from langchain_community.vectorstores import FAISS

# Prompt Templates
from langchain_core.prompts import PromptTemplate

# Load API keys
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
COHERE_API_KEY = os.getenv("COHERE_API_KEY")

if not GOOGLE_API_KEY or not COHERE_API_KEY:
    print("Error: API Keys not found in .env!")
    exit()

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3)

# Setup Embeddings (Memory)
embeddings = CohereEmbeddings(
    model="embed-english-v3.0", 
    user_agent="pet_chatbot"
)

# Load Database
try:
    vector_db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    retriever = vector_db.as_retriever()
    print("✅ Local Knowledge Base Loaded Successfully.")
except Exception as e:
    print(f"❌ Error loading database: {e}")
    exit()

# Chat Function
def get_answer(question):
    print(f"\n🤔 Thinking about: '{question}'...")

    # 1. Try to find in PDF
    try:
        docs = retriever.invoke(question)
        context_text = "\n\n".join([doc.page_content for doc in docs])
    except:
        context_text = ""

    # Prompt Template
    prompt_template_str = """
    You are a helpful Pet Care Assistant.
    
    First, check the Context below to answer the user's question.
    If the answer is in the context, use it.
    
    Context from Manual:
    {context}
    
    Question: {question}
    
    INSTRUCTIONS:
    1. If the answer is in the Context, answer using ONLY that information.
    2. If the answer is NOT in the Context, simply answer using your own general veterinary knowledge, but start your answer with: "(Note: This is general advice, not from the specific manual.)"
    """

    prompt = PromptTemplate(template=prompt_template_str, input_variables=["context", "question"])
    chain = prompt | llm

    # Ask Gemini
    try:
        response = chain.invoke({"context": context_text, "question": question})
        return response.content.strip()
    except Exception as e:
        return f"Error from Google API: {e}"

# Main Loop
if __name__ == "__main__":
    print("🤖 RAG Chatbot is Ready! (Type 'exit' to stop)")
    print("-" * 50)

    while True:
        user_input = input("\nYou: ")

        if user_input.lower() in ['exit', 'quit', 'bye']:
            print("👋 Goodbye!")
            break

        try:
            answer = get_answer(user_input)
            print(f"Bot: {answer}")
        except Exception as e:
            print(f"Bot: Something went wrong ({e}). Try again.")