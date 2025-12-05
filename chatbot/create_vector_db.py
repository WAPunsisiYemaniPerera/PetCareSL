import os
from dotenv import load_dotenv

#the tools for read the document
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

#the tool that converts that convert words to numbers/vectors
from langchain_google_genai import GoogleGenerativeAIEmbeddings

#The database that stores the vectors in db (FAISS)
from langchain_community.vectorstores import FAISS

#get the key from .env
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    print("Error: Google API Key not found in .env file!")
    exit()

def create_vector_db():
    print("Reading PDF file...")

    #load the text file
    pdf_path = "chatbot/pet_care_data.pdf"
    try:
        loader = PyPDFLoader(pdf_path)
        documents = loader.load()
        print(f"PDF loaded successfully. Total pages: {len(documents)}")

    except Exception as e:
        print(f"Error Loading PDF: {e}")
        return
    
    #break into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size = 500,
        chunk_overlap = 50
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Document split into {len(chunks)} chunks.")

    #make embeddings
    print("Generating Embeddings...")
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    #save vector db
    vector_db = FAISS.from_documents(chunks, embeddings)
    vector_db.save_local("faiss_index")

    print("Success! PDF knowledge base created in 'faiss_index .")

if __name__ == "__main__":
    create_vector_db()