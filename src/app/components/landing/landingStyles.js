// Shared inline-style objects for the landing shells (kept out of component files for fast refresh).

export const ghostButtonStyle = (scrolled) => ({
  fontFamily: "'Inter', sans-serif",
  fontWeight: 700,
  fontSize: '14px',
  color: scrolled ? '#475569' : '#FFFFFF',
  textDecoration: 'none',
  padding: '9px 15px',
  borderRadius: '9px',
  border: scrolled ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.15)',
  background: scrolled ? '#fff' : 'rgba(255, 255, 255, 0.08)',
  transition: 'all 0.2s',
  whiteSpace: 'nowrap',
});

export const ghostButtonHover = (scrolled) => ({
  onMouseOver: (e) => {
    e.currentTarget.style.backgroundColor = scrolled ? '#F8FAFC' : 'rgba(255, 255, 255, 0.15)';
    e.currentTarget.style.borderColor = scrolled ? '#CBD5E1' : 'rgba(255, 255, 255, 0.3)';
  },
  onMouseOut: (e) => {
    e.currentTarget.style.backgroundColor = scrolled ? '#fff' : 'rgba(255, 255, 255, 0.08)';
    e.currentTarget.style.borderColor = scrolled ? '#E2E8F0' : 'rgba(255, 255, 255, 0.15)';
  },
});

export const MINI_MOCK_STYLE = { position: 'relative', width: '85%', background: '#fff', border: '1px solid #EEF1F5', borderRadius: '10px', padding: '14px', boxShadow: '0 10px 30px rgba(15,23,42,0.08)', textAlign: 'left', zIndex: 2 };
export const TIER_GRID_STYLE = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '32px', maxWidth: '820px', margin: '0 auto', alignItems: 'center' };
