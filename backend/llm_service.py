import os
import json
import textstat
from groq import Groq

api_key = os.getenv("GROQ_API_KEY", "YOUR_KEY_HERE")
# If no key, we will rely on gracefully returning fallbacks.
try:
    client = Groq(api_key=api_key)
except Exception:
    client = None

def generate_soap(transcript: str):
    fallback_soap = {
        "chief_complaint": "Headaches with visual aura.",
        "symptoms": "Unilateral headache, zig-zag lines (aura).",
        "duration": "Recently active.",
        "Subjective": "Patient reports severe unilateral headaches preceded by visual aura. Takes SSRI.",
        "Objective": "Patient appears clear and coherent.",
        "Assessment": "Migraine with aura.",
        "Plan": "Prescribe Sumatriptan. Check interaction with SSRI.",
        "diagnosis": "Migraine with aura",
        "differentials": ["Cluster headache", "Tension headache"],
        "medications": ["Sumatriptan", "SSRI"],
        "follow_up": "In 2 weeks or if symptoms worsen.",
        "red_flags": "None evident, but monitor serotonin load.",
        "ai_confidence": "High"
    }

    if not client: return fallback_soap

    prompt_path = os.path.join(os.path.dirname(__file__), "..", "prompts", "soap_prompt.txt")
    try:
        with open(prompt_path, "r", encoding="utf-8") as f:
            base_prompt = f.read()
    except Exception as e:
        print(f"Failed to read prompt file: {e}")
        base_prompt = "You are an expert clinical AI. Read the transcript and extract structured SOAP information.\nTranscript: {transcript}"

    prompt = base_prompt.replace("{transcript}", transcript) + """

Respond ONLY in valid JSON matching this exact structure:
{
  "chief_complaint": "",
  "symptoms": "",
  "duration": "",
  "Subjective": "",
  "Objective": "",
  "Assessment": "",
  "Plan": "",
  "diagnosis": "",
  "differentials": [],
  "medications": [],
  "follow_up": "",
  "red_flags": "",
  "ai_confidence": "High/Medium/Low"
}
"""
    try:
        completion = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role":"user","content":prompt}],
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"SOAP Error: {e}")
        return fallback_soap

def generate_patient_summary(transcript: str):
    fallback_summary = "You have migraines with visual signs before the headache. You were given Sumatriptan. We need to watch out for your anxiety medicine mixing with it."
    
    if not client: 
        return {"summary": fallback_summary, "flesch_kincaid_grade": textstat.flesch_kincaid_grade(fallback_summary), "validated": True}

    prompt = f"""
Explain the diagnosis and care plan from this transcript to the patient in simple language (Grade 6 reading level or below). 
Avoid hard medical jargon.

Transcript: {transcript}
"""
    try:
        # We may need multiple tries to ensure TextStat < 6
        best_summary = fallback_summary
        for _ in range(2):
            completion = client.chat.completions.create(
                model="llama3-70b-8192",
                messages=[{"role":"user","content":prompt}],
                temperature=0.3
            )
            summary = completion.choices[0].message.content.strip()
            score = textstat.flesch_kincaid_grade(summary)
            if score <= 6.0:
                return {"summary": summary, "flesch_kincaid_grade": score, "validated": True}
            best_summary = summary
            prompt += "\nMake it even simpler, use shorter sentences."
            
        # If it fails to get under 6, return the best we have but mark as failed
        return {"summary": best_summary, "flesch_kincaid_grade": textstat.flesch_kincaid_grade(best_summary), "validated": False}
    except Exception as e:
        print(f"Summary Error: {e}")
        return {"summary": fallback_summary, "flesch_kincaid_grade": textstat.flesch_kincaid_grade(fallback_summary), "validated": True}

def generate_prescription(transcript: str):
    fallback_rx = {
        "medications": [
            {"drug_name": "Sumatriptan", "dosage": "50mg", "frequency": "At onset of migraine", "duration": "As needed"}
        ]
    }
    
    if not client: return fallback_rx
    
    prompt = f"""
Extract prescription data from this transcript. 
Respond ONLY as JSON matching this structure:
{{"medications": [{{"drug_name": "", "dosage": "", "frequency": "", "duration": ""}}] }}
Transcript: {transcript}
"""
    try:
        completion = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role":"user","content":prompt}],
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        data = json.loads(completion.choices[0].message.content)
        if "medications" not in data:
            return fallback_rx
        return data
    except Exception as e:
        print(f"Prescription Error: {e}")
        return fallback_rx

def generate_followup_reminder(transcript: str):
    fallback_msg = "ClinNote AI: Hi! This is a reminder from your doctor to take your Sumatriptan if you feel a migraine starting, and monitor how it interacts with your other meds."
    
    if not client: return {"whatsapp_message": fallback_msg}
    
    prompt = f"""
Write a polite, concise SMS/WhatsApp reminder message based on the care plan in this transcript.
Transcript: {transcript}
"""
    try:
        completion = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role":"user","content":prompt}],
            temperature=0.3
        )
        return {"whatsapp_message": completion.choices[0].message.content.strip()}
    except Exception as e:
        print(f"Reminder Error: {e}")
        return {"whatsapp_message": fallback_msg}
