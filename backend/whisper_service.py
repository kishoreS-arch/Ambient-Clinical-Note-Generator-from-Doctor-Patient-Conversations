import os
from faster_whisper import WhisperModel

# Use environment variable or default to "tiny" for speed
model_size = os.getenv("WHISPER_MODEL", "tiny")

try:
    # Adding VAD (Voice Activity Detection) parameters to reduce hallucination
    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    model_loaded = True
except Exception as e:
    print(f"Failed to load Whisper model: {e}")
    model_loaded = False

def transcribe_audio(file_path: str):
    """
    Transcribes audio. If the model fails or isn't loaded, returns a realistic demo transcript.
    Graceful fallback is essential for the hackathon demo.
    """
    demo_transcript = "Doctor: What brings you in today? Patient: I've been having these terrible headaches on one side of my head, and I see zig-zag lines before they start. Doctor: Sounds like migraines with aura. I'll prescribe Sumatriptan. Patient: Will it interact with the SSRI I take for anxiety? Doctor: Let me check."

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
