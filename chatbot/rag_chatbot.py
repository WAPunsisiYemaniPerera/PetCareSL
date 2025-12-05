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
    print("Error: 'faiss_index' not found.")
    exit()

#web search tool
search_tool = DuckDuckGoSearchRun()

#chat function logic
def get_answer(question):
    print(f"\n🤔 Thinking about: '{question}'...")

    #search from the pdf
    docs = retriever.get_relevant_documents(question)
    context_text = "\n\n".join([doc.page_content for doc in docs])

    #tell gemini , give the answer from this context
    #if do not know the answer then say to say don't know
    PromptTemplate = """
    You are a helpful Pet Care Assistant.
    Answer the question based ONLY on the following context.
    
    Context:
    {context}
    
    Question: {question}
    
    If the answer is not in the context, simply say "I_DONT_KNOW". Do not make up an answer.
    """

    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = prompt | llm

    response = chain.invoke({"context": context_text, "question":question})
    final_answer = response.content.strip()

    #if pdf has no answer (fallback to google)
    if final_answer == "I_DONT_KNOW":
        print("🌍 Answer not found in PDF. Searching the Web...")

        #search from google DuckDuckGo
        web_results = search_tool.run(question)

        #create the answer using web results
        web_prompt_template = """
        You are a helpful Pet Care Assistant.
        The user asked a question that was not in your manual.
        Here is some information found on the web:
        
        Web Results:
        {web_data}
        
        Question: {question}
        
        Please synthesize a helpful answer based on these web results.
        """

        web_prompt = PromptTemplate(template=web_prompt_template, input_variables=["web_data", "question"])
        web_chain = web_prompt | llm

        final_answer = web_chain.invoke({"web_data":web_results, "question": question}).content
        final_answer += "\n\n(Note: This information was sourced from the web 🌍)"
    
    return final_answer

if __name__ == "__main__":
    print("🤖 RAG Chatbot is Ready! (Type 'exit' to stop)")
    print("-" * 50)

    while True:
        user_input = input("\nYou: ")

        if user_input.lower() in ['exit', 'quit', 'bye']:
            break

        answer = get_answer(user_input)
        print(f"Bot: {answer}")
