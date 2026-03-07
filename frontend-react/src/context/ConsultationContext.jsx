import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

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

    useEffect(() => {
        localStorage.setItem('clin-note-settings', JSON.stringify(settings));

        // Apply theme
        const root = document.documentElement;
        if (settings.darkMode) {
            root.style.setProperty('--bg-primary', '#0d1117');
            root.style.setProperty('--bg-secondary', '#161b22');
            root.style.setProperty('--text-primary', '#e6edf3');
            root.style.setProperty('--text-muted', 'rgba(255,255,255,0.4)');
            root.style.setProperty('--border-color', 'rgba(255,255,255,0.06)');
            document.body.style.backgroundColor = '#0d1117';
        } else {
            root.style.setProperty('--bg-primary', '#f8fafc');
            root.style.setProperty('--bg-secondary', '#ffffff');
            root.style.setProperty('--text-primary', '#0f172a');
            root.style.setProperty('--text-muted', '#64748b');
            root.style.setProperty('--border-color', '#e2e8f0');
            document.body.style.backgroundColor = '#f8fafc';
        }
    }, [settings]);

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
            fetchHistory();
            fetchAnalytics();
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
        reminders, settings, setSettings,
        startRecording, stopRecording, handleApprove,
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
