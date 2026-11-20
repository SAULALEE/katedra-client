import { BookOpen, ClipboardCheck, Compass, Lightbulb, MessageSquareText, Sparkles } from 'lucide-react';

// Mirrors TeacherHeroDecorations: four stickers, two sparkles, three glass badges
// and dashed glow connections, in the student purple palette.
const sticker = (size, radius) => ({
  display: 'grid', placeItems: 'center', width: `${size}px`, height: `${size}px`, borderRadius: `${radius}px`,
  background: '#F5F3FF', border: '1.5px solid #DDD6FE', boxShadow: '0 14px 28px rgba(15, 23, 42, 0.16)',
});

const glassBadge = (radius) => ({
  position: 'absolute', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(12px)',
  border: '1px solid rgba(167, 139, 250, 0.4)', borderRadius: radius, boxShadow: '0 8px 24px rgba(124, 58, 237, 0.25)', pointerEvents: 'auto',
});

const dot = { width: '6px', height: '6px', borderRadius: '50%', background: '#A78BFA', boxShadow: '0 0 8px #A78BFA' };
const badgeText = { fontSize: '11px', fontWeight: 700, color: '#E2E8F0', whiteSpace: 'nowrap' };

export default function StudentHeroDecorations() {
  return (
    <>
      <div className="floating-doodles" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
        <div style={{ position: 'absolute', top: '-48px', left: '-68px', transform: 'rotate(-9deg)' }}>
          <div style={{ ...sticker(56, 16), animation: 'floatY 6s ease-in-out infinite' }}><BookOpen size={24} color="#7C3AED" strokeWidth={1.8} /></div>
        </div>
        <div style={{ position: 'absolute', top: '-46px', right: '-60px', transform: 'rotate(7deg)' }}>
          <div style={{ ...sticker(54, 16), animation: 'floatY 7s ease-in-out infinite 0.4s' }}><Lightbulb size={22} color="#8B5CF6" strokeWidth={1.8} /></div>
        </div>
        <div style={{ position: 'absolute', top: '152px', right: '-74px', transform: 'rotate(8deg)' }}>
          <div style={{ ...sticker(52, 14), animation: 'floatY2 8s ease-in-out infinite' }}><ClipboardCheck size={22} color="#6D28D9" strokeWidth={1.8} /></div>
        </div>
        <div style={{ position: 'absolute', bottom: '78px', left: '-70px', transform: 'rotate(-7deg)' }}>
          <div style={{ ...sticker(54, 16), background: '#F1F5F9', border: '1.5px solid #CBD5E1', animation: 'floatY 7.5s ease-in-out infinite 0.2s' }}><MessageSquareText size={23} color="#475569" strokeWidth={1.8} /></div>
        </div>

        <div style={{ position: 'absolute', top: '20px', left: '120px', color: '#DDD6FE', animation: 'pulseGlow 3.5s ease-in-out infinite' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z" /></svg>
        </div>
        <div style={{ position: 'absolute', bottom: '120px', right: '20px', color: '#fff', animation: 'pulseGlow 4s ease-in-out infinite 0.6s' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z" /></svg>
        </div>

        <div style={{ ...glassBadge('100px'), top: '40px', left: '-80px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px', animation: 'floatY 6s ease-in-out infinite' }}>
          <span style={dot}></span><span style={badgeText}>Clase en curso · ✦</span>
        </div>
        <div style={{ ...glassBadge('12px'), top: '50px', right: '-90px', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left', animation: 'floatY 8s ease-in-out infinite 0.5s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={11} color="#A78BFA" />
            <span style={{ fontSize: '9px', fontWeight: 800, color: '#A78BFA', letterSpacing: '0.5px' }}>IA CONTEXTUAL</span>
          </div>
          <span style={{ ...badgeText, fontWeight: 600 }}>Explica la consigna</span>
        </div>
        <div style={{ ...glassBadge('100px'), bottom: '100px', right: '-80px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px', animation: 'floatY 7s ease-in-out infinite 0.2s' }}>
          <Compass size={12} color="#C4B5FD" /><span style={badgeText}>Siguiente paso listo</span>
        </div>
      </div>

      <svg aria-hidden="true" style={{ position: 'absolute', inset: '-60px -100px', width: 'calc(100% + 200px)', height: 'calc(100% + 120px)', pointerEvents: 'none', zIndex: 1 }}>
        <defs>
          <linearGradient id="studentGlowGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="studentGlowGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path d="M 60 160 Q 140 180 180 230" fill="none" stroke="url(#studentGlowGrad1)" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M 880 160 Q 760 180 660 210" fill="none" stroke="url(#studentGlowGrad2)" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M 860 440 Q 760 410 680 390" fill="none" stroke="url(#studentGlowGrad1)" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
    </>
  );
}
