import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import Dashboard from './pages/dashboard';
import Transactions from './pages/transactions';
import CalendarPage from './pages/calendarPage';
import Reports from './pages/reports';
import Navbar from './components/navbar';
import { createClient } from './lib/supabase';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      {session ? <Navbar /> : null}
      <Routes>
        <Route path="/" element={session ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route 
          path="/dashboard" 
          element={session ? <Dashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/transactions" 
          element={session ? <Transactions /> : <Navigate to="/" />} 
        />
        <Route 
          path="/calendar" 
          element={session ? <CalendarPage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/reports" 
          element={session ? <Reports /> : <Navigate to="/" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;