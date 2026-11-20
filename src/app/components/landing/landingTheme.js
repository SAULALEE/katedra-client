// Color tokens shared by the teacher (/) and student (/alumnos) landings.
// Both landings render the same section shells; only these values change.
// Neutrals (#0F172A, #475569, #64748B, #EEF1F5, #F8FAFC) are intentionally not themed.

export const TEACHER_THEME = {
  heroGradient: 'radial-gradient(125% 140% at 18% 8%, #1E3A8A 0%, #2563EB 22%, #06B6D4 42%, #10B981 66%, #34D399 88%, #FCD34D 116%)',
  bandGradient: 'linear-gradient(110deg, #1D4ED8 0%, #0EA5E9 30%, #10B981 65%, #34D399 100%)',
  glowBlob: '#10B981',
  badgeDot: '#34D399',
  accent: '#10B981',
  accentRgb: '16,185,129',
  accentSoft: '#ECFDF5',
  accentSoftStrong: '#D1FAE5',
  accentBorder: '#A7F3D0',
  accentStrong: '#065F46',
  accentDeep: '#047857',
  accentLight: '#34D399',
  ctaGradient: 'linear-gradient(135deg, #2B6CB0, #2C5282)',
  ctaShadow: 'rgba(43, 108, 176, 0.42)',
  statGradient: 'linear-gradient(135deg, #10B981, #059669)',
  badgeGradient: 'linear-gradient(110deg, #10B981, #34D399)',
  tierButtonGradient: 'linear-gradient(110deg, #34D399, #10B981)',
  bandEyebrow: '#A7F3D0',
  crossLink: { background: '#EFF6FF', border: '#BFDBFE', color: '#2C5282' },
  footerCrossLink: '#93C5FD',
};

export const STUDENT_THEME = {
  heroGradient: 'radial-gradient(125% 140% at 18% 8%, #2E1065 0%, #5B21B6 22%, #7C3AED 42%, #8B5CF6 66%, #A78BFA 88%, #DDD6FE 116%)',
  bandGradient: 'linear-gradient(110deg, #4C1D95 0%, #6D28D9 30%, #8B5CF6 65%, #A78BFA 100%)',
  glowBlob: '#8B5CF6',
  badgeDot: '#C4B5FD',
  accent: '#7C3AED',
  accentRgb: '124,58,237',
  accentSoft: '#F5F3FF',
  accentSoftStrong: '#EDE9FE',
  accentBorder: '#DDD6FE',
  accentStrong: '#4C1D95',
  accentDeep: '#5B21B6',
  accentLight: '#A78BFA',
  ctaGradient: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
  ctaShadow: 'rgba(124, 58, 237, 0.42)',
  statGradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
  badgeGradient: 'linear-gradient(110deg, #7C3AED, #A78BFA)',
  tierButtonGradient: 'linear-gradient(110deg, #A78BFA, #8B5CF6)',
  bandEyebrow: '#DDD6FE',
  crossLink: { background: '#F5F3FF', border: '#DDD6FE', color: '#5B21B6' },
  footerCrossLink: '#C4B5FD',
};

export const NOISE_OVERLAY = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n2'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n2)'/></svg>")`;

export const HIGHLIGHT_STYLE = { fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600 };
