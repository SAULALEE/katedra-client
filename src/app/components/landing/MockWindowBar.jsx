
export default function MockWindowBar({ colors, isDarkMode }) {
  return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        padding: '11px 16px',
        borderBottom: `1px solid ${colors.border}`,
        background: isDarkMode ? '#1e293b' : '#f8fafc',
        flexShrink: 0
      }}>
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }}></span>
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }}></span>
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }}></span>
        <div style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          fontSize: '11px',
          fontWeight: 600,
          color: colors.faint,
          background: isDarkMode ? 'rgba(0,0,0,0.2)' : '#ffffff',
          border: `1.5px solid ${colors.border}`,
          padding: '2px 30px',
          borderRadius: '6px',
          width: '220px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          app.katedra.com/dashboard
        </div>
      </div>
  );
}
