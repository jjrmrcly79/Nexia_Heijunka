import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import DataEntry from './pages/DataEntry';
import Calculations from './pages/Calculations';
import Sequencing from './pages/Sequencing';
import HeijunkaBox from './pages/HeijunkaBox';
import Dashboards from './pages/Dashboards';
import Manual from './pages/Manual';
import About from './pages/About';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';

function ProtectedLayout() {
    return (
        <>
            <Sidebar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/data" element={<DataEntry />} />
                    <Route path="/calculations" element={<Calculations />} />
                    <Route path="/sequencing" element={<Sequencing />} />
                    <Route path="/heijunka-box" element={<HeijunkaBox />} />
                    <Route path="/dashboards" element={<Dashboards />} />
                    <Route path="/manual" element={<Manual />} />
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </>
    );
}

export default function App() {
    const { session, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '100vh', background: 'var(--color-bg)', flexDirection: 'column', gap: '1rem'
            }}>
                <span style={{ fontSize: '2.5rem', animation: 'pulse 1.5s ease-in-out infinite' }}>⬡</span>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Cargando sesión…</p>
            </div>
        );
    }

    return (
        <Routes>
            <Route
                path="/login"
                element={!session ? <Login /> : <Navigate to="/" replace />}
            />
            <Route
                path="/*"
                element={session ? <ProtectedLayout /> : <Navigate to="/login" replace />}
            />
        </Routes>
    );
}
