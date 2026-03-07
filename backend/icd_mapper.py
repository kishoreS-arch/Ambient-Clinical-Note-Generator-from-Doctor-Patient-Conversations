import os
import re
from groq import Groq

# Load GROQ API key from environment variable
api_key = os.getenv("GROQ_API_KEY", "YOUR_KEY_HERE")
client = Groq(api_key=api_key)

def map_to_icd11(diagnosis):
    prompt = f"""
Map the following clinical diagnosis to the closest ICD-11 code.

Diagnosis: {diagnosis}

Return ONLY the ICD-11 Code and Short Description. Examples:
- 1A40 (Cholera)
- CA23 (Asthma)

Format: [ICD-11 Code] - [Description]
"""
    try:
        completion = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role":"user","content":prompt}],
            temperature=0.1
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        return f"ICD-11 mapping unavailable: {str(e)}"
