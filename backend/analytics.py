import pandas as pd
from sqlalchemy import create_engine

# SQLite database path
db_url = "sqlite:///../data/consultations.db"
engine = create_engine(db_url)

def save_consultation(transcript, soap, diagnosis, drug):
    df = pd.DataFrame([{
        "transcript": transcript,
        "soap_note": soap,
        "diagnosis": diagnosis,
        "drug": drug
    }])
    df.to_sql("consultations", engine, if_exists="append", index=False)

def get_analytics():
    try:
        df = pd.read_sql("consultations", engine)
        
        # Most common diagnosis
        top_diagnosis = df["diagnosis"].value_counts().idxmax() if not df.empty and "diagnosis" in df else "N/A"
        
        # Most used drug
        top_drug = df["drug"].value_counts().idxmax() if not df.empty and "drug" in df else "N/A"
        
        return {
            "total_consultations": len(df),
            "top_diagnosis": top_diagnosis,
            "top_drug": top_drug
        }
    except Exception as e:
        return {"error": str(e)}
