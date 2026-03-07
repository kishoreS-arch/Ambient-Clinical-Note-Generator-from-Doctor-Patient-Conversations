from faster_whisper import WhisperModel

# Use a small model for faster processing, or "base" as suggested
model_size = "base"
# Optional: Set device="cuda" and compute_type="float16" if GPU is available
model = WhisperModel(model_size, device="cpu", compute_type="int8")

def transcribe_audio(file_path):
    print(f"Transcribing {file_path}...")
    segments, info = model.transcribe(file_path)

    transcript = ""
    for segment in segments:
        transcript += segment.text + " "

    return transcript.strip()
