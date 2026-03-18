export default function About() {
  return (
    <div className="page-container animate-fade-in">
      <div className="about-wrapper">

        {/* App identity */}
        <div className="about-hero glass-card">
          <div className="about-logo">⬡</div>
          <h1 className="about-app-name">Nexia Heijunka</h1>
          <span className="badge badge-accent about-badge">v1.0.0</span>
          <p className="about-description">
            Plataforma profesional de nivelación de producción basada en la metodología{' '}
            <strong>Heijunka</strong>. Gestiona la demanda, calcula takt time y pitch,
            secuencia familias de productos y visualiza la caja Heijunka para lograr
            flujos de producción más estables y eficientes.
          </p>
        </div>

        {/* Developer */}
        <div className="about-section glass-card">
          <p className="about-section-label">Desarrollado por</p>
          <p className="about-company-name">NexIA Soluciones</p>
          <a
            href="https://www.nexiasoluciones.com.mx"
            target="_blank"
            rel="noopener noreferrer"
            className="about-website-link"
          >
            www.nexiasoluciones.com.mx ↗
          </a>
        </div>

        {/* Contact */}
        <div className="about-section glass-card">
          <p className="about-section-label">¿Te interesa esta herramienta?</p>
          <p className="about-contact-desc">
            Escríbenos y con gusto te asesoramos sobre cómo NexIA puede
            impulsar la nivelación de producción en tu organización.
          </p>
          <a
            href="mailto:soporte@nexiasoluciones.com.mx?subject=Información sobre Nexia Heijunka"
            className="btn btn-primary about-contact-btn"
          >
            ✉️ Contactar a NexIA
          </a>
        </div>

        {/* Footer */}
        <p className="about-footer">
          © {new Date().getFullYear()} NexIA Soluciones · Todos los derechos reservados
        </p>

      </div>
    </div>
  );
}
