# OrthoInsight

## Orthopedic RAG Assistant

OrthoInsight is a specialized medical research assistant designed to answer orthopedic queries with high accuracy. Built on a **Retrieval-Augmented Generation (RAG)** architecture, it grounds responses in curated orthopedic literature to minimize hallucinations and ensure evidence-based insights.

The application supports **text, voice, and image inputs**, making it suitable for clinicians, researchers, and medical students.

## Key Features

- **Domain-Specific RAG Engine**  
  Retrieves context from indexed orthopedic research papers, clinical guidelines, and anatomical atlases.

- **Multi-Modal Input**  
  - Text-based clinical queries  
  - Voice input with speech-to-text  
  - Medical image analysis (X-rays, MRI) with prompts

- **Contextual Chat History**  
  Maintains conversation state for follow-up queries.

- **Source Transparency**  
  Can cite specific research papers or guidelines used during response generation.

- **Responsive Design**  
  Optimized for desktop and tablet use in clinical environments.


## Technical Stack

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- AI Orchestration: LangChain, Vercel AI SDK
- Model Provider: OpenAI (GPT-4, GPT-4-Vision)
- Vector Database: Pinecone
- Deployment: Vercel

 

## Project Structure
```
.
├── app/ # Routes, pages, API endpoints
├── components/ # Reusable UI components
├── lib/ # RAG logic and utilities
├── public/ # Static assets
└── .env.local # Environment variables

```


## Installation and Setup

### Prerequisites

- Node.js v18 or higher
- OpenAI API Key
- Pinecone API Key and Index

 

### 1. Clone the Repository

```bash
git clone https://github.com/TheLord19/Orthopedic-rag.git

cd Orthopedic-rag
```

2. Install Dependencies
```
npm install
```
3. Environment Configuration

Create a file named .env.local in the root directory:
```
OPENAI_API_KEY=your_openai_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX=your_index_name
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run Development Server
```
npm run dev
```


Open in browser:
```
http://localhost:3000
```

Architecture Workflow:
```
Medical Documents
        |
        v
 Ingestion & Chunking
        |
        v
 Vector Embeddings
        |
        v
   Vector Database
        |
        v
User Query → Retrieval → LLM → Response
```

RAG Pipeline

Ingestion
Documents are processed, chunked, and embedded.
Retrieval
User queries are embedded and matched against vector data.

Generation
Retrieved context and query are passed to the LLM.
Response
Answer is generated strictly from medical context.

Medical Disclaimer
For Research and Educational Use Only

OrthoInsight is not a substitute for professional medical judgment, diagnosis, or treatment.
All outputs must be verified using primary clinical sources.

License
```
MIT License
```


