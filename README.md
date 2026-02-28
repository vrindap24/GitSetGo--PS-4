# ReviewSense – AI-Powered Review Management Backend

A centralized review management platform backend built with **FastAPI**, **Firebase Firestore**, and **Google Gemini AI**. It collects reviews, runs asynchronous AI analysis (sentiment, categorization, risk scoring), auto-escalates critical reviews, and exposes analytics APIs for dashboard visualization.

## Features

- **Review Ingestion** – Accept reviews from PWA and external connectors
- **AI Analysis Pipeline** – Automatic sentiment analysis, categorization, risk scoring via Gemini AI
- **Smart Escalation** – Auto-create escalations for high-risk or low-rated reviews
- **Multi-Branch Analytics** – Branch overview, comparison, and staff performance APIs
- **Background Processing** – Asynchronous AI processing using FastAPI BackgroundTasks

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | FastAPI (Python 3.11+) |
| Database | Firebase Firestore |
| AI | Google Gemini 2.0 Flash |
| Deployment | Render |

## Quick Start

### Prerequisites

- Python 3.11+
- Firebase project with Firestore enabled
- Google Gemini API key
- Firebase service account JSON file

### Setup

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### Configuration

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `FIREBASE_CREDENTIALS_PATH` | Path to Firebase service account JSON |
| `GEMINI_API_KEY` | Google Gemini API key |
| `ESCALATION_THRESHOLD` | Risk score threshold for auto-escalation (default: 70) |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |

### Run

```bash
uvicorn app.main:app --reload --port 8000
```

API docs available at: `http://localhost:8000/docs`

## API Endpoints

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/reviews` | Submit a new review |
| `GET` | `/reviews` | List reviews (with filters) |
| `POST` | `/branches` | Create a branch |
| `GET` | `/branches` | List all branches |
| `GET` | `/branches/{id}` | Get branch by ID |
| `POST` | `/staff` | Add staff member |
| `GET` | `/staff` | List staff (filter by branch) |
| `GET` | `/escalations` | List escalations |
| `PATCH` | `/escalations/{id}` | Update escalation status |
| `GET` | `/analytics/branch-overview` | Branch analytics overview |
| `GET` | `/analytics/branch-comparison` | Compare all branches |
| `GET` | `/analytics/staff-performance` | Staff performance metrics |

## Deployment

This project deploys on **Render** using `render.yaml`. Push to your connected Git repo and Render will auto-deploy.

## License

MIT
