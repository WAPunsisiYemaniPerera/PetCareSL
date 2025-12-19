import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# 1. Load Environment Variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    print("⚠️ Error: GOOGLE_API_KEY not found in .env file!")

# 2. Settings
DB_FAISS_PATH = "faiss_index"
PDF_PATH = "pet_care_data.pdf"

# 3. Vector Database Setup
def create_vector_db():
    if not os.path.exists(PDF_PATH):
        print(f"❌ Error: {PDF_PATH} file not found!")
        return

    print("📄 Loading PDF...")
    loader = PyPDFLoader(PDF_PATH)
    documents = loader.load()

    print(f"✂️ Splitting text ({len(documents)} pages)...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = text_splitter.split_documents(documents)

    print("🧠 Generating Embeddings locally (HuggingFace)...")
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2",
                                       model_kwargs={'device': 'cpu'})

    print("💾 Saving to FAISS Vector DB...")
    db = FAISS.from_documents(texts, embeddings)
    db.save_local(DB_FAISS_PATH)
    print("✅ Database created successfully!")

# 4. Chatbot Logic (New LCEL Method)
def get_qa_chain():
    # Embeddings
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2",
                                       model_kwargs={'device': 'cpu'})
    
    # Check DB
    if not os.path.exists(DB_FAISS_PATH):
        print("⚠️ Database not found! Running create_vector_db() first...")
        create_vector_db()

    # Load DB
    try:
        db = FAISS.load_local(DB_FAISS_PATH, embeddings, allow_dangerous_deserialization=True)
    except Exception as e:
        print(f"❌ Error loading DB: {e}")
        return None
    
    # Setup LLM
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.5)

    # Setup Retriever
    retriever = db.as_retriever(search_kwargs={'k': 3})

    # Create Prompt Template (New Way)
    prompt = ChatPromptTemplate.from_template("""
    Answer the following question based only on the provided context:

    <context>
    {context}
    </context>

    Question: {input}
    """)

    # Create Chains (New RAG Method)
    document_chain = create_stuff_documents_chain(llm, prompt)
    retrieval_chain = create_retrieval_chain(retriever, document_chain)

    return retrieval_chain

if __name__ == "__main__":
    create_vector_db()