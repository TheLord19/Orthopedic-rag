# 🏥 OrthoInsight — Orthopedic AI Assistant

**AI-powered orthopedic research assistant with musculoskeletal X-ray analysis, backed by a 17-model MURA deep-learning ensemble.**

OrthoInsight is a multi-modal clinical decision-support prototype that combines a retrieval-augmented generation (RAG) chat interface with an X-ray abnormality detection pipeline. Ask clinical questions backed by real PubMed literature, or upload a musculoskeletal radiograph for AI analysis.

---

## ✨ Features

| Feature | Status | Description |
|---|---|---|
| **RAG Chat** | ✅ Real (PubMed) | Searches PubMed via the free E-utilities API, embeds abstracts locally, and synthesises evidence-based answers |
| **X-ray Analysis** | ✅ Real (ONNX) | 17-model ensemble (EfficientNet-B6 + DenseNet169 + EfficientNet-B4) trained on Stanford MURA v1.1 — **90.33% validation accuracy** |
| **Voice Input** | ✅ Working | Browser Speech Recognition API with graceful fallback |
| **Image Upload** | ✅ Working | Drag-and-drop X-ray upload with preview |
| **Chat History** | ✅ Working | LocalStorage persistence, no server required |
| **Grad-CAM** | ✅ Ready | Model interpretability heatmaps (requires backend) |
| **Dark Mode** | ✅ Working | Light / Dark / System preference |

---

## 🚀 Quick Start

### 1. Frontend only (no backend — uses simulated responses)

```bash
cd orthopedic_rag
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app works immediately with built-in simulated RAG and X-ray responses — no API keys or backend required.

### 2. Full stack (frontend + Python backend with real PubMed RAG)

```bash
# Terminal 1 — Backend
cd orthopedic_rag/backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8000

# Terminal 2 — Frontend
cd orthopedic_rag
cp .env.example .env.local
npm run dev
```

The frontend auto-detects the backend and switches from simulation to real PubMed-powered responses.

### 3. With OpenAI (richer RAG answers)

Add your API key to `.env.local`:

```
OPENAI_API_KEY=sk-...
```

The RAG pipeline will use GPT-4o-mini for answer generation instead of template-based synthesis.

### 4. With real X-ray inference (ONNX models)

The MURA ensemble was trained on an NVIDIA L40S and achieved 90.33% on the Stanford MURA v1.1 validation set. To run real inference:

```bash
# 1. Export trained .pth weights to ONNX
cd deployment_ortho/mura_
python export_to_onnx.py

# 2. Copy the exported models to the backend
cp -r onnx_models/ ../../orthopedic_rag/backend/onnx_models/

# 3. Start the backend — it will detect and use real models
cd ../../orthopedic_rag/backend
uvicorn server:app --port 8000
```

When ONNX models are present, the `engine` field in API responses changes from `"simulation"` to `"onnx"`.

---

## 🧱 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend (:3000)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐ │
│  │ Chat UI  │  │ X-ray UI │  │ Results  │  │  Sidebar   │ │
│  │ (voice,  │  │ (upload, │  │ (answer, │  │ (history,  │ │
│  │  text,   │  │  drag)   │  │ sources, │  │  delete)   │ │
│  │  chips)  │  │          │  │ conf)    │  │            │ │
│  └────┬─────┘  └────┬─────┘  └──────────┘  └────────────┘ │
│       │              │                                       │
│       ▼              ▼                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Routes (Next.js)                     │   │
│  │  /api/query   → proxy to backend or simulated        │   │
│  │  /api/analyze → proxy to backend or simulated        │   │
│  └──────────────────────┬───────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────┘
                          │ NEXT_PUBLIC_API_BASE
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  FastAPI Backend (:8000)                     │
│  ┌──────────────────┐  ┌─────────────────────────────────┐ │
│  │   RAG Pipeline   │  │      MURA Ensemble              │ │
│  │  PubMed → embed  │  │  17 ONNX models → soft vote     │ │
│  │  → FAISS → LLM   │  │  → prediction + confidence      │ │
│  └──────────────────┘  └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
orthopedic_rag/
├── backend/                    ← Python backend (FastAPI)
│   ├── server.py               ← Main server entrypoint
│   ├── rag_pipeline.py         ← PubMed RAG + embeddings + LLM
│   ├── ensemble.py             ← ONNX ensemble inference
│   ├── onnx_models/            ← (gitignored) exported .onnx files
│   └── requirements.txt
│
├── src/
│   ├── app/
│   │   ├── layout.js           ← Root layout + metadata
│   │   ├── page.js             ← State orchestrator
│   │   ├── globals.css         ← Design system (~2,300 lines)
│   │   └── api/
│   │       ├── query/route.js  ← RAG endpoint (proxy → backend)
│   │       └── analyze/route.js← X-ray endpoint (proxy → backend)
│   │
│   ├── components/
│   │   ├── chat/               ← ChatInterface, InputArea, Messages
│   │   ├── layout/             ← Header, Sidebar, Footer
│   │   ├── results/            ← ResultsPanel, SourceCitation, VisualData
│   │   └── ui/                 ← Button, Card, Modal, Tabs
│   │
│   ├── hooks/
│   │   ├── useRagApi.js        ← API call hook (query + analyze)
│   │   └── useLocalStorage.js  ← Persistent state hook
│   │
│   ├── utils/
│   │   ├── api.js              ← Fetch wrapper (timeouts, error types)
│   │   ├── constants.js        ← App constants, ensemble info
│   │   └── formatters.js       ← Date, text, file-size formatters
│   │
│   └── styles/
│       └── animations.css      ← Shared keyframes
│
├── .env.example                ← Template for .env.local
├── .gitignore
├── package.json
├── next.config.js
└── README.md
```

---

## 🔬 The MURA Ensemble

The X-ray analysis pipeline uses a **17-model grand ensemble** trained on the [Stanford MURA v1.1](https://stanfordmlgroup.github.io/competitions/mura/) dataset (musculoskeletal radiographs):

| Architecture | Count | Input Size |
|---|---|---|
| EfficientNet-B6 (MixUp, 600px) | 5 | 600×600 |
| DenseNet169 | 6 | 224×224 |
| EfficientNet-B4 | 6 | 380×380 |

**Training details:**
- 5-fold cross-validation with checkpoint resumption
- MixUp augmentation (α=0.2), label smoothing (0.1)
- Cosine annealing warm restarts, AdamW optimizer
- Gradient accumulation (effective batch size 48)
- Trained on NVIDIA L40S (48 GB VRAM)

**Performance:** 90.33% validation accuracy on the MURA test set.

Training code, logs, and detailed reports are available in the sibling repository at `deployment_ortho/`.

---

## 🔍 How the RAG Pipeline Works

1. **Search** — Your query is sent to the PubMed E-utilities API (free, no key required)
2. **Fetch** — Abstracts for the top 20 matching papers are retrieved
3. **Embed** — A local `all-MiniLM-L6-v2` model converts abstracts into dense vectors
4. **Retrieve** — FAISS cosine similarity selects the top-3 most relevant chunks
5. **Generate** — If `OPENAI_API_KEY` is set, GPT-4o-mini synthesises a grounded answer; otherwise a template stitches together the real excerpts

Every citation includes a clickable PubMed link to the original paper.

---

## 🧪 Evaluation Modes

| Mode | How to activate | RAG | X-ray |
|---|---|---|---|
| **Simulated** | No `NEXT_PUBLIC_API_BASE` set | Keyword-matched demo answers | Deterministic hash of filename+size |
| **Real RAG** | Backend running, `NEXT_PUBLIC_API_BASE` set | PubMed → embeddings → generation | Simulation (no models) |
| **Full stack** | Backend running + ONNX models in `backend/onnx_models/` | PubMed → embeddings → generation | Real 17-model ONNX inference |

The `engine` field in every API response indicates which mode was used: `"simulation"`, `"pubmed-rag"`, or `"onnx"`.

---

## ⚠️ Disclaimer

OrthoInsight is a **research prototype**. Its output is not medical advice and must not replace evaluation by a qualified clinician. The system is designed as a decision-support tool to assist — not replace — clinical judgment.

---

## 📄 License

MIT
