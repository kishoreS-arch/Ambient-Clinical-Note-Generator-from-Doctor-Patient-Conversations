import streamlit as st
import requests
import json
import pandas as pd

st.set_page_config(page_title="ClinNote AI Dashboard", page_icon="🏥", layout="wide")

# API Base URL
API_URL = "http://localhost:8000"

st.sidebar.title("🏥 ClinNote AI")
page = st.sidebar.radio("Navigation", ["New Consultation", "Analytics", "History"])

if page == "New Consultation":
    st.title("New Consultation Workflow")
    st.markdown("Upload patient audio to generate clinical documentation automatically.")
    
    use_demo = st.checkbox("Use demo mode (Migraine with aura snippet)")
    audio_file = st.file_uploader("Upload Consultation Audio", type=["wav", "mp3", "m4a"])
    
    if st.button("Process Consultation", type="primary"):
        if audio_file or use_demo:
            with st.spinner("Processing through the AI pipeline (Audio -> Whisper -> SOAP -> ICD-11 -> OpenFDA)..."):
                try:
                    # If use_demo without a file, we send a dummy request that the backend will catch and run the graceful fallback on
                    files = {"file": (audio_file.name, audio_file.getvalue(), audio_file.type)} if audio_file else {"file": ("demo.wav", b"dummy", "audio/wav")}
                    
                    res = requests.post(f"{API_URL}/process_audio", files=files)
                    if res.status_code == 200:
                        st.session_state["results"] = res.json()
                        st.success("Analysis Complete!")
                    else:
                        st.error(f"Error: {res.text}")
                except Exception as e:
                    st.error(f"Failed to connect to backend: {e}")
        else:
            st.warning("Please upload an audio file or select demo mode.")

    if "results" in st.session_state:
        data = st.session_state["results"]
        consult_id = data.get("id")
        
        # Tabs for Results
        tabs = st.tabs(["SOAP Note", "ICD-11 Codes", "Drug Check", "Patient Summary", "Prescription", "Transcript", "WhatsApp Msg"])
        
        with tabs[0]:
            st.subheader("Structured SOAP JSON")
            st.json(data["soap"])
            
        with tabs[1]:
            st.subheader("ICD-11 Diagnostic Codes")
            st.success(f"**Primary:** {data['icd'].get('primary', {}).get('code')} - {data['icd'].get('primary', {}).get('desc')} (Confidence: {data['icd'].get('primary', {}).get('confidence')})")
            st.write("Alternatives:")
            st.json(data['icd'].get('alternatives', []))
            
        with tabs[2]:
            st.subheader("OpenFDA & Critical Pairs Medication Check")
            check = data["drug_check"]
            risk_color = "red" if check["overall_risk"] == "HIGH" else "orange" if check["overall_risk"] == "MODERATE" else "green"
            st.markdown(f"**Overall Risk:** <span style='color:{risk_color}; font-weight:bold'>{check['overall_risk']}</span>", unsafe_allow_html=True)
            st.info(check["details"])
            st.warning(f"**Recommended Action:** {check['action']}")
            st.caption(check["disclaimer"])
            
            st.write("FDA Warnings for individuals:")
            st.table(pd.DataFrame(check["fda_warnings"]))
            
        with tabs[3]:
            st.subheader("Patient Summary (Flesch-Kincaid Validation)")
            sum_data = data["summary"]
            valid_color = "green" if sum_data.get("validated") else "red"
            st.markdown(f"**Readability Grade:** <span style='color:{valid_color}'>{sum_data.get('flesch_kincaid_grade')}</span>", unsafe_allow_html=True)
            st.write(sum_data.get("summary"))
            
        with tabs[4]:
            st.subheader("Automated Prescription Draft")
            rx = data["prescription"]
            if rx:
                st.table(pd.DataFrame(rx))
                st.warning("DISCLAIMER: Draft requires authorized physician digital signature before transmittal.")
            else:
                st.write("No medications mentioned.")
                
        with tabs[5]:
            st.subheader("Raw Audio Transcript")
            st.write(data["transcript"])
            
        with tabs[6]:
            st.subheader("Automated Follow-up")
            st.info(data["reminder"].get("whatsapp_message", ""))
        
        # Approval Button
        st.divider()
        col1, _ = st.columns([1, 3])
        with col1:
            if "approved" not in st.session_state or st.session_state["approved"] != consult_id:
                if st.button("Doctor Approves & Saves Note", use_container_width=True):
                    try:
                        res = requests.post(f"{API_URL}/approve_consultation/{consult_id}")
                        if res.status_code == 200:
                            st.session_state["approved"] = consult_id
                            st.success("Consultation Approved successfully.")
                            st.experimental_rerun()
                    except:
                        st.error("Failed to approve.")
            else:
                st.button("✅ Note Approved & Signed", disabled=True, use_container_width=True)

elif page == "Analytics":
    st.title("Physician Analytics Dashboard")
    try:
        res = requests.get(f"{API_URL}/analytics")
        if res.status_code == 200:
            stats = res.json()
            
            col1, col2, col3, col4 = st.columns(4)
            col1.metric("Total Consultations", stats["total_consultations"])
            col2.metric("This Week", stats["this_week"])
            col3.metric("Minutes Saved", f"{stats['minutes_saved']}m")
            col4.metric("Patient Hours Gained", f"{stats['hours_returned']}h")
            
            st.markdown(f"**Impact:** {stats['impact_statement']}")
            
            col1, col2 = st.columns(2)
            with col1:
                st.subheader("Top 5 Diagnoses")
                if stats["top_diagnoses"]:
                    df_diags = pd.DataFrame(stats["top_diagnoses"]).set_index("name")
                    st.bar_chart(df_diags)
                else:
                    st.write("No data yet.")
            
            with col2:
                st.subheader("Most Prescribed Drugs")
                st.write(stats['most_prescribed_drugs'])
                st.write(f"**Overall Approval Rate:** {stats['approval_rate']}")
    except:
        st.error("Make sure the FastAPI backend is running.")

elif page == "History":
    st.title("Consultation History")
    try:
        res = requests.get(f"{API_URL}/consultations")
        if res.status_code == 200:
            history = res.json()
            if history:
                df = pd.DataFrame(history)
                st.dataframe(df, use_container_width=True)
            else:
                st.write("No consultations recorded yet.")
    except:
        st.error("Failed to fetch history.")
