import streamlit as st
import requests

st.set_page_config(page_title="AI Clinical Note Generator", layout="wide")

st.title("🏥 AI Clinical Note Generator")
st.markdown("Transform doctor-patient conversations into structured SOAP notes, ICD-11 codes, and prescriptions.")

st.sidebar.title("📁 Upload")
audio = st.sidebar.file_uploader("Upload Consultation Audio", type=["wav", "mp3", "m4a"])

if st.sidebar.button("Fetch Analytics Dashboard"):
    try:
        res = requests.get("http://localhost:8000/analytics")
        if res.status_code == 200:
            data = res.json()
            st.sidebar.markdown("### Weekly Analytics")
            st.sidebar.write(f"**Total Consultations:** {data.get('total_consultations', 0)}")
            st.sidebar.write(f"**Top Diagnosis:** {data.get('top_diagnosis', 'N/A')}")
            st.sidebar.write(f"**Top Drug Prescribed:** {data.get('top_drug', 'N/A')}")
        else:
            st.sidebar.error("Could not fetch analytics.")
    except Exception as e:
        st.sidebar.error(f"Error: {e}")

if audio:
    st.info("Processing Audio... this may take a moment depending on the length.")
    
    with st.spinner("Transcribing and analyzing with AI..."):
        files = {"file": (audio.name, audio.getvalue(), audio.type)}
        try:
            res = requests.post("http://localhost:8000/process_audio", files=files)
            if res.status_code == 200:
                data = res.json()
                
                # Layout
                col1, col2 = st.columns(2)
                
                with col1:
                    st.subheader("📝 Transcript")
                    st.write(data["transcript"])
                    
                    st.subheader("🗣️ Patient Summary")
                    st.info(data["summary"])
                    
                with col2:
                    st.subheader("📋 SOAP Note")
                    st.write(data["soap_note"])
                    
                    st.subheader("🏷️ ICD-11 Coding")
                    st.success(data["icd_mapping"])
                    
                    st.subheader("💊 Prescription & Drug Safety")
                    
                    prescriptions = data.get("prescriptions", [])
                    if prescriptions:
                        st.write("### Auto-Generated Prescriptions")
                        st.table(prescriptions)
                    else:
                        st.write("No medications mentioned.")
                        
                    warnings = data.get("drug_warnings", [])
                    if warnings:
                        st.write("### FDA Drug Interaction Check")
                        for w in warnings:
                            with st.expander(f"Safety Warning: {w['drug']}"):
                                st.warning(w["warning"])
                                
            else:
                st.error(f"API Error {res.status_code}: {res.text}")
        except Exception as e:
            st.error(f"Connection error: Make sure the FastAPI backend is running. {e}")
