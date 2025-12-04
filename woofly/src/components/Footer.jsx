import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#f3f4f6',
      borderTop: '1px solid #e5e7eb',
      marginTop: 'auto',
      padding: '32px 16px'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Navigation principale */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          marginBottom: '32px'
        }}>
          {/* Woofly */}
          <div>
            <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>
              Woofly
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              L'application complète pour gérer la santé et le bien-être de votre chien.
            </p>
          </div>

          {/* Application */}
          <div>
            <h4 style={{ fontWeight: '600', marginBottom: '16px' }}>Application</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="/dog-profile" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>
                  Mon chien
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/forum-hub" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>
                  Communauté
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/daily-tip" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>
                  Conseils & Contacts
                </a>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4 style={{ fontWeight: '600', marginBottom: '16px' }}>Ressources</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="/about" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>
                  À propos
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/contact" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 style={{ fontWeight: '600', marginBottom: '16px' }}>Légal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="/cgu" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>
                  CGU
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/mentions-legales" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>
                  Mentions légales
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/politique-confidentialite" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            © {currentYear} Woofly. Développé par{' '}
            <a href="mailto:inbyoliver@gmail.com" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Olivier Avril
            </a>
          </p>
          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
            Fait avec ❤️ pour nos amis à quatre pattes
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
