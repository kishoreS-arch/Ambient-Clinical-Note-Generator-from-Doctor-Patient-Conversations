import React, { useState } from 'react';
import LoginPage from './LoginPage';
import { ConsultationProvider } from './context/ConsultationContext';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import NewConsultationPage from './pages/NewConsultationPage';
import TranscriptPage from './pages/TranscriptPage';
import SoapNotesPage from './pages/SoapNotesPage';
import PrescriptionPage from './pages/PrescriptionPage';
import DrugInteractionsPage from './pages/DrugInteractionsPage';
import PatientSummaryPage from './pages/PatientSummaryPage';
import PatientRecordsPage from './pages/PatientRecordsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import RemindersPage from './pages/RemindersPage';
import AIAssistantPage from './pages/AIAssistantPage';
import SettingsPage from './pages/SettingsPage';
import ConsultationHistoryPage from './pages/ConsultationHistoryPage';
import ReportsPage from './pages/ReportsPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('doctor');
    const [activeTab, setActiveTab] = useState('dashboard');

    if (!isAuthenticated) {
        return <LoginPage onLoginSuccess={(role) => {
            setUserRole(role || 'doctor');
            setActiveTab('dashboard');
            setIsAuthenticated(true);
        }} />;
    }

    const renderPage = () => {
        // Patient restriction check
        if (userRole === 'patient') {
            switch (activeTab) {
                case 'dashboard': return <DashboardPage setActiveTab={setActiveTab} userRole={userRole} />;
                case 'consultation-history': return <ConsultationHistoryPage />;
                case 'prescriptions': return <PrescriptionPage isPatient />;
                case 'patient-summary': return <PatientSummaryPage />;
                case 'reports': return <ReportsPage />;
                case 'reminders': return <RemindersPage />;
                case 'messages': return <MessagesPage />;
                case 'profile': return <ProfilePage />;
                default: return <DashboardPage setActiveTab={setActiveTab} userRole={userRole} />;
            }
        }

        switch (activeTab) {
            case 'dashboard': return <DashboardPage setActiveTab={setActiveTab} userRole={userRole} />;
            case 'new-consultation': return <NewConsultationPage />;
            case 'transcript': return <TranscriptPage />;
            case 'soap-notes': return <SoapNotesPage />;
            case 'prescription': return <PrescriptionPage />;
            case 'drug-interactions': return <DrugInteractionsPage />;
            case 'patient-records': return <PatientRecordsPage setActiveTab={setActiveTab} />;
            case 'analytics': return <AnalyticsPage />;
            case 'reminders': return <RemindersPage />;
            case 'ai-assistant': return <AIAssistantPage setActiveTab={setActiveTab} />;
            case 'settings': return <SettingsPage />;
            default: return <DashboardPage setActiveTab={setActiveTab} userRole={userRole} />;
        }
    };

    return (
        <ConsultationProvider>
            <div style={{
                display: 'flex',
                height: '100vh',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                transition: 'background 0.3s, color 0.3s',
            }}>
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    userRole={userRole}
                    onLogout={() => { setIsAuthenticated(false); setUserRole('doctor'); setActiveTab('dashboard'); }}
                />
                <main style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '32px 40px',
                    background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
                }}>
                    {renderPage()}
                </main>
            </div>
        </ConsultationProvider>
    );
}
