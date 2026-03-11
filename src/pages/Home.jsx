import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { calcTaktTime, calcPitch } from '../utils/calculations';
import { classifyABC } from '../utils/abcAnalysis';
import './Home.css';

export default function Home() {
    const { state } = useApp();
    const { products, params } = state;

    const totalWeeklyDemand = products.reduce((sum, p) => sum + (p.weeklyDemand || 0), 0);
    const dailyDemand = params.workingDaysPerWeek > 0 ? totalWeeklyDemand / params.workingDaysPerWeek : 0;
    const totalAvailable = params.availableTimePerShift * params.shiftsPerDay;
    const taktTime = calcTaktTime(totalAvailable, dailyDemand);
    const avgPackSize = products.length > 0
        ? products.reduce((s, p) => s + (p.packSize || 1), 0) / products.length
        : 1;
    const pitch = calcPitch(taktTime, Math.round(avgPackSize));
    const classified = classifyABC(products);
    const countA = classified.filter(p => p.abcClass === 'A').length;
    const countB = classified.filter(p => p.abcClass === 'B').length;
    const countC = classified.filter(p => p.abcClass === 'C').length;

    const MODULES = [
        { path: '/data', icon: '📊', title: 'Datos y Demanda', desc: 'Gestión de productos, historial de demanda y análisis ABC' },
        { path: '/calculations', icon: '⚙️', title: 'Cálculos Lean', desc: 'Takt Time, Pitch y EPEI automáticos' },
        { path: '/sequencing', icon: '🔄', title: 'Secuenciación', desc: 'Nivelación por volumen y variedad (mix)' },
        { path: '/heijunka-box', icon: '📦', title: 'Caja Heijunka', desc: 'Tablero interactivo con tarjetas Kanban' },
        { path: '/dashboards', icon: '📈', title: 'Dashboards', desc: 'Monitoreo de WIP, Lead Time y adherencia' },
    ];

    return (
        <div className="page-container animate-fade-in">
            {/* Hero */}
            <section className="home-hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="hero-accent">⬡</span> Nexia Heijunka
                    </h1>
                    <p className="hero-subtitle">
                        Sistema de Nivelación de Producción — Lean Manufacturing
                    </p>
                    <p className="hero-desc">
                        Nivele su producción, reduzca inventario en proceso y establezca un flujo rítmico
                        y predecible con la metodología Heijunka.
                    </p>
                </div>
                <div className="hero-stats">
                    <div className="glass-card stat-card">
                        <span className="stat-label">Productos</span>
                        <span className="stat-value">{products.length}</span>
                        <span className="stat-sub">
                            <span className="badge badge-a">A:{countA}</span>{' '}
                            <span className="badge badge-b">B:{countB}</span>{' '}
                            <span className="badge badge-c">C:{countC}</span>
                        </span>
                    </div>
                    <div className="glass-card stat-card">
                        <span className="stat-label">Takt Time</span>
                        <span className="stat-value">{taktTime > 0 ? taktTime.toFixed(1) : '—'}<span className="stat-unit"> seg</span></span>
                        <span className="stat-sub">Ritmo de producción</span>
                    </div>
                    <div className="glass-card stat-card">
                        <span className="stat-label">Pitch</span>
                        <span className="stat-value">{pitch > 0 ? pitch.toFixed(1) : '—'}<span className="stat-unit"> min</span></span>
                        <span className="stat-sub">Intervalo de control</span>
                    </div>
                    <div className="glass-card stat-card">
                        <span className="stat-label">Demanda Diaria</span>
                        <span className="stat-value">{dailyDemand > 0 ? Math.round(dailyDemand) : '—'}<span className="stat-unit"> uds</span></span>
                        <span className="stat-sub">Total todos los productos</span>
                    </div>
                </div>
            </section>

            {/* Module Cards */}
            <section className="home-modules">
                <h2>Módulos</h2>
                <div className="modules-grid">
                    {MODULES.map((m, i) => (
                        <Link key={m.path} to={m.path} className="module-card glass-card" style={{ animationDelay: `${i * 80}ms` }}>
                            <span className="module-icon">{m.icon}</span>
                            <div className="module-info">
                                <h3>{m.title}</h3>
                                <p>{m.desc}</p>
                            </div>
                            <span className="module-arrow">→</span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
