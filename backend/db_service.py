import os
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime

os.makedirs("../data", exist_ok=True)
db_url = "sqlite:///../data/consultations.db"
engine = create_engine(db_url, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(Integer, primary_key=True, index=True)
    consultation_date = Column(DateTime, default=datetime.utcnow)
    transcript = Column(Text, nullable=True)
    soap_note = Column(Text, nullable=True)
    diagnosis = Column(String(255), default="Pending")
    icd_code = Column(String(50), default="Pending")
    drug_count = Column(Integer, default=0)
    status = Column(String(50), default="Pending Approval")

Base.metadata.create_all(bind=engine)

def save_consultation(transcript: str, soap_note: str, diagnosis: str, icd_code: str, drug_count: int):
    try:
        db = SessionLocal()
        new_consult = Consultation(
            transcript=transcript,
            soap_note=soap_note,
            diagnosis=diagnosis,
            icd_code=icd_code,
            drug_count=drug_count,
            status="Pending Approval"
        )
        db.add(new_consult)
        db.commit()
        db.refresh(new_consult)
        return new_consult.id
    except Exception as e:
        print(f"DB Error: {e}")
        return None
    finally:
        db.close()

def get_all_consultations():
    try:
        db = SessionLocal()
        consultations = db.query(Consultation).order_by(Consultation.consultation_date.desc()).all()
        return [{"id": c.id, "date": c.consultation_date.strftime("%Y-%m-%d %H:%M:%S"), "diagnosis": c.diagnosis, 
                 "icd_code": c.icd_code, "drug_count": c.drug_count, "status": c.status} for c in consultations]
    except Exception as e:
        print(f"DB Error: {e}")
        return []
    finally:
        db.close()

def approve_consultation(consultation_id: int):
    try:
        db = SessionLocal()
        consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
        if consultation:
            consultation.status = "Approved"
            db.commit()
            return True
        return False
    except Exception as e:
        print(f"DB Error: {e}")
        return False
    finally:
        db.close()
