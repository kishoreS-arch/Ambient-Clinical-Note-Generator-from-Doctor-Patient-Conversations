import React, { useState, useEffect, useRef } from 'react';
import { Play, UploadCloud, CheckCircle, FileText, Activity, AlertTriangle, UserPlus, Clock, Heart, LogOut, Mic, Square } from 'lucide-react';

// Tailwind classes assumed to be available.
// Color Scheme: Dark Slate (#0d1117), Teal Accents (#0d9488)

export default function ClinNoteDashboard() {
  const [activeTab, setActiveTab] = useState('New Consultation');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [resultsAvailable, setResultsAvailable] = useState(false);
  const [resultTab, setResultTab] = useState('SOAP Note');
  const [isApproved, setIsApproved] = useState(false);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [consultData, setConsultData] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  const steps = [
    "Audio received",
    "Whisper transcribing",
    "SOAP generation",
    "ICD-11 mapping",
    "Drug interaction check",
    "Patient summary",
    "Done"
  ];

  useEffect(() => {
    // Initialize SpeechRecognition if available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setLiveTranscript(currentTranscript);
      };
      recognitionRef.current = recognition;
    }

    fetchAnalytics();
    fetchHistory();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('http://localhost:8000/analytics');
      if (res.ok) setAnalyticsData(await res.json());
    } catch (e) { console.error("Could not fetch analytics", e); }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:8000/consultations');
      if (res.ok) setHistoryData(await res.json());
    } catch (e) { console.error("Could not fetch history", e); }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setLiveTranscript('');
      setResultsAvailable(false);
      if (recognitionRef.current) recognitionRef.current.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (recognitionRef.current) recognitionRef.current.stop();
    }
  };

  const processAudio = async (audioBlob) => {
    setIsProcessing(true);
    setProcessStep(0);
    setIsApproved(false);

    const interval = setInterval(() => {
      setProcessStep(prev => prev < 5 ? prev + 1 : prev);
    }, 1500);

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'consultation.wav');

      const response = await fetch('http://localhost:8000/process_audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setConsultData(data);
      clearInterval(interval);
      setProcessStep(6);
      setIsProcessing(false);
      setResultsAvailable(true);
      fetchHistory(); // Refresh history
      fetchAnalytics(); // Refresh analytics
    } catch (error) {
      console.error("Error processing audio:", error);
      clearInterval(interval);
      setIsProcessing(false);
      alert("Error processing audio. Is backend running?");
    }
  };

  const handleApprove = async () => {
    if (!consultData) return;
    try {
      const res = await fetch(`http://localhost:8000/approve_consultation/${consultData.id}`, { method: 'POST' });
      if (res.ok) {
        setIsApproved(true);
        fetchHistory();
      }
    } catch (e) {
      alert("Failed to approve consultation.");
    }
  };

  const renderSecurityWarning = () => (
    <div className="mt-4 bg-yellow-900/30 border border-yellow-700/50 p-3 rounded-lg text-yellow-500 text-sm flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 flex-shrink-0" />
      <p className="font-bold">This output is AI generated and must be reviewed by a doctor before use.</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0d1117] text-gray-200 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#161b22] border-r border-gray-700 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-teal-500 flex items-center gap-2">
            <Activity className="h-6 w-6" /> ClinNote AI
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {['New Consultation', 'Analytics', 'History'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab ? 'bg-teal-600 text-white' : 'hover:bg-gray-800 text-gray-400'
                }`}
            >
              {tab === 'New Consultation' && <PlusCircleIcon />}
              {tab === 'Analytics' && <ActivityIcon />}
              {tab === 'History' && <HistoryIcon />}
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {activeTab === 'New Consultation' && (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">New Consultation</h2>

            {!resultsAvailable && !isProcessing && (
              <div className="bg-[#161b22] p-8 rounded-xl border border-gray-700 shadow-lg text-center">
                <div className="mb-8">
                  {isRecording ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-pulse flex items-center justify-center h-24 w-24 rounded-full bg-red-900/50 mb-4 border-4 border-red-500">
                        <Mic className="h-10 w-10 text-red-500" />
                      </div>
                      <h3 className="text-xl font-bold text-red-400 mb-2">Recording Consultation...</h3>
                      <button onClick={stopRecording} className="mt-4 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors">
                        <Square className="h-5 w-5" /> Stop Consultation
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center h-24 w-24 rounded-full bg-teal-900/30 mb-4 border-4 border-teal-600">
                        <Mic className="h-10 w-10 text-teal-500" />
                      </div>
                      <h3 className="text-xl font-bold text-teal-400 mb-2">Ready to Record</h3>
                      <button onClick={startRecording} className="mt-4 bg-teal-600 hover:bg-teal-500 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors text-white">
                        <Mic className="h-5 w-5" /> Start Consultation
                      </button>
                    </div>
                  )}
                </div>

                {isRecording && (
                  <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg text-left">
                    <h4 className="text-sm font-bold text-gray-400 mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4" /> Live Transcription Preview:
                    </h4>
                    <p className="text-gray-200 font-mono text-sm leading-relaxed min-h-[60px]">
                      {liveTranscript || "Listening..."}
                    </p>
                  </div>
                )}
              </div>
            )}

            {isProcessing && (
              <div className="bg-[#161b22] p-8 rounded-xl border border-gray-700 shadow-lg">
                <h3 className="text-xl font-bold mb-6 text-center">Processing AI Pipeline</h3>
                <div className="space-y-4 max-w-md mx-auto">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      {idx < processStep ? (
                        <CheckCircle className="h-6 w-6 text-teal-500" />
                      ) : idx === processStep ? (
                        <div className="h-6 w-6 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-gray-700" />
                      )}
                      <span className={idx <= processStep ? 'text-white font-medium' : 'text-gray-500'}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resultsAvailable && consultData && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {['SOAP Note', 'ICD-11 Codes', 'Drug Check', 'Patient Summary', 'Prescription', 'Transcript'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setResultTab(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${resultTab === tab ? 'bg-teal-600 text-white' : 'bg-[#161b22] text-gray-400 hover:bg-gray-800'
                          }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div>
                    <button
                      onClick={handleApprove}
                      disabled={isApproved}
                      className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${isApproved ? 'bg-green-600/50 text-green-200 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white'
                        }`}
                    >
                      <CheckCircle className="h-5 w-5" />
                      {isApproved ? 'Signed & Saved' : 'Doctor Approves & Saves Note'}
                    </button>
                  </div>
                </div>

                <div className="bg-[#161b22] p-6 rounded-xl border border-gray-700 shadow-lg min-h-[400px]">
                  {resultTab === 'SOAP Note' && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold border-b border-gray-700 pb-2">Structured SOAP Note</h3>
                      {Object.entries(consultData.soap).map(([key, val]) => {
                        if (typeof val === 'string') {
                          return (
                            <div key={key}>
                              <h4 className="text-teal-400 font-bold uppercase text-sm mb-1">{key}</h4>
                              <p className="text-gray-300 bg-gray-800/30 p-3 rounded-lg">{val}</p>
                            </div>
                          );
                        }
                        if (Array.isArray(val)) {
                          return (
                            <div key={key}>
                              <h4 className="text-teal-400 font-bold uppercase text-sm mb-1">{key}</h4>
                              <p className="text-gray-300 bg-gray-800/30 p-3 rounded-lg">{val.join(', ')}</p>
                            </div>
                          );
                        }
                        return null;
                      })}
                      {renderSecurityWarning()}
                    </div>
                  )}

                  {resultTab === 'ICD-11 Codes' && (
                    <div>
                      <h3 className="text-xl font-bold border-b border-gray-700 pb-2 mb-4">Diagnostic Codes</h3>
                      <div className="grid gap-4">
                        {consultData.icd?.primary && (
                          <div className="bg-gray-800/50 p-4 rounded-lg border border-teal-700/50 flex justify-between items-center">
                            <div>
                              <span className="text-xs text-teal-400 uppercase font-bold block mb-1">Primary Diagnosis</span>
                              <span className="text-2xl font-bold text-teal-500 mr-4">{consultData.icd.primary.code}</span>
                              <span className="text-lg">{consultData.icd.primary.desc}</span>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-900/50 text-green-400">
                              {consultData.icd.primary.confidence} Match
                            </span>
                          </div>
                        )}
                        {consultData.icd?.alternatives?.map((item, idx) => (
                          <div key={idx} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex justify-between items-center opacity-80">
                            <div>
                              <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Alternative Diagnosis</span>
                              <span className="text-xl font-bold text-gray-400 mr-4">{item.code}</span>
                              <span className="text-md text-gray-300">{item.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {renderSecurityWarning()}
                    </div>
                  )}

                  {resultTab === 'Drug Check' && consultData.drug_check && (
                    <div>
                      <h3 className="text-xl font-bold border-b border-gray-700 pb-2 mb-4 flex items-center gap-2">
                        <AlertTriangle className={consultData.drug_check.overall_risk === 'HIGH' ? "text-red-500 h-6 w-6" : "text-yellow-500 h-6 w-6"} /> OpenFDA Interaction Check
                      </h3>
                      <div className={consultData.drug_check.overall_risk === 'HIGH' ? "bg-red-900/20 border border-red-900/50 p-6 rounded-lg" : "bg-yellow-900/20 border border-yellow-900/50 p-6 rounded-lg"}>
                        <div className="flex items-center gap-3 mb-4">
                          <span className={consultData.drug_check.overall_risk === 'HIGH' ? "bg-red-600 text-white px-3 py-1 rounded-md font-bold text-sm" : "bg-yellow-600 text-white px-3 py-1 rounded-md font-bold text-sm"}>
                            RISK: {consultData.drug_check.overall_risk}
                          </span>
                        </div>
                        <p className={`text-lg font-medium mb-2 ${consultData.drug_check.overall_risk === 'HIGH' ? 'text-red-200' : 'text-yellow-200'}`}>
                          {consultData.drug_check.details}
                        </p>
                        <p className="text-gray-400 text-sm italic mb-6">Recommendation: {consultData.drug_check.action}</p>

                        <div className="text-xs text-gray-500 border-t border-gray-800 pt-4">
                          {consultData.drug_check.disclaimer}
                        </div>
                      </div>
                    </div>
                  )}

                  {resultTab === 'Patient Summary' && consultData.summary && (
                    <div>
                      <h3 className="text-xl font-bold border-b border-gray-700 pb-2 mb-4 flex items-center justify-between">
                        Patient-Friendly Summary
                        <span className={`text-sm font-normal px-3 py-1 rounded-full border ${consultData.summary.validated ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-red-900/30 text-red-400 border-red-800'}`}>
                          Reading Grade: {consultData.summary.flesch_kincaid_grade} ({consultData.summary.validated ? 'PASS' : 'FAIL'})
                        </span>
                      </h3>
                      <p className="text-xl leading-relaxed text-gray-200 bg-gray-800/30 p-6 rounded-lg font-serif">
                        {consultData.summary.summary}
                      </p>

                      {consultData.reminder && (
                        <div className="mt-6 border-t border-gray-700 pt-4">
                          <h4 className="text-sm font-bold text-gray-400 mb-2">Automated Follow-up (SMS/WhatsApp):</h4>
                          <div className="bg-gray-900 p-3 rounded-lg text-sm text-gray-300 font-mono">
                            {consultData.reminder.whatsapp_message}
                          </div>
                        </div>
                      )}
                      {renderSecurityWarning()}
                    </div>
                  )}

                  {resultTab === 'Prescription' && (
                    <div>
                      <h3 className="text-xl font-bold border-b border-gray-700 pb-2 mb-4">Electronic Prescription Draft</h3>
                      <div className="bg-gray-800/30 p-6 rounded-lg mb-4">
                        {consultData.prescription && consultData.prescription.length > 0 ? consultData.prescription.map((rx, idx) => (
                          <div key={idx} className="flex justify-between items-center border-b border-gray-700 pb-4 last:border-0 last:pb-0 pt-4 first:pt-0">
                            <div>
                              <div className="text-2xl font-bold font-serif text-white">{rx.drug_name}</div>
                              <div className="text-gray-400 mt-1">Dose: {rx.dosage}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-teal-400">{rx.frequency}</div>
                              <div className="text-xs text-gray-500 mt-1">Duration: {rx.duration}</div>
                            </div>
                          </div>
                        )) : <p>No medications recorded.</p>}
                      </div>
                      {renderSecurityWarning()}
                    </div>
                  )}

                  {resultTab === 'Transcript' && (
                    <div>
                      <h3 className="text-xl font-bold border-b border-gray-700 pb-2 mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5" /> Raw Audio Transcript
                      </h3>
                      <p className="text-gray-300 leading-relaxed font-mono text-sm bg-gray-900 p-6 rounded-lg border border-gray-800">
                        {consultData.transcript}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Analytics' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold mb-6">Physician Analytics</h2>

            {analyticsData ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard title="Total Consultations" value={analyticsData.total_consultations} icon={<UserPlus />} color="text-blue-500" />
                  <StatCard title="This Week" value={analyticsData.this_week} icon={<Activity />} color="text-teal-500" />
                  <StatCard title="Minutes Saved" value={analyticsData.minutes_saved} icon={<Clock />} color="text-purple-500" />
                  <StatCard title="Patient Hours Gained" value={analyticsData.hours_returned} icon={<Heart />} color="text-pink-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                  <div className="bg-[#161b22] p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="text-xl font-bold mb-6">Top Diagnoses</h3>
                    <div className="space-y-4">
                      {analyticsData.top_diagnoses?.map((d, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{d.name}</span>
                            <span className="text-gray-400">{d.count}</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-600 rounded-full" style={{ width: `${Math.min(100, (d.count / (analyticsData.top_diagnoses[0].count || 1)) * 100)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#161b22] p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="text-xl font-bold mb-6">Most Prescribed Drugs</h3>
                    <ul className="space-y-3">
                      {analyticsData.most_prescribed_drugs?.map((drug, i) => (
                        <li key={i} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                          <span className="font-medium text-gray-300">{drug}</span>
                          <span className="bg-gray-700 text-xs px-2 py-1 rounded text-gray-300">#{i + 1}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 p-4 bg-teal-900/20 border border-teal-800 rounded-lg">
                      <p className="text-teal-400 font-bold mb-1">Approval Rate: {analyticsData.approval_rate}</p>
                      <p className="text-sm text-gray-400">{analyticsData.impact_statement}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : <p>Loading Analytics...</p>}
          </div>
        )}

        {activeTab === 'History' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Consultation History</h2>
            <div className="bg-[#161b22] rounded-xl border border-gray-700 shadow-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-800/50 border-b border-gray-700 text-gray-400 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Diagnosis</th>
                    <th className="px-6 py-4">ICD Code</th>
                    <th className="px-6 py-4">Drugs</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {historyData.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-400">CON-{row.id}</td>
                      <td className="px-6 py-4 text-sm">{row.date}</td>
                      <td className="px-6 py-4 text-sm font-medium text-white">{row.diagnosis}</td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-800 px-2 py-1 rounded text-xs text-teal-400 border border-gray-700">{row.icd_code}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{row.drug_count} prescribed</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 'Approved' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {historyData.length === 0 && (
                    <tr><td colSpan="6" className="p-6 text-center text-gray-500">No consultations found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-[#161b22] p-6 rounded-xl border border-gray-700 shadow-lg flex items-center gap-4">
      <div className={`p-4 rounded-lg bg-gray-800/50 ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-gray-400 text-sm font-medium mb-1">{title}</div>
        <div className="text-3xl font-bold">{value}</div>
      </div>
    </div>
  );
}

function PlusCircleIcon() { return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function ActivityIcon() { return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>; }
function HistoryIcon() { return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
