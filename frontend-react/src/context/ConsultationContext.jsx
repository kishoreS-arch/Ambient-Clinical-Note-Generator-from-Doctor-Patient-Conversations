import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { translations } from '../i18n/translations';

const ConsultationContext = createContext(null);

export function ConsultationProvider({ children }) {
    const [isRecording, setIsRecording] = useState(false);
    const [liveTranscript, setLiveTranscript] = useState('');
    const [consultData, setConsultData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processStep, setProcessStep] = useState(0);
    const [resultsAvailable, setResultsAvailable] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [reminders, setReminders] = useState([
        { id: 1, patient: 'Raj Kumar', task: 'ECG test', dueDate: '2026-03-12', status: 'pending' },
        { id: 2, patient: 'Priya Sharma', task: 'Blood pressure follow-up', dueDate: '2026-03-15', status: 'pending' },
        { id: 3, patient: 'Arun Patel', task: 'Lab results review', dueDate: '2026-03-10', status: 'completed' },
    ]);
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('clin-note-settings');
        return saved ? JSON.parse(saved) : {
            doctorName: 'Dr. Kishore',
            hospitalName: 'City Medical Center',
            language: 'English',
            darkMode: true,
            aiVoice: true,
        };
    });

    const [aiInsights, setAiInsights] = useState({
        missedSymptoms: [],
        emotionAnalysis: { stress: 'Low', pain: 12, anxiety: 'None' },
        riskPrediction: [],
        suggestedQuestions: [],
        burnoutStats: { consultationsToday: 12, cumulativeStress: 'Low' },
        timeline: []
    });

    useEffect(() => {
        localStorage.setItem('clin-note-settings', JSON.stringify(settings));

        // Apply theme via class toggle
        const root = document.documentElement;
        if (settings.darkMode) {
            root.classList.remove('light-mode');
        } else {
            root.classList.add('light-mode');
        }
    }, [settings.darkMode]);

    // t helper for translations
    const t = (key) => {
        const lang = settings.language || 'English';
        const set = translations[lang] || translations['English'];
        return set[key] || key;
    };

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recognitionRef = useRef(null);

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
            const res = await fetch('/api/analytics');
            if (res.ok) setAnalyticsData(await res.json());
        } catch (e) { console.error("Could not fetch analytics", e); }
    };

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/consultations');
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
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
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

            const response = await fetch('/api/process_audio', {
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
            fetchHistory();
            fetchAnalytics();
        } catch (error) {
            console.error("Error processing audio:", error);
            clearInterval(interval);
            setIsProcessing(false);
            alert("Error processing audio. Is backend running?");
        }
    };

    const startDemoConsultation = () => {
        setIsProcessing(true);
        setProcessStep(0);
        setIsApproved(false);
        setResultsAvailable(false);

        // Simulation of voice/audio playing could go here
        const synth = window.speechSynthesis;
        const msg = new SpeechSynthesisUtterance("Patient complains of persistent cough and mild fever for three days. No shortness of breath. Heart sounds are normal. Prescription: Paracetamol and rest.");
        msg.rate = 0.9;
        synth.speak(msg);

        const interval = setInterval(() => {
            setProcessStep(prev => {
                if (prev >= 6) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, 1200);

        const timelineData = [
            { date: 'Jan 10', event: 'Fever' },
            { date: 'Jan 12', event: 'Cough' },
            { date: 'Jan 14', event: 'Breathing difficulty' }
        ];

        setTimeout(() => {
            const demoData = {
                id: "DEMO-" + Date.now(),
                transcript: "Patient: I've had this cough for 3 days and a bit of fever. I also felt some dizziness earlier today.\nDoctor: Any chest pain?\nPatient: No, just tired and lightheaded.",
                soap_notes: {
                    Subjective: "3-day history of cough and fever.",
                    Objective: "Temperature 101F. Normal heart sounds.",
                    Assessment: "Mild viral infection.",
                    Plan: "Rest, hydration, and Paracetamol."
                },
                icd_codes: [{ code: "J06.9", description: "Acute upper respiratory infection" }],
                prescription: [{ drug: "Paracetamol", dosage: "500mg", instructions: "Twice daily" }],
                summary: "Patient presents with mild respiratory symptoms. Diagnosed with viral infection. Prescribed rest and paracetamol."
            };

            setConsultData(demoData);
            setAiInsights({
                missedSymptoms: ["Dizziness", "Lightheadedness"],
                emotionAnalysis: { stress: 'Medium', pain: 45, anxiety: 'Moderate' },
                riskPrediction: [
                    { disease: "Flu", risk: 'High' },
                    { disease: "Pneumonia", risk: 'Medium' },
                    { disease: "COVID-like", risk: 'Low' }
                ],
                suggestedQuestions: [
                    "When did the pain start?",
                    "Does pain increase while breathing?",
                    "Does the pain spread to the arm?"
                ],
                burnoutStats: { consultationsToday: 28, cumulativeStress: 'High' },
                timeline: timelineData
            });
            setIsProcessing(false);
            setResultsAvailable(true);
        }, 8500);
    };

    const handleApprove = async () => {
        if (!consultData) return;
        try {
            const res = await fetch(`/api/approve_consultation/${consultData.id}`, { method: 'POST' });
            if (res.ok) {
                setIsApproved(true);
                fetchHistory();
            }
        } catch (e) {
            alert("Failed to approve consultation.");
        }
    };

    const addReminder = (reminder) => {
        setReminders(prev => [...prev, { ...reminder, id: Date.now(), status: 'pending' }]);
    };

    const toggleReminderStatus = (id) => {
        setReminders(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'pending' ? 'completed' : 'pending' } : r));
    };

    const deleteReminder = (id) => {
        setReminders(prev => prev.filter(r => r.id !== id));
    };

    const value = {
        isRecording, liveTranscript, consultData, isProcessing, processStep,
        resultsAvailable, isApproved, analyticsData, historyData, steps,
        reminders, settings, setSettings, t, aiInsights, setAiInsights,
        startRecording, stopRecording, handleApprove, startDemoConsultation,
        setConsultData, setLiveTranscript, setResultsAvailable,
        fetchAnalytics, fetchHistory,
        addReminder, toggleReminderStatus, deleteReminder,
    };

    return (
        <ConsultationContext.Provider value={value}>
            {children}
        </ConsultationContext.Provider>
    );
}

export function useConsultation() {
    const context = useContext(ConsultationContext);
    if (!context) throw new Error('useConsultation must be used within ConsultationProvider');
    return context;
}
