
export default function LandingGlobalStyles() {
  return (
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: .5; transform: scale(1); }
          50% { opacity: .85; transform: scale(1.08); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes floatY2 {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-10px) rotate(-2deg); }
        }
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @media (max-width: 1000px) {
          .landing-students-link { display: none !important; }
        }
        @media (max-width: 820px) {
          .nav-links { display: none !important; }
          .floating-doodles { display: none !important; }
          .feature-showcase-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 720px) {
          .pg-grid { grid-template-columns: 1fr !important; }
          .pg-sidebar {
            flex-direction: row !important;
            overflow-x: auto !important;
            border-right: none !important;
            border-bottom: 1px solid #EEF1F5 !important;
            gap: 8px !important;
            padding: 10px !important;
          }
          .pg-sidebar-header { display: none !important; }
          .pg-sidebar-footer { display: none !important; }
          .pg-sidebar button { width: auto !important; flex: 0 0 auto !important; margin-bottom: 0 !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
          .footer-grid-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}} />
  );
}
