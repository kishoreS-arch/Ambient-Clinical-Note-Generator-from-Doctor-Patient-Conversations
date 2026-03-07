import os
from groq import Groq

# Load GROQ API key from environment variable
api_key = os.getenv("GROQ_API_KEY", "YOUR_KEY_HERE")
client = Groq(api_key=api_key)

def generate_soap(transcript):
    prompt = f"""
You are a clinical documentation assistant.

Convert the doctor-patient conversation into a structured SOAP note.

Conversation:
{transcript}

Return format:

Chief Complaint:
Symptoms:
Duration:

SOAP NOTE:

Subjective:
Objective:
Assessment:
Plan:

Possible Diagnosis:
Medications Mentioned:
Follow Up:
"""

    completion = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[{"role":"user","content":prompt}],
        temperature=0.2
    )

    return completion.choices[0].message.content
