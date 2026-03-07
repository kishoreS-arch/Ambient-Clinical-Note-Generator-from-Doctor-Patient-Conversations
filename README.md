# Ambient Clinical Note Generator

A complete end-to-end hackathon project that takes an audio recording of a doctor-patient conversation and outputs a fully structured SOAP note, ICD-11 coding, drug interaction checks, a patient-friendly summary, and a prescription.

## Features
- **Speech-to-Text**: Uses `faster-whisper` for fast and accurate transcription.
- **LLM Intelligence**: Powered by Groq (LLaMA3-70B) for lightning-fast inference to generate SOAP notes, simple patient summaries, and extract prescriptions.
- **ICD-11 Auto-Coding**: Maps diagnosis to the nearest ICD-11 code automatically.
- **Drug Safety**: Checks FDA database (OpenFDA) for warnings on prescribed drugs.
- **Analytics Dashboard**: Tracks common diagnoses and medications in a local SQLite database.

## Prerequisites
- Python 3.9+
- Groq API Key (Sign up at groq.com for free credits)

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set your LLM API Key:
```bash
set GROQ_API_KEY=your_groq_api_key_here
```

## Running the Application

This is a two-part application (FastAPI Backend + Streamlit Frontend).

### Step 1: Start the Backend (FastAPI)
Open a terminal and run:
```bash
cd backend
uvicorn main:app --reload
```
The backend will run on `http://localhost:8000`.

### Step 2: Start the Frontend (Streamlit)
Open a second terminal, activate your virtual environment, and run:
```bash
cd frontend
streamlit run app.py
```
The dashboard will open automatically in your browser (usually `http://localhost:8501`).

## How to Demo
1. Go to the Streamlit UI.
2. Upload a sample audio consultation (e.g., `.wav` or `.mp3`).
3. Click to start the upload and see the MAGIC!
4. The dashboard will display the Transcript, SOAP note, Summary, ICD-11 codes, and Drug Information.
5. Click "Fetch Analytics Dashboard" in the sidebar to view basic SQLite analytics.