import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const NAV_ITEMS = [
    { path: '/', label: 'Inicio', icon: '🏠' },
    { path: '/data', label: 'Datos y Demanda', icon: '📊' },
    { path: '/calculations', label: 'Cálculos Lean', icon: '⚙️' },
    { path: '/sequencing', label: 'Secuenciación', icon: '🔄' },
    { path: '/heijunka-box', label: 'Caja Heijunka', icon: '📦' },
    { path: '/dashboards', label: 'Dashboards', icon: '📈' },
    { path: '/manual', label: 'Manual', icon: '📘' },
    { path: '/about', label: 'Acerca de', icon: 'ℹ️' },
];

export default function Sidebar() {
    const location = useLocation();
    const { user, signOut } = useAuth();

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario';
    const displayEmail = user?.email || '';

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
                {user && (
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="sidebar-user-info">
                            <span className="sidebar-user-name">{displayName}</span>
                            <span className="sidebar-user-email">{displayEmail}</span>
                        </div>
                    </div>
                )}
                <button className="sidebar-logout-btn" onClick={signOut} title="Cerrar sesión">
                    🚪 Cerrar sesión
                </button>
                <div className="sidebar-version">v1.0.0 · Lean Manufacturing</div>
            </div>
        </aside>
    );
}
