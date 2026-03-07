import os
import json
from groq import Groq

api_key = os.getenv("GROQ_API_KEY", "YOUR_KEY_HERE")
client = Groq(api_key=api_key)

def extract_prescription(transcript):
    prompt = f"""
Extract prescription information from the consultation.
If no medication is prescribed, return an empty JSON.

Conversation:
{transcript}

Return strictly a JSON list of objects:
[
{{
"drug_name": "name",
"dosage": "dosage",
"frequency": "frequency",
"duration": "duration"
}}
]
"""
    try:
        completion = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role":"user","content":prompt}],
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        
        # Handling format to ensure it returns valid json
        # Since response_format json_object requires the prompt to output a json object,
        # we parse it and extract the list.
        res = completion.choices[0].message.content
        return res
    except Exception as e:
        return json.dumps([{"error": str(e)}])

def generate_patient_summary(transcript):
    prompt = f"""
Explain the diagnosis and care plan in simple language.

Rules:
- Grade level below 6
- Avoid medical jargon
- Patient friendly

Conversation:
{transcript}
"""
    try:
        completion = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role":"user","content":prompt}],
            temperature=0.4
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        return f"Summary generation failed: {str(e)}"
