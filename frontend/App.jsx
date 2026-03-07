import React, { useState } from 'react';
import LoginPage from './LoginPage';
import ClinNoteDashboard from './ClinNoteDashboard';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <>
            {isAuthenticated ? (
                <ClinNoteDashboard />
            ) : (
                <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
            )}
        </>
    );
}
