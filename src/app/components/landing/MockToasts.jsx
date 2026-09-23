import { Check } from 'lucide-react';

export default function MockToasts({ toasts, isDarkMode, colors }) {
  return (
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        zIndex: 110,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        pointerEvents: 'none'
      }}>
        {toasts.map(t => (
          <div
            key={t.id}
            style={{
              background: isDarkMode ? '#1e293b' : '#ffffff',
              border: '1.5px solid #10B981',
              borderRadius: '8px',
              padding: '8px 12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'floatY 0.25s both',
              pointerEvents: 'auto',
              width: '200px'
            }}
          >
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: '#E6F4EA',
              color: '#10B981',
              display: 'grid',
              placeItems: 'center'
            }}>
              <Check size={10} strokeWidth={3} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#10B981' }}>{t.title}</div>
              <div style={{ fontSize: '9px', color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.message}</div>
            </div>
          </div>
        ))}
      </div>
  );
}
