import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading, error, clearError } = useAuth();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => { clearError(); }, [clearError]);
  useEffect(() => { if (isAuthenticated) navigate('/dashboard'); }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (!nombre || !email || !password || !confirmPassword) {
      setValidationError('Por favor, completa todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setValidationError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (!acceptTerms) {
      setValidationError('Debe aceptar los términos y condiciones.');
      return;
    }

    const success = await register(email, password, nombre);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <style>{`
        @keyframes blobFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(28px, -34px) scale(1.12); }
        }
        @keyframes blobFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 26px) scale(1.08); }
        }
        @keyframes grainShift {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-4%, 3%); }
          50% { transform: translate(3%, -2%); }
          75% { transform: translate(-2%, -3%); }
          100% { transform: translate(0, 0); }
        }
        @keyframes cardRise {
          0% { opacity: 0; transform: translateY(26px) scale(.985); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-1.8deg) translateY(0); }
          50% { transform: rotate(1.8deg) translateY(-5px); }
        }
        @keyframes blink {
          0%, 92%, 100% { transform: scaleY(1); }
          96% { transform: scaleY(.08); }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(9deg); }
        }
        @keyframes waveFast {
          0%, 100% { transform: rotate(-8deg); }
          25% { transform: rotate(16deg); }
          50% { transform: rotate(-4deg); }
          75% { transform: rotate(16deg); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-9px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .kt-char {
          animation: sway 5.5s ease-in-out infinite;
          transform-origin: 50% 90%;
          transform-box: view-box;
        }
        .kt-eyes {
          animation: blink 5s ease-in-out infinite;
          transform-origin: 130px 92px;
          transform-box: view-box;
        }
        .kt-arm {
          animation: wave 3.4s ease-in-out infinite;
          transform-origin: 162px 176px;
          transform-box: view-box;
          transition: animation 0.3s;
        }
        .kt-wave-fast {
          animation: waveFast 1s ease-in-out infinite !important;
        }
        .kt-float {
          animation: floatY 6s ease-in-out infinite;
        }
        .kt-input {
          width: 100%;
          height: 46px;
          padding: 0 14px;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          background: #F8FAFC;
          font-family: 'Manrope', sans-serif;
          font-weight: 500;
          font-size: 14.5px;
          color: #0F172A;
          transition: border-color .2s, box-shadow .2s, background .2s;
          outline: none;
        }
        .kt-input:focus {
          border-color: #10B981;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, .15);
        }
        .kt-oauth-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          height: 46px;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          background: #fff;
          cursor: pointer;
          font-family: 'Manrope', sans-serif;
          font-weight: 700;
          font-size: 13.5px;
          color: #0F172A;
          transition: box-shadow .25s, transform .25s, border-color .25s;
        }
        .kt-oauth-btn:hover {
          box-shadow: 0 10px 22px -12px rgba(15, 23, 42, .4);
          transform: translateY(-2px);
          border-color: #CBD5E1;
        }
        .kt-submit-btn {
          width: 100%;
          height: 50px;
          border: none;
          border-radius: 11px;
          background: linear-gradient(150deg, #10B981, #059669);
          color: #fff;
          cursor: pointer;
          font-family: 'Manrope', sans-serif;
          font-weight: 800;
          font-size: 15px;
          letter-spacing: .2px;
          box-shadow: 0 12px 26px -10px rgba(16, 185, 129, .75);
          transition: transform .18s, box-shadow .25s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
        }
        .kt-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 18px 32px -10px rgba(16, 185, 129, .8);
        }
        .kt-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .kt-submit-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }
        @media(max-width:860px){
          .kt-card{grid-template-columns:1fr !important;max-width:440px !important}
          .kt-left{display:none !important}
          .kt-mobchar{display:flex !important}
          .kt-right{padding:36px 30px !important}
        }
        @media(max-width:520px){
          .kt-page{padding:18px !important}
          .kt-right{padding:30px 22px !important}
        }
        @media(max-width:768px){
          .kt-nav-links{display:none !important}
          .kt-nav{padding:14px 20px !important}
        }
      `}</style>

      <div data-root className="kt-page" style={{ position: 'fixed', inset: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', fontFamily: "'Manrope', sans-serif", background: 'radial-gradient(130% 135% at 12% 6%, #1E3A8A 0%, #2563EB 22%, #06B6D4 42%, #10B981 66%, #34D399 86%, #FCD34D 112%)', zIndex: 9999 }}>
        <nav className="kt-nav" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 40px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px) saturate(120%)',
          WebkitBackdropFilter: 'blur(16px) saturate(120%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
          transition: 'all 0.3s ease'
        }}>
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <span style={{ display: 'grid', placeItems: 'center', width: '32px', height: '32px', borderRadius: '9px', overflow: 'hidden' }}>
              <img src="/katedra.svg" alt="Katedra Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '18px', letterSpacing: '-0.9px', color: '#fff' }}>Katedra</span>
          </a>
          
          <div className="kt-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {['Características', 'Integraciones', 'Planes', 'FAQs'].map((label, i) => {
              const targets = ['/#features', '/#integrations', '/#pricing', '/#faqs'];
              return (
                <a 
                  key={i} 
                  href={targets[i]} 
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    padding: '8px 13px',
                    borderRadius: '8px',
                    transition: 'background 0.2s, color 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'; }}
                >
                  {label}
                </a>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a 
              href="/login" 
              onClick={(e) => { e.preventDefault(); navigate('/login'); }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '14px',
                color: '#fff',
                textDecoration: 'none',
                padding: '9px 15px',
                borderRadius: '9px',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                background: 'rgba(255, 255, 255, 0.08)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; }}
            >
              Acceder
            </a>
          </div>
        </nav>

        {/* decorative layer */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          {/* glow blobs */}
          <div style={{ position: 'absolute', top: '-140px', left: '-120px', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, rgba(52,211,153,.55), rgba(52,211,153,0) 68%)', filter: 'blur(30px)', animation: 'blobFloat 14s ease-in-out infinite', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', bottom: '-180px', right: '-120px', width: '560px', height: '560px', borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, rgba(252,211,77,.5), rgba(252,211,77,0) 66%)', filter: 'blur(34px)', animation: 'blobFloat2 17s ease-in-out infinite', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', top: '36%', right: '16%', width: '340px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,.4), rgba(6,182,212,0) 70%)', filter: 'blur(30px)', animation: 'blobFloat 20s ease-in-out infinite', pointerEvents: 'none' }}></div>

          {/* grain overlay */}
          <svg style={{ position: 'absolute', inset: '-6%', width: '112%', height: '112%', pointerEvents: 'none', opacity: .16, mixBlendMode: 'overlay', animation: 'grainShift 8s steps(6) infinite' }} xmlns="http://www.w3.org/2000/svg">
            <filter id="ktGrain">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"></feTurbulence>
              <feColorMatrix type="saturate" values="0"></feColorMatrix>
            </filter>
            <rect width="100%" height="100%" filter="url(#ktGrain)"></rect>
          </svg>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'safe center', justifyContent: 'center', padding: '80px 28px 40px', position: 'relative', zIndex: 2 }}>
          {/* register card */}
          <div className="kt-card kt-stage" style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1.02fr 1fr', width: '100%', maxWidth: '940px', background: 'rgba(255,255,255,.72)', backdropFilter: 'blur(22px) saturate(1.3)', WebkitBackdropFilter: 'blur(22px) saturate(1.3)', border: '1px solid rgba(255,255,255,.6)', borderRadius: '26px', overflow: 'hidden', boxShadow: '0 40px 90px -30px rgba(15,23,42,.55), 0 8px 24px -12px rgba(15,23,42,.3)', animation: 'cardRise 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
            
            {/* LEFT: illustration pane */}
            <div className="kt-left" style={{ position: 'relative', padding: '44px 40px', background: 'linear-gradient(165deg,#ECFDF5 0%,#F0FDFA 46%,#FEFCE8 100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 20% 0%, rgba(16,185,129,.10), transparent 60%)', pointerEvents: 'none' }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '1.35px', textTransform: 'uppercase', color: '#059669', marginBottom: '12px' }}>Comienza tu viaje, educador</div>
                <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '29px', lineHeight: '1.12', letterSpacing: '-1.4px', color: '#0F172A', margin: '0 0 8px' }}>Potencia tu<br />enseñanza.</h2>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: '14px', lineHeight: '1.55', color: '#475569', margin: 0, maxWidth: '280px' }}>
                  Diseña temarios, teoría y ejercicios de clase con inteligencia artificial en <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#0F172A' }}>segundos</span>.
                </p>
              </div>

              {/* character */}
              <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', minHeight: '250px', marginTop: '10px' }}>
                {/* floating doodle bits */}
                <svg className="kt-float" style={{ position: 'absolute', top: '8%', left: '6%', width: '44px', height: '44px', animationDuration: '5s' }} viewBox="0 0 44 44" fill="none"><rect x="7" y="10" width="30" height="26" rx="3" stroke="#0F172A" strokeWidth="2.4"></rect><path d="M13 18h18M13 24h18M13 30h11" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round"></path></svg>
                <svg className="kt-float" style={{ position: 'absolute', top: '2%', right: '8%', width: '40px', height: '40px', animationDuration: '6.5s' }} viewBox="0 0 40 40" fill="none"><path d="M20 6a10 10 0 0 0-6 18c1 .8 1.5 1.6 1.6 2.8h8.8c.1-1.2.6-2 1.6-2.8A10 10 0 0 0 20 6Z" stroke="#0F172A" strokeWidth="2.4"></path><path d="M16.5 32h7M17.5 36h5" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round"></path></svg>
                <svg className="kt-float" style={{ position: 'absolute', bottom: '20%', right: '2%', width: '38px', height: '38px', animationDuration: '7s' }} viewBox="0 0 38 38" fill="none"><path d="M6 12c5-3 9-3 13 0 4-3 8-3 13 0v18c-5-3-9-3-13 0-4-3-8-3-13 0V12Z" stroke="#0F172A" strokeWidth="2.4" strokeLinejoin="round"></path><path d="M19 12v18" stroke="#0F172A" stroke-width="2.4"></path></svg>

                {/* teacher */}
                <svg className="kt-char" width="230" height="300" viewBox="0 0 260 360" fill="none" style={{ overflow: 'visible' }}>
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
                  <g className={`kt-arm ${isFocused ? 'kt-wave-fast' : ''}`}>
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
                  <path className="kt-mouth" d={isFocused ? "M112,116 Q130,134 148,116" : "M116,118 Q130,128 144,118"} stroke="#0F172A" strokeWidth="3.6" strokeLinecap="round" fill="none"></path>
                </svg>
              </div>
            </div>

            {/* RIGHT: form pane */}
            <div className="kt-right" style={{ position: 'relative', padding: '40px 46px', background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              
              {/* mobile mini character */}
              <div className="kt-mobchar" style={{ display: 'none', justifyContent: 'center', marginBottom: '6px' }}>
                <svg width="96" height="96" viewBox="70 40 120 120" fill="none" style={{ overflow: 'visible' }}>
                  <circle cx="130" cy="96" r="48" fill="#ECFDF5" stroke="#0F172A" strokeWidth="4.4"></circle>
                  <path d="M92,66 Q104,44 130,46 Q158,48 168,68" stroke="#0F172A" strokeWidth="4.4" strokeLinecap="round" fill="none"></path>
                  <circle cx="104" cy="108" r="9" fill="#10B981" opacity=".2"></circle><circle cx="156" cy="108" r="9" fill="#10B981" opacity=".2"></circle>
                  <circle cx="112" cy="92" r="16" fill="none" stroke="#0F172A" strokeWidth="3.6"></circle><circle cx="148" cy="92" r="16" fill="none" stroke="#0F172A" strokeWidth="3.6"></circle><path d="M128,92 h4" stroke="#0F172A" strokeWidth="3.6"></path>
                  <g className="kt-eyes"><circle cx="112" cy="92" r="4.6" fill="#0F172A"></circle><circle cx="148" cy="92" r="4.6" fill="#0F172A"></circle></g>
                  <path d="M116,118 Q130,128 144,118" stroke="#0F172A" strokeWidth="3.6" strokeLinecap="round" fill="none"></path>
                </svg>
              </div>

              {/* brand */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: 'linear-gradient(150deg,#10B981,#059669)', display: 'grid', placeItems: 'center', boxShadow: '0 4px 12px -3px rgba(16,185,129,.6)' }}><span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '17px', color: '#fff', letterSpacing: '-1px' }}>K</span></div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '18px', letterSpacing: '-.8px', color: '#0F172A' }}>Katedra</span>
              </div>

              <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '27px', lineHeight: 1.1, letterSpacing: '-1px', color: '#0F172A', margin: '0 0 7px' }}>Crea tu cuenta</h1>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: '14px', color: '#64748B', margin: '0 0 20px' }}>Comienza gratis — no requiere tarjeta de crédito.</p>

              {/* OAuth */}
              <div style={{ display: 'flex', gap: '11px', marginBottom: '18px' }}>
                <button type="button" className="kt-oauth-btn">
                  <svg width="17" height="17" viewBox="0 0 18 18" style={{ marginRight: '2px' }}><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"></path><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"></path><path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"></path><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"></path></svg>
                  Google
                </button>
                <button type="button" className="kt-oauth-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0F172A" style={{ marginRight: '2px' }}><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.83-1.01 2.93.12.01.24.01.37.01.91 0 2.01-.52 2.47-1.33z"></path></svg>
                  Apple
                </button>
              </div>

              {/* divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                <div style={{ flex: 1, height: '1px', background: '#EDF0F4' }}></div>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: '11px', letterSpacing: '.4px', color: '#94A3B8', textTransform: 'uppercase' }}>o con correo electrónico</span>
                <div style={{ flex: 1, height: '1px', background: '#EDF0F4' }}></div>
              </div>

              {/* form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '12.5px', letterSpacing: '-.2px', color: '#334155', marginBottom: '4px' }}>Nombre completo</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Prof. Alejandro Ruiz"
                    className="kt-input"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '12.5px', letterSpacing: '-.2px', color: '#334155', marginBottom: '4px' }}>Correo electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="tucorreo@escuela.edu"
                    className="kt-input"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '12.5px', letterSpacing: '-.2px', color: '#334155', marginBottom: '4px' }}>Contraseña</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Mínimo 6 caracteres"
                      className="kt-input"
                      style={{ paddingRight: '44px' }}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Mostrar contraseña"
                      style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', width: '34px', height: '34px', display: 'grid', placeItems: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8', borderRadius: '8px' }}
                    >
                      {showPassword ? (
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                      ) : (
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '12.5px', letterSpacing: '-.2px', color: '#334155', marginBottom: '4px' }}>Confirmar Contraseña</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Repite tu contraseña"
                    className="kt-input"
                    disabled={loading}
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', margin: '4px 0 8px', cursor: 'pointer', fontFamily: "'Manrope', sans-serif", fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#10B981', cursor: 'pointer', flexShrink: 0, marginTop: '2px' }}
                  />
                  <span>
                    Acepto los <span style={{ color: '#059669', fontWeight: 600 }}>Términos del Servicio</span> y la <span style={{ color: '#059669', fontWeight: 600 }}>Política de Privacidad</span> de Katedra.
                  </span>
                </label>

                {/* Error messages */}
                {(validationError || error) && (
                  <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', color: '#EF4444', fontFamily: "'Manrope', sans-serif", fontSize: '13px', fontWeight: 600, lineHeight: '1.4' }}>
                    {validationError || error}
                  </div>
                )}

                <button
                  type="submit"
                  className="kt-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span style={{ width: '16px', height: '16px', border: '2.5px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }}></span>
                      <span>Creando cuenta…</span>
                    </>
                  ) : (
                    <span>Crear Cuenta</span>
                  )}
                </button>
              </form>

              <p style={{ textAlign: 'center', fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: '13.5px', color: '#64748B', margin: '18px 0 0' }}>
                ¿Ya tienes una cuenta?{' '}
                <span onClick={() => navigate('/login')} style={{ color: '#059669', fontWeight: 700, cursor: 'pointer', textDecoration: 'none' }}>
                  Inicia sesión
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
