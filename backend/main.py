import os
import shutil
import json
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from whisper_service import transcribe_audio
from llm_service import generate_soap, generate_patient_summary, generate_prescription, generate_followup_reminder
from icd_mapper import map_to_icd11
from drug_checker import check_drug_interactions
from db_service import save_consultation, get_all_consultations, approve_consultation
from analytics import generate_analytics

app = FastAPI(title="ClinNote AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("temp", exist_ok=True)

@app.post("/process_audio")
async def process_audio(file: UploadFile = File(...)):
    path = f"temp/{file.filename}"
    try:
        with open(path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 1. Transcribe audio with graceful fallback
        transcript = transcribe_audio(path)

        # 2. Extract SOAP JSON
        soap_data = generate_soap(transcript)

        # 3. Patient Summary
        summary_data = generate_patient_summary(transcript)

        # 4. Prescription
        prescription_data = generate_prescription(transcript)
        rx_list = prescription_data.get("medications", [])

        # 5. Extract drugs for interaction check
        drug_names = [r.get("drug_name") for r in rx_list if isinstance(r, dict) and "drug_name" in r]

        # 6. Drug Warning Check (OpenFDA + Critical Pairs)
        interaction_check = check_drug_interactions(drug_names)

        # 7. ICD-11 Mapping
        diagnosis = soap_data.get("diagnosis", "Unknown Diagnosis")
        icd_mapping = map_to_icd11(diagnosis)

        # 8. Follow-up reminder
        reminder = generate_followup_reminder(transcript)

        # Save to SQLite DB
        icd_primary = icd_mapping.get("primary", {}).get("code", "Unknown")
        drug_count = len(drug_names)
        
        # Serialize soap dict for storage
        soap_str = json.dumps(soap_data)
        consult_id = save_consultation(transcript, soap_str, diagnosis, icd_primary, drug_count)

        response_data = {
            "id": consult_id,
            "transcript": transcript,
            "soap": soap_data,
            "summary": summary_data,
            "icd": icd_mapping,
            "prescription": rx_list,
            "drug_check": interaction_check,
            "reminder": reminder
        }

        return response_data
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(path):
            os.remove(path)

@app.post("/approve_consultation/{consult_id}")
def approve_consult_endpoint(consult_id: int):
    success = approve_consultation(consult_id)
    if success:
        return {"message": "Approved", "id": consult_id}
    raise HTTPException(status_code=404, detail="Consultation not found or approve failed")

@app.get("/analytics")
def analytics_endpoint():
    return generate_analytics()

@app.get("/consultations")
def consultations_endpoint():
    return get_all_consultations()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
