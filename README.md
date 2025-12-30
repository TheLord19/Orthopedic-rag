# OrthoInsight

Orthopedic RAG Assistant
OrthoInsight is a specialized medical research assistant designed to answer orthopedic queries with high accuracy. Built on a Retrieval-Augmented Generation (RAG) architecture, it grounds its responses in a curated dataset of research papers, clinical guidelines, and anatomical atlases to minimize hallucinations and provide evidence-based insights.

The application features a multi-modal interface capable of processing text, voice, and image inputs, serving as a support tool for clinicians, researchers, and medical students.

Key Features
Domain-Specific RAG Engine Retrieves context from indexed orthopedic literature before generating answers to ensure technical accuracy.

Multi-Modal Input The system supports three distinct input modes. Text mode accepts complex clinical queries and case descriptions. Voice mode integrates speech-to-text functionality for hands-free operation. Vision mode analyzes uploaded medical imagery (X-rays, MRI slices) alongside text prompts.

Contextual Chat History Maintains conversation state to facilitate iterative questioning and follow-up inquiries.

Source Transparency Capable of citing specific guidelines or papers used during the generation process.

Responsive Design Optimized for use on both desktop workstations and mobile tablet devices in clinical settings.

Technical Stack
Framework: Next.js (App Router) Language: TypeScript Styling: Tailwind CSS AI Orchestration: LangChain / Vercel AI SDK Model Provider: OpenAI (GPT-4 / GPT-4-Vision) Vector Database: Pinecone (or compatible vector store) Deployment: Vercel

Project Structure
The project follows a standard Next.js App Router architecture. The app directory contains application routes and page logic, including the API endpoints for chat and RAG retrieval. The components directory houses reusable React components for chat rendering, UI elements, and voice input handling. The lib directory contains utility libraries and the RAG implementation logic.

Installation and Setup
Prerequisites
Ensure you have Node.js (Version 18 or higher) installed, along with API Keys for the LLM provider (OpenAI) and your Vector Database.

Steps
1. Clone the Repository Run the following command to download the source code:

Bash

git clone https://github.com/TheLord19/Orthopedic-rag.git
cd Orthopedic-rag
2. Install Dependencies Install the required project libraries:

Bash

npm install
3. Environment Configuration Create a file named .env.local in the root directory and configure the variables for OPENAI_API_KEY, PINECONE_API_KEY, PINECONE_INDEX, and NEXT_PUBLIC_APP_URL.

4. Run Development Server Start the local development environment:

Bash

npm run dev
The application will be accessible at http://localhost:3000.

Architecture Workflow
Ingestion Medical documents are processed, chunked, and embedded into the vector database.

Retrieval User queries are converted into vector embeddings to search for semantically relevant text chunks within the database.

Generation The retrieved context and the user query are passed to the Large Language Model.

Response The model generates an answer based strictly on the provided medical context.

Medical Disclaimer
For Research and Educational Use Only.

OrthoInsight is an AI-assisted tool and is not a substitute for professional medical judgment, diagnosis, or treatment. While the system aims to provide accurate information based on medical literature, all outputs should be verified against primary clinical sources before application in patient care.

License
This project is licensed under the MIT License.
