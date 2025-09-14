# PetCareSL - Your AI-Powered Pet Care Hub for Sri Lanka 🐾

Welcome to PetCareSL, a comprehensive, full-stack web application designed to be the ultimate digital assistant for pet owners in Sri Lanka. This project addresses the challenge of finding reliable, localized pet care information and services by bringing everything into one user-friendly platform.

This is a complete MERN stack application featuring a sophisticated RAG (Retrieval-Augmented Generation) chatbot powered by a separate Python backend.

---

## ✨ Key Features

* **🤖 AI Conversational Assistant:** An intelligent and friendly chatbot that provides instant answers to pet care questions. It leverages a RAG pipeline to provide accurate information from a knowledge base and can search the web for general queries.
* **📍 Hyper-Local Service Directory:** A curated and searchable directory of pet services in Sri Lanka, including Vet Clinics, Groomers, Pet Shops, and Boarding facilities.
* **🗺️ Interactive Map View:** Service locations are plotted on an interactive Leaflet.js map, allowing users to easily visualize nearby options.
* **🔍 Search & Filtering:** Users can search the directory by name and filter services by type (e.g., show only Vet Clinics), making it easy to find exactly what they need.
* **💬 Dynamic, Multi-Page Interface:** Built with React Router, providing a seamless multi-page experience for navigating between the chatbot and the service directory.
* **Modern & Responsive UI:** A clean, beautiful, and user-friendly interface with animated elements like typing indicators and auto-scrolling chat.

---

## 📸 Application Preview

![PetCareSL Chat Interface](https://via.placeholder.com/800x450.png?text=GIF+of+Chatbot+Conversation)
*A preview of the chatbot in action.*

![PetCareSL Service Directory](https://via.placeholder.com/800x450.png?text=Screenshot+of+Service+Directory+and+Map)
*The interactive service directory with map view.*

---

## 🛠️ Tech Stack & Architecture

This project is built with a modern, decoupled architecture to ensure scalability and maintainability.

### Architecture

```
[React Frontend] <--> [Node.js/Express Backend] <--> [MongoDB]
       |
       '------> [Python/FastAPI Chatbot API] <--> [Vector Store / LLM]
```

### Technologies Used

* **Frontend:**
    * React.js
    * React Router
    * Axios
    * Leaflet.js (for maps)
    * CSS3

* **Backend (MERN):**
    * Node.js
    * Express.js
    * MongoDB (with Mongoose)
    * JSON Web Tokens (for future authentication)

* **AI Chatbot Backend (Python):**
    * Python
    * FastAPI (for the API)
    * LangChain (for the RAG pipeline)
    * Hugging Face Embeddings (for text vectorization)
    * ChromaDB (as the vector store)
    * OpenRouter (to access LLMs like Mistral)
    * Tavily AI (for web search)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js installed ([https://nodejs.org/](https://nodejs.org/))
* Python installed ([https://www.python.org/](https://www.python.org/))
* Git installed ([https://git-scm.com/](https://git-scm.com/))
* A MongoDB Atlas account or local MongoDB installation.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [YOUR_GITHUB_REPO_URL]
    cd PetCareSL
    ```

2.  **Setup the Chatbot API (Python):**
    * Navigate to the `chatbot-api` directory.
    * Create a `.env` file and add your API keys:
        ```env
        OPENAI_API_KEY="sk-or-your-openrouter-api-key"
        TAVILY_API_KEY="tvly-your-tavily-api-key"
        ```
    * Create a virtual environment and install dependencies:
        ```sh
        python -m venv venv
        source venv/bin/activate  # On Windows: .\venv\Scripts\activate
        pip install -r requirements.txt
        ```
    * Run the API server:
        ```sh
        uvicorn main:app --reload
        ```
    The API will be running on `http://localhost:8000`.

3.  **Setup the Main Backend (Node.js):**
    * In a new terminal, navigate to the `backend` directory.
    * Create a `.env` file and add your MongoDB connection string:
        ```env
        MONGO_URI="your_mongodb_connection_string"
        ```
    * Install dependencies:
        ```sh
        npm install
        ```
    * (Optional) Seed the database with sample data:
        ```sh
        node seeder/seeder.js
        ```
    * Run the server:
        ```sh
        node server.js
        ```
    The server will be running on `http://localhost:5000`.

4.  **Setup the Frontend (React):**
    * In a third terminal, navigate to the `frontend` directory.
    * Install dependencies:
        ```sh
        npm install
        ```
    * Run the React app:
        ```sh
        npm start
        ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 🛣️ Future Roadmap

This project has a lot of potential for growth. Here are some features planned for the future:
* [ ] User Accounts & Authentication (Login/Register)
* [ ] Ability for Users to Submit and Manage Reviews
* [ ] "Digital Pet Book" - Pet Profiles with Health Record Tracking
* [ ] Community Forum
* [ ] Adoption Section in partnership with local shelters
