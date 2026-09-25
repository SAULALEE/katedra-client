
export default function LandingModalStyles() {
  return (
      <style>{`
        [data-kt-landing-modal]{
          --kt-bg1:#FFFFFF;
          --kt-text:#334155;--kt-heading:#0F172A;--kt-muted:#64748B;--kt-faint:#94A3B8;
          --kt-border:rgba(15,23,42,.09);--kt-border-soft:rgba(15,23,42,.06);
          --kt-chip-bg:rgba(15,23,42,.045);--kt-chip-border:rgba(15,23,42,.08);
          --kt-modal-bg1:rgba(255,255,255,.98);--kt-modal-bg2:rgba(248,250,252,.98);
          --kt-modal-border:rgba(15,23,42,.09);--kt-modal-backdrop:rgba(15,23,42,.25);
          --kt-shadow-modal:0 30px 70px -25px rgba(15,23,42,.25);
          --kt-scrollbar:rgba(15,23,42,.16);
        }
        .kt-mobile-overlay {
          display: none;
        }
        @media(max-width:820px) {
          .kt-mobile-overlay {
            display: block;
            position: absolute;
            inset: 0;
            z-index: 8;
            background: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(2px);
          }
          [data-root][data-kt-theme="dark"] .kt-mobile-overlay {
            background: rgba(0, 0, 0, 0.7);
          }
        }

        @media (max-width: 760px) {
          .kt-mock-panel { height: auto !important; min-height: 460px !important; }
          .kt-mock-row { flex-direction: column !important; }
          .kt-mock-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid rgba(148,163,184,0.2) !important; padding-bottom: 24px !important; }
          .kt-mock-header-content { flex-direction: column !important; align-items: flex-start !important; gap: 14px !important; }
          .kt-mock-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
  );
}
