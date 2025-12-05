import os
import time
from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_cohere import CohereEmbeddings
from langchain_community.vectorstores import FAISS

load_dotenv()
COHERE_API_KEY = os.getenv("COHERE_API_KEY")

if not COHERE_API_KEY:
    print("Error: COHERE_API_KEY not found in .env file!")
    exit()

def create_vector_db():
    print("Reading PDF file...")
    pdf_path = "pet_care_data.pdf" 

    try:
        loader = PyPDFLoader(pdf_path)
        documents = loader.load()
        print(f"PDF loaded successfully. Pages: {len(documents)}")
    except Exception as e:
        print(f"Error Loading PDF: {e}")
        return

    # break to chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size = 1000,
        chunk_overlap = 100
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Total chunks: {len(chunks)}")

    print("Generating Embeddings with Cohere (Free Tier)...")
    
    # Cohere Embeddings model
    embeddings = CohereEmbeddings(
        model="embed-english-v3.0", 
        user_agent="pet_chatbot"
    )

    
    batch_size = 50 
    vector_db = None

    for i in range(0, len(chunks), batch_size):
        batch = chunks[i : i + batch_size]
        print(f"Processing batch {i} to {i + len(batch)}...")

        try:
            if vector_db is None:
                vector_db = FAISS.from_documents(batch, embeddings)
            else:
                vector_db.add_documents(batch)
            
            
            time.sleep(2)

        except Exception as e:
            print(f"Error in batch: {e}")
            time.sleep(10)

    if vector_db:
        vector_db.save_local("faiss_index")
        print("🎉 Success! Database created using Cohere API!")
    else:
        print("Failed to create database.")

if __name__ == "__main__":
    create_vector_db()