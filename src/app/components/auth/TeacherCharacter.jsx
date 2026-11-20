// Animated teacher illustration used on every teacher auth screen.
// `excited` speeds up the wave and widens the smile (e.g. while a field is focused).
export default function TeacherCharacter({ excited = false }) {
  return (
    <>
      {/* floating doodle bits */}
      <svg className="kt-float" style={{ position: 'absolute', top: '8%', left: '6%', width: '44px', height: '44px', animationDuration: '5s' }} viewBox="0 0 44 44" fill="none"><rect x="7" y="10" width="30" height="26" rx="3" stroke="#0F172A" strokeWidth="2.4"></rect><path d="M13 18h18M13 24h18M13 30h11" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round"></path></svg>
      <svg className="kt-float" style={{ position: 'absolute', top: '2%', right: '8%', width: '40px', height: '40px', animationDuration: '6.5s' }} viewBox="0 0 40 40" fill="none"><path d="M20 6a10 10 0 0 0-6 18c1 .8 1.5 1.6 1.6 2.8h8.8c.1-1.2.6-2 1.6-2.8A10 10 0 0 0 20 6Z" stroke="#0F172A" strokeWidth="2.4"></path><path d="M16.5 32h7M17.5 36h5" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round"></path></svg>
      <svg className="kt-float" style={{ position: 'absolute', bottom: '20%', right: '2%', width: '38px', height: '38px', animationDuration: '7s' }} viewBox="0 0 38 38" fill="none"><path d="M6 12c5-3 9-3 13 0 4-3 8-3 13 0v18c-5-3-9-3-13 0-4-3-8-3-13 0V12Z" stroke="#0F172A" strokeWidth="2.4" strokeLinejoin="round"></path><path d="M19 12v18" stroke="#0F172A" strokeWidth="2.4"></path></svg>

      <svg className="kt-char" width="230" height="300" viewBox="0 0 260 360" fill="none" style={{ overflow: 'visible' }} aria-hidden="true">
        {/* legs */}
        <path d="M112,262 L108,330 M148,262 L152,330" stroke="#0F172A" strokeWidth="4.4" strokeLinecap="round"></path>
        <path d="M98,332 h22 M142,332 h22" stroke="#0F172A" strokeWidth="4.4" strokeLinecap="round"></path>
        {/* torso / sweater */}
        <path d="M92,258 L96,182 Q99,160 122,158 L138,158 Q161,160 164,182 L168,258 Q130,270 92,258 Z" fill="#fff" stroke="#0F172A" strokeWidth="4.4" strokeLinejoin="round"></path>
        <path d="M118,159 Q130,172 142,159" stroke="#0F172A" strokeWidth="3.4" strokeLinecap="round"></path>
        {/* right arm holding pencil */}
        <path d="M96,184 Q74,206 72,240" stroke="#0F172A" strokeWidth="4.4" strokeLinecap="round" fill="none"></path>
        <circle cx="72" cy="244" r="8" fill="#fff" stroke="#0F172A" strokeWidth="4"></circle>
        <path d="M60,262 L84,226" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"></path>
        <path d="M84,226 l5,-7" stroke="#0F172A" strokeWidth="6" strokeLinecap="round"></path>
        {/* waving arm */}
        <g className={`kt-arm ${excited ? 'kt-wave-fast' : ''}`}>
          <path d="M162,182 Q190,158 198,120" stroke="#0F172A" strokeWidth="4.4" strokeLinecap="round" fill="none"></path>
          <circle cx="200" cy="112" r="9" fill="#fff" stroke="#0F172A" strokeWidth="4"></circle>
          <path d="M196,104 v-9 M203,104 v-11 M209,107 v-8" stroke="#0F172A" strokeWidth="3.4" strokeLinecap="round"></path>
        </g>
        {/* head */}
        <circle cx="130" cy="96" r="48" fill="#fff" stroke="#0F172A" strokeWidth="4.4"></circle>
        {/* ears */}
        <circle cx="82" cy="98" r="7" fill="#fff" stroke="#0F172A" strokeWidth="4"></circle>
        <circle cx="178" cy="98" r="7" fill="#fff" stroke="#0F172A" strokeWidth="4"></circle>
        {/* hair */}
        <path d="M92,66 Q104,44 130,46 Q158,48 168,68" stroke="#0F172A" strokeWidth="4.4" strokeLinecap="round" fill="none"></path>
        <path d="M100,58 q6,-8 14,-8 M128,50 q10,-2 18,4" stroke="#0F172A" strokeWidth="3.4" strokeLinecap="round"></path>
        {/* cheeks */}
        <circle cx="104" cy="108" r="9" fill="#10B981" opacity=".18"></circle>
        <circle cx="156" cy="108" r="9" fill="#10B981" opacity=".18"></circle>
        {/* glasses */}
        <circle cx="112" cy="92" r="16" fill="none" stroke="#0F172A" strokeWidth="3.6"></circle>
        <circle cx="148" cy="92" r="16" fill="none" stroke="#0F172A" strokeWidth="3.6"></circle>
        <path d="M128,92 h4 M96,90 l-12,-3 M164,90 l12,-3" stroke="#0F172A" strokeWidth="3.6" strokeLinecap="round"></path>
        {/* eyes (blink) */}
        <g className="kt-eyes"><circle cx="112" cy="92" r="4.6" fill="#0F172A"></circle><circle cx="148" cy="92" r="4.6" fill="#0F172A"></circle></g>
        {/* mouth */}
        <path className="kt-mouth" d={excited ? 'M112,116 Q130,134 148,116' : 'M116,118 Q130,128 144,118'} stroke="#0F172A" strokeWidth="3.6" strokeLinecap="round" fill="none"></path>
      </svg>
    </>
  );
}

export function TeacherMiniCharacter() {
  return (
    <svg width="96" height="96" viewBox="70 40 120 120" fill="none" style={{ overflow: 'visible' }} aria-hidden="true">
      <circle cx="130" cy="96" r="48" fill="#ECFDF5" stroke="#0F172A" strokeWidth="4.4"></circle>
      <path d="M92,66 Q104,44 130,46 Q158,48 168,68" stroke="#0F172A" strokeWidth="4.4" strokeLinecap="round" fill="none"></path>
      <circle cx="104" cy="108" r="9" fill="#10B981" opacity=".2"></circle><circle cx="156" cy="108" r="9" fill="#10B981" opacity=".2"></circle>
      <circle cx="112" cy="92" r="16" fill="none" stroke="#0F172A" strokeWidth="3.6"></circle><circle cx="148" cy="92" r="16" fill="none" stroke="#0F172A" strokeWidth="3.6"></circle><path d="M128,92 h4" stroke="#0F172A" strokeWidth="3.6"></path>
      <g className="kt-eyes"><circle cx="112" cy="92" r="4.6" fill="#0F172A"></circle><circle cx="148" cy="92" r="4.6" fill="#0F172A"></circle></g>
      <path d="M116,118 Q130,128 144,118" stroke="#0F172A" strokeWidth="3.6" strokeLinecap="round" fill="none"></path>
    </svg>
  );
}
