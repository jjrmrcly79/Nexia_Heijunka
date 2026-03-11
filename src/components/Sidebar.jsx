import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

const NAV_ITEMS = [
    { path: '/', label: 'Inicio', icon: '🏠' },
    { path: '/data', label: 'Datos y Demanda', icon: '📊' },
    { path: '/calculations', label: 'Cálculos Lean', icon: '⚙️' },
    { path: '/sequencing', label: 'Secuenciación', icon: '🔄' },
    { path: '/heijunka-box', label: 'Caja Heijunka', icon: '📦' },
    { path: '/dashboards', label: 'Dashboards', icon: '📈' },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-logo">
                    <span className="logo-hex">⬡</span>
                </div>
                <div className="sidebar-brand-text">
                    <span className="brand-name">Nexia</span>
                    <span className="brand-sub">Heijunka</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {NAV_ITEMS.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                        end={item.path === '/'}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                        {location.pathname === item.path && (
                            <span className="nav-indicator" />
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-version">v1.0.0</div>
                <div className="sidebar-tagline">Lean Manufacturing</div>
            </div>
        </aside>
    );
}
