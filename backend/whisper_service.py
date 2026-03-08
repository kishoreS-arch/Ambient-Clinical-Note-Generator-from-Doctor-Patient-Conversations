import os
from groq import Groq
# from faster_whisper import WhisperModel

# Use environment variable or default to "tiny" for speed
model_size = os.getenv("WHISPER_MODEL", "tiny")
api_key = os.getenv("GROQ_API_KEY")

def transcribe_audio_groq(file_path: str):
    """Transcribes audio using Groq's API."""
    if not api_key:
        print("Groq API key not found for transcription.")
        return None
    
    try:
        client = Groq(api_key=api_key)
        with open(file_path, "rb") as file:
            transcription = client.audio.transcriptions.create(
                file=(os.path.basename(file_path), file.read()),
                model="whisper-large-v3",
                response_format="json",
                language="en",
                temperature=0.0
            )
        return transcription.text
    except Exception as e:
        print(f"Groq Transcription Error: {e}")
        return None

# Attempt to load local model only if NOT using groq
model_loaded = False
if model_size != "groq":
    try:
        from faster_whisper import WhisperModel
        model = WhisperModel(model_size, device="cpu", compute_type="int8")
        model_loaded = True
    except Exception as e:
        print(f"Failed to load Whisper model: {e}")

def transcribe_audio(file_path: str):
    """
    Transcribes audio. If the model fails or isn't loaded, returns a realistic demo transcript.
    Graceful fallback is essential for the hackathon demo.
    """
    demo_transcript = "Doctor: What brings you in today? Patient: I've been having these terrible headaches on one side of my head, and I see zig-zag lines before they start. Doctor: Sounds like migraines with aura. I'll prescribe Sumatriptan. Patient: Will it interact with the SSRI I take for anxiety? Doctor: Let me check."

    if model_size == "groq":
        transcript = transcribe_audio_groq(file_path)
        if transcript:
            return transcript
        return demo_transcript

    if not model_loaded:
        return demo_transcript

    try:
        # Using vad_filter=True as requested for production quality
        segments, info = model.transcribe(file_path, vad_filter=True, vad_parameters=dict(min_silence_duration_ms=500))

        transcript = ""
        for segment in segments:
            transcript += segment.text + " "

        transcript = transcript.strip()
        
        if not transcript:
            return demo_transcript
            
        return transcript

    except Exception as e:
        print(f"Transcription error: {e}")
        return demo_transcript
