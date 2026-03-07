from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import os
import shutil
import json

from whisper_service import transcribe_audio
from llm_service import generate_soap
from icd_mapper import map_to_icd11
from prescription import extract_prescription, generate_patient_summary
from drug_checker import check_drug
from analytics import save_consultation, get_analytics

app = FastAPI()

os.makedirs("temp", exist_ok=True)

class ExtractionRequest(BaseModel):
    transcript: str

@app.post("/process_audio")
async def process_audio(file: UploadFile = File(...)):
    path = f"temp/{file.filename}"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 1. Transcribe audio
    transcript = transcribe_audio(path)

    # 2. Generate SOAP Note
    soap = generate_soap(transcript)

    # 3. Patient Summary
    summary = generate_patient_summary(transcript)
    
    # 4. Prescription
    prescription_json = extract_prescription(transcript)
    try:
        prescriptions = json.loads(prescription_json)
        # Handle case where groq returned an object with a single list instead of list directly
        if isinstance(prescriptions, dict) and len(prescriptions.keys()) == 1:
            prescriptions = list(prescriptions.values())[0]
    except Exception:
        prescriptions = []

    # 5. Extract a possible diagnosis from SOAP for ICD mapping (basic heuristic or LLM based)
    # To keep the demo fast, we'll map the whole transcript or ask the LLM
    # In a full app, we'd parse the Assessment section of SOAP
    icd_mapping = map_to_icd11(transcript)
    
    # 6. Drug Warnings
    drug_warnings = []
    drugs_found = []
    if isinstance(prescriptions, list):
        for rx in prescriptions:
            if isinstance(rx, dict) and "drug_name" in rx:
                drug = rx["drug_name"]
                drugs_found.append(drug)
                warning = check_drug(drug)
                drug_warnings.append({"drug": drug, "warning": warning})

    # Save to DB for analytics
    # we take the first drug or N/A
    primary_drug = drugs_found[0] if drugs_found else "N/A"
    save_consultation(transcript, soap, icd_mapping.split("-")[0].strip() if "-" in icd_mapping else icd_mapping, primary_drug)

    # Safely remove temp file
    if os.path.exists(path):
        os.remove(path)

    return {
        "transcript": transcript,
        "soap_note": soap,
        "summary": summary,
        "icd_mapping": icd_mapping,
        "prescriptions": prescriptions,
        "drug_warnings": drug_warnings
    }

@app.get("/analytics")
def analytics_dashboard():
    return get_analytics()
