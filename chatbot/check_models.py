import os
from dotenv import load_dotenv
import google.generativeai as genai

# 1. Load API Key
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("❌ Error: API Key not found!")
    exit()

genai.configure(api_key=api_key)

print("🔍 Checking available models for your API Key...\n")

try:
    # 2. List all models
    count = 0
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ Found: {m.name}")
            count += 1
            
    if count == 0:
        print("⚠️ No Chat models found. Check if 'Generative AI API' is enabled in Google Cloud Console.")
        
except Exception as e:
    print(f"❌ Error connecting to Google: {e}")