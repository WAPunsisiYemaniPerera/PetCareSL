import os
from dotenv import load_dotenv

#the tools for read the document
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter