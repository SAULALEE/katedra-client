export default function StudentLandingStyles() {
  return (
    <style>{`
      .student-landing {
        min-height: 100vh;
        overflow: hidden;
        background: var(--student-canvas);
        color: var(--student-ink);
        font-family: 'Inter', system-ui, sans-serif;
      }

      .student-landing *, .student-landing *::before, .student-landing *::after {
        box-sizing: border-box;
      }

      .student-skip-link {
        position: fixed;
        top: 8px;
        left: 16px;
        z-index: 300;
        transform: translateY(-140%);
        padding: 10px 14px;
        border-radius: 9px;
        background: #fff;
        color: var(--student-ink);
        font-weight: 700;
        text-decoration: none;
        transition: transform .2s ease;
      }

      .student-skip-link:focus { transform: translateY(0); }

      .student-landing a:focus-visible,
      .student-landing button:focus-visible {
        outline: 3px solid #FB923C;
        outline-offset: 3px;
      }

      @keyframes floatY {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-14px); }
      }
      @keyframes floatY2 {
        0%, 100% { transform: translateY(0) rotate(-2deg); }
        50% { transform: translateY(-10px) rotate(-2deg); }
      }
      @keyframes pulseGlow {
        0%, 100% { opacity: .5; transform: scale(1); }
        50% { opacity: .85; transform: scale(1.08); }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .student-container {
        width: min(1080px, calc(100% - 48px));
        margin: 0 auto;
      }

      .student-nav {
        position: fixed;
        top: 16px;
        left: 50%;
        z-index: 100;
        width: min(1180px, calc(100% - 32px));
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        padding: 11px 14px 11px 20px;
        border: 1px solid rgba(255,255,255,.16);
        border-radius: 16px;
        background: rgba(15,23,42,.42);
        box-shadow: 0 8px 30px rgba(0,0,0,.2);
        backdrop-filter: blur(18px) saturate(180%);
        transform: translateX(-50%);
        transition: background .3s ease, border-color .3s ease, box-shadow .3s ease;
      }

      .student-nav.is-scrolled {
        border-color: rgba(255,255,255,.65);
        background: rgba(255,255,255,.8);
        box-shadow: 0 8px 30px rgba(15,23,42,.1);
      }

      .student-brand {
        display: flex;
        align-items: center;
        gap: 9px;
        color: #fff;
        font-size: 18px;
        font-weight: 750;
        letter-spacing: -.9px;
        text-decoration: none;
      }

      .student-nav.is-scrolled .student-brand { color: var(--student-ink); }

      .student-brand-mark {
        width: 27px;
        height: 27px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(255,255,255,.28);
        border-radius: 8px;
        background: linear-gradient(135deg, var(--student-orange), var(--student-pink), var(--student-violet));
        color: #fff;
        font-size: 12px;
      }

      .student-nav-links { display: flex; align-items: center; gap: 4px; }
      .student-nav-links a {
        padding: 8px 12px;
        border-radius: 8px;
        color: rgba(255,255,255,.78);
        font-size: 14px;
        font-weight: 650;
        text-decoration: none;
        transition: background .2s ease, color .2s ease;
      }
      .student-nav-links a:hover { background: rgba(255,255,255,.1); color: #fff; }
      .student-nav.is-scrolled .student-nav-links a { color: #475569; }
      .student-nav.is-scrolled .student-nav-links a:hover { background: #F1F5F9; color: var(--student-ink); }

      .student-audience-link {
        flex: 0 0 auto;
        padding: 10px 16px;
        border: 1px solid rgba(255,255,255,.2);
        border-radius: 9px;
        background: rgba(255,255,255,.1);
        color: #fff;
        font-size: 14px;
        font-weight: 700;
        text-decoration: none;
        transition: transform .2s ease, background .2s ease;
      }
      .student-audience-link:hover { transform: translateY(-2px); background: rgba(255,255,255,.17); }
      .student-nav.is-scrolled .student-audience-link { border-color: #DDD6FE; background: #F5F3FF; color: #5B21B6; }

      .student-hero {
        position: relative;
        min-height: 870px;
        padding: 148px 24px 0;
        overflow: hidden;
        background:
          radial-gradient(circle at 86% 16%, rgba(236,72,153,.35), transparent 30%),
          radial-gradient(circle at 8% 78%, rgba(249,115,22,.35), transparent 30%),
          radial-gradient(circle at 50% 50%, rgba(124,58,237,.25), transparent 45%),
          linear-gradient(135deg, #0F172A 0%, #1E1B4B 40%, #2E1065 75%, #0F172A 100%);
      }

      .student-hero::before {
        content: '';
        position: absolute;
        inset: 0;
        opacity: .35;
        mix-blend-mode: overlay;
        pointer-events: none;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n2'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n2)'/></svg>");
      }

      .student-hero-copy {
        position: relative;
        z-index: 2;
        max-width: 900px;
        margin: 0 auto;
        text-align: center;
      }

      .student-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 26px;
        padding: 6px 14px;
        border: 1px solid rgba(255,255,255,.28);
        border-radius: 100px;
        background: rgba(255,255,255,.16);
        color: rgba(255,255,255,.92);
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 1.35px;
        text-transform: uppercase;
        backdrop-filter: blur(8px);
      }

      .student-eyebrow-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #FB923C;
        box-shadow: 0 0 8px #FB923C;
      }

      .student-hero h1 {
        max-width: 880px;
        margin: 0 auto 22px;
        color: #fff;
        font-size: clamp(38px, 6.6vw, 76px);
        font-weight: 600;
        letter-spacing: -2px;
        line-height: 1.02;
        text-wrap: balance;
      }

      .student-hero-copy > p {
        max-width: 620px;
        margin: 0 auto 36px;
        color: rgba(255,255,255,.86);
        font-size: clamp(16px, 2vw, 20px);
        font-weight: 500;
        line-height: 1.55;
        text-wrap: pretty;
      }

      .student-highlight { font-family: 'Manrope', sans-serif; font-style: italic; font-weight: 600; color: #fff; }
      .student-hero-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 13px; }
      .student-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        padding: 15px 25px;
        border: 1px solid transparent;
        border-radius: 11px;
        font-size: 15px;
        font-weight: 750;
        text-decoration: none;
        transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
      }
      .student-button:hover { transform: translateY(-3px); }
      .student-button-primary { background: #fff; color: var(--student-ink); box-shadow: 0 10px 30px rgba(15,23,42,.28); }
      .student-button-secondary { border-color: rgba(255,255,255,.25); background: rgba(255,255,255,.1); color: #fff; }
      .student-button-violet { background: var(--student-violet); color: #fff; box-shadow: 0 12px 28px rgba(109,40,217,.28); }

      .student-preview-wrap { position: relative; z-index: 3; width: min(960px, calc(100% - 24px)); margin: 64px auto -132px; }
      .student-preview-label {
        position: absolute;
        top: -16px;
        right: 24px;
        z-index: 5;
        padding: 8px 13px;
        border: 1px solid rgba(255,255,255,.35);
        border-radius: 999px;
        background: rgba(15,23,42,.76);
        color: #FDBA74;
        font-size: 11px;
        font-weight: 700;
        backdrop-filter: blur(12px);
      }

      .student-preview {
        min-height: 420px;
        display: grid;
        grid-template-columns: 220px 1fr;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.38);
        border-radius: 20px;
        background: #fff;
        box-shadow: 0 40px 90px rgba(15,23,42,.35), 0 8px 24px rgba(15,23,42,.18);
      }

      .student-preview-sidebar { padding: 24px 16px; background: #F8FAFC; border-right: 1px solid var(--student-border); }
      .student-preview-logo { display: flex; align-items: center; gap: 9px; margin-bottom: 30px; font-size: 13px; font-weight: 800; }
      .student-preview-logo span { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 8px; background: linear-gradient(135deg, var(--student-orange), var(--student-pink), var(--student-violet)); color: #fff; }
      .student-preview-caption { margin: 20px 8px 9px; color: #94A3B8; font-size: 9px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
      .student-preview-nav-item { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; padding: 10px 11px; border-radius: 9px; color: #64748B; font-size: 11px; font-weight: 650; }
      .student-preview-nav-item.is-active { background: #FFF7ED; color: #C2410C; }
      .student-preview-main { padding: 28px 30px; background: #fff; }
      .student-preview-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 24px; }
      .student-preview-kicker { margin-bottom: 7px; color: var(--student-orange); font-size: 9px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
      .student-preview-title { margin: 0; color: var(--student-ink); font-size: 23px; letter-spacing: -.7px; }
      .student-preview-avatar { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; background: linear-gradient(135deg, #FFF7ED, #F5F3FF); color: #C2410C; font-size: 11px; font-weight: 800; }
      .student-progress { margin-bottom: 20px; padding: 18px; border: 1px solid var(--student-border); border-radius: 14px; background: #FCFCFD; }
      .student-progress-row { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 10px; color: #475569; font-size: 11px; font-weight: 700; }
      .student-progress-track { height: 7px; overflow: hidden; border-radius: 999px; background: #E2E8F0; }
      .student-progress-value { width: 62%; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--student-orange), var(--student-pink), var(--student-violet)); }
      .student-preview-grid { display: grid; grid-template-columns: 1.3fr .8fr; gap: 16px; }
      .student-preview-card { padding: 17px; border: 1px solid var(--student-border); border-radius: 13px; background: #fff; }
      .student-preview-card h3 { margin: 0 0 12px; font-size: 12px; }
      .student-material { display: flex; align-items: center; gap: 11px; padding: 10px 0; border-top: 1px solid #F1F5F9; }
      .student-material:first-of-type { border-top: 0; }
      .student-material-icon { width: 30px; height: 30px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 8px; background: #FFF7ED; color: var(--student-orange); }
      .student-material-copy strong { display: block; color: #334155; font-size: 10px; }
      .student-material-copy span { color: #94A3B8; font-size: 8px; }
      .student-due-card { background: linear-gradient(145deg, #0F172A, #2E1065); color: #fff; border: 1px solid rgba(255,255,255,0.1); }
      .student-due-card h3 { color: #fff; }
      .student-due-card p { margin: 22px 0 8px; color: #FDBA74; font-size: 9px; text-transform: uppercase; letter-spacing: .8px; }
      .student-due-card strong { display: block; font-size: 15px; line-height: 1.35; }
      .student-due-card span { display: inline-block; margin-top: 18px; padding: 6px 9px; border-radius: 7px; background: rgba(255,255,255,.14); font-size: 9px; font-weight: 700; }

      .student-section { padding: 112px 24px; }
      .student-section-soft { background: var(--student-surface); }
      .student-section-lavender { background: linear-gradient(180deg, #FAFAFF, var(--student-lavender)); }
      .student-section-heading { max-width: 760px; margin: 0 auto 60px; text-align: center; }
      .student-section-label { margin-bottom: 14px; color: var(--student-orange); font-size: 9px; font-weight: 700; letter-spacing: 1.35px; text-transform: uppercase; }
      .student-section-heading h2 { margin: 0; color: var(--student-ink); font-size: clamp(30px, 4.6vw, 52px); font-weight: 600; letter-spacing: -1.6px; line-height: 1.05; text-wrap: balance; }
      .student-section-heading p { max-width: 560px; margin: 16px auto 0; color: var(--student-muted); font-size: 17px; line-height: 1.65; }

      .student-process { padding: 140px 24px 96px; }
      .student-step-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
      .student-step-card { position: relative; min-height: 300px; padding: 28px; overflow: hidden; border: 1px solid var(--student-border); border-radius: 18px; background: #fff; box-shadow: 0 18px 50px rgba(15,23,42,.06); }
      .student-step-number { position: absolute; top: 18px; right: 21px; color: #FFF7ED; font-size: 56px; font-weight: 800; letter-spacing: -4px; }
      .student-step-icon { position: relative; width: 48px; height: 48px; display: grid; place-items: center; margin-bottom: 52px; border-radius: 14px; background: #FFF7ED; color: var(--student-orange); border: 1.5px solid #FDBA74; }
      .student-step-card h3 { position: relative; margin: 0 0 10px; font-size: 21px; letter-spacing: -.5px; }
      .student-step-card p { position: relative; margin: 0; color: var(--student-muted); font-size: 15px; line-height: 1.65; }

      .student-benefit-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
      .student-benefit { display: flex; gap: 18px; min-height: 170px; padding: 25px; border: 1px solid var(--student-border); border-radius: 18px; background: #fff; }
      .student-benefit-icon { width: 46px; height: 46px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 13px; }
      .student-benefit-icon.orange { background: #FFF7ED; color: var(--student-orange); }
      .student-benefit-icon.violet { background: #F5F3FF; color: var(--student-violet); }
      .student-benefit h3 { margin: 2px 0 8px; font-size: 18px; letter-spacing: -.3px; }
      .student-benefit p { margin: 0; color: var(--student-muted); font-size: 15px; line-height: 1.6; }

      .student-ai { background: #fff; }
      .student-ai-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
      .student-ai-card { min-height: 260px; padding: 26px; border: 1px solid var(--student-border); border-radius: 18px; background: #fff; box-shadow: 0 12px 32px rgba(15,23,42,.04); }
      .student-ai-card-top { display: flex; align-items: center; gap: 11px; margin-bottom: 38px; color: var(--student-orange); font-size: 9px; font-weight: 700; letter-spacing: 1.35px; text-transform: uppercase; }
      .student-ai-icon { width: 43px; height: 43px; display: grid; place-items: center; border-radius: 12px; background: #FFF7ED; color: var(--student-orange); }
      .student-ai-card h3 { margin: 0 0 11px; color: var(--student-ink); font-size: 20px; letter-spacing: -.45px; line-height: 1.25; }
      .student-ai-card p { margin: 0; color: var(--student-muted); font-size: 14.5px; line-height: 1.65; }
      .student-ai-guardrail { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 18px; margin-top: 24px; padding: 22px 24px; border: 1px solid #FDBA74; border-radius: 18px; background: #FFF7ED; }
      .student-ai-guardrail-icon { width: 46px; height: 46px; display: grid; place-items: center; border-radius: 13px; background: var(--student-orange); color: #fff; }
      .student-ai-guardrail strong { display: block; margin-bottom: 5px; color: var(--student-ink); font-size: 16px; }
      .student-ai-guardrail p { margin: 0; color: var(--student-muted); font-size: 13.5px; line-height: 1.55; }
      .student-ai-rule { min-width: 220px; display: flex; flex-direction: column; gap: 7px; }
      .student-ai-rule span { display: flex; align-items: center; gap: 7px; padding: 8px 10px; border: 1px solid #FDBA74; border-radius: 8px; background: #fff; color: #C2410C; font-size: 11px; font-weight: 700; }

      .student-forms { background: #fff; }
      .student-forms-intro { display: grid; grid-template-columns: .86fr 1.14fr; align-items: center; gap: 68px; margin-bottom: 82px; }
      .student-forms-copy h2 { margin: 0 0 18px; color: var(--student-ink); font-size: clamp(30px, 4.6vw, 52px); font-weight: 600; letter-spacing: -1.6px; line-height: 1.05; text-wrap: balance; }
      .student-forms-copy > p { margin: 0; color: var(--student-muted); font-size: 16px; line-height: 1.7; }
      .student-forms-features { display: flex; flex-direction: column; gap: 10px; margin-top: 28px; }
      .student-forms-features span { display: flex; align-items: center; gap: 10px; color: #334155; font-size: 13px; font-weight: 700; }
      .student-forms-features svg { color: var(--student-orange); }
      .student-forms-preview { overflow: hidden; border: 1px solid #E2E8F0; border-radius: 20px; background: #fff; box-shadow: 0 18px 46px rgba(15,23,42,.06); }
      .student-forms-bar { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 15px 17px; border-bottom: 1px solid var(--student-border); background: #F8FAFC; }
      .student-forms-bar > div { display: flex; align-items: center; gap: 9px; font-size: 12px; }
      .student-forms-bar > div > span { width: 27px; height: 27px; display: grid; place-items: center; border-radius: 8px; background: linear-gradient(135deg, var(--student-orange), var(--student-pink), var(--student-violet)); color: #fff; font-size: 11px; font-weight: 800; }
      .student-forms-bar small { padding: 4px 8px; border-radius: 999px; background: #FFF7ED; color: #C2410C; font-size: 8px; font-weight: 800; letter-spacing: .6px; text-transform: uppercase; }
      .student-forms-body { display: grid; grid-template-columns: 1fr 185px; min-height: 350px; }
      .student-form-question { padding: 24px; }
      .student-form-meta { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 22px; color: var(--student-orange); font-size: 9px; font-weight: 800; letter-spacing: .5px; text-transform: uppercase; }
      .student-form-question h3 { margin: 0 0 21px; color: var(--student-ink); font-size: 16px; line-height: 1.45; }
      .student-form-option { display: flex; align-items: center; gap: 10px; margin-top: 9px; padding: 11px 12px; border: 1px solid #E2E8F0; border-radius: 8px; color: #475569; font-size: 11px; font-weight: 600; }
      .student-form-option > span { width: 20px; height: 20px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 50%; background: #F1F5F9; color: #64748B; font-size: 9px; font-weight: 800; }
      .student-form-option svg { margin-left: auto; color: var(--student-orange); }
      .student-form-option.is-selected { border-color: #F97316; background: #FFF7ED; color: #7C2D12; }
      .student-form-option.is-selected > span { background: #FFEDD5; color: #C2410C; }
      .student-form-insight { padding: 23px 18px; background: linear-gradient(165deg, #0F172A, #2E1065); color: #fff; }
      .student-form-insight-label { display: flex; align-items: center; gap: 6px; margin-bottom: 34px; color: #FB923C; font-size: 8px; font-weight: 800; letter-spacing: .6px; text-transform: uppercase; }
      .student-form-insight > strong { display: block; color: #FDBA74; font-size: 9px; text-transform: uppercase; letter-spacing: .5px; }
      .student-form-insight h4 { margin: 7px 0 25px; font-size: 18px; line-height: 1.2; }
      .student-form-path { display: flex; align-items: flex-start; gap: 8px; padding: 11px 0; border-top: 1px solid rgba(255,255,255,.13); color: #E2E8F0; font-size: 9.5px; line-height: 1.4; }
      .student-form-path svg { flex: 0 0 auto; color: #FB923C; }

      .student-comparison { overflow: hidden; border: 1px solid var(--student-border); border-radius: 22px; background: #fff; box-shadow: 0 12px 32px rgba(15,23,42,.04); }
      .student-comparison-heading { display: grid; grid-template-columns: 1fr .9fr; align-items: end; gap: 50px; padding: 36px; border-bottom: 1px solid var(--student-border); }
      .student-comparison-heading span { display: block; margin-bottom: 9px; color: var(--student-orange); font-size: 9px; font-weight: 700; letter-spacing: 1.35px; text-transform: uppercase; }
      .student-comparison-heading h3 { margin: 0; color: var(--student-ink); font-size: 27px; letter-spacing: -.8px; line-height: 1.15; }
      .student-comparison-heading p { margin: 0; color: var(--student-muted); font-size: 13.5px; line-height: 1.65; }
      .student-comparison-table { width: 100%; }
      .student-comparison-row { display: grid; grid-template-columns: .7fr 1fr 1.35fr; }
      .student-comparison-row > div { min-width: 0; padding: 19px 20px; border-bottom: 1px solid #EEF1F5; color: #64748B; font-size: 12.5px; line-height: 1.55; }
      .student-comparison-row:last-child > div { border-bottom: 0; }
      .student-comparison-row > div + div { border-left: 1px solid #EEF1F5; }
      .student-comparison-row > div:first-child { color: #334155; }
      .student-comparison-row > div:last-child { display: flex; align-items: flex-start; gap: 8px; background: #F8FAFC; color: #7C2D12; font-weight: 650; }
      .student-comparison-row > div:last-child svg { flex: 0 0 auto; margin-top: 2px; }
      .student-comparison-header > div { padding-top: 13px; padding-bottom: 13px; background: #F8FAFC; color: #475569 !important; font-size: 9px; font-weight: 800; letter-spacing: .7px; text-transform: uppercase; }
      .student-comparison-header > div:last-child { background: #FFF7ED; color: #C2410C !important; }

      .student-connection { position: relative; overflow: hidden; background: linear-gradient(135deg, #0F172A 0%, #4C1D95 45%, #2E1065 100%); }
      .student-connection::after { content: ''; position: absolute; width: 380px; height: 380px; right: -80px; bottom: -160px; border-radius: 50%; background: radial-gradient(circle, #EC4899, transparent 68%); opacity: 0.45; filter: blur(10px); }
      .student-connection-grid { position: relative; z-index: 2; display: grid; grid-template-columns: .9fr 1.1fr; align-items: center; gap: 76px; }
      .student-connection-copy .student-section-label { color: #FB923C; }
      .student-connection-copy h2 { margin: 0 0 18px; color: #fff; font-size: clamp(30px, 4.6vw, 52px); font-weight: 600; letter-spacing: -1.6px; line-height: 1.05; text-wrap: balance; }
      .student-connection-copy p { margin: 0; color: #CBD5E1; font-size: 17px; line-height: 1.7; }
      .student-connection-flow { padding: 18px; border: 1px solid rgba(255,255,255,.15); border-radius: 20px; background: rgba(255,255,255,.09); backdrop-filter: blur(18px); }
      .student-connection-item { display: flex; align-items: center; gap: 14px; padding: 16px; border-radius: 13px; background: rgba(255,255,255,.95); }
      .student-connection-item + .student-connection-item { margin-top: 10px; }
      .student-connection-item-icon { width: 40px; height: 40px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 11px; background: #FFF7ED; color: var(--student-orange); }
      .student-connection-item strong { display: block; margin-bottom: 3px; color: var(--student-ink); font-size: 13px; }
      .student-connection-item span { color: var(--student-muted); font-size: 11px; }
      .student-connection-arrow { display: grid; place-items: center; height: 25px; color: #FB923C; }

      .student-faq-list { max-width: 760px; margin: 0 auto; }
      .student-faq-item { border-bottom: 1px solid #E2E8F0; }
      .student-faq-question { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 24px 0; border: 0; background: transparent; color: #1E293B; font: inherit; font-size: 17px; font-weight: 650; text-align: left; cursor: pointer; }
      .student-faq-question[aria-expanded='true'] { color: var(--student-orange); }
      .student-faq-plus { width: 34px; height: 34px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 50%; background: #F1F5F9; color: #64748B; transition: transform .3s ease, background .2s ease; }
      .student-faq-question[aria-expanded='true'] .student-faq-plus { transform: rotate(45deg); background: #FFF7ED; color: var(--student-orange); }
      .student-faq-answer { overflow: hidden; color: #475569; font-size: 15px; line-height: 1.7; }
      .student-faq-answer p { margin: 0; padding: 0 54px 24px 0; }

      .student-final { padding: 20px 24px 96px; background: #fff; }
      .student-final-card { position: relative; max-width: 1080px; margin: 0 auto; padding: 64px 32px; overflow: hidden; border-radius: 26px; background: linear-gradient(110deg, #F97316 0%, #EC4899 50%, #7C3AED 100%); text-align: center; }
      .student-final-card::before { content: ''; position: absolute; inset: 0; pointer-events: none; mix-blend-mode: overlay; opacity: .45; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n2'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n2)'/></svg>"); }
      .student-final-content { position: relative; z-index: 2; }
      .student-final h2 { max-width: 620px; margin: 0 auto 16px; color: #fff; font-size: clamp(30px, 5vw, 52px); font-weight: 600; letter-spacing: -1.8px; line-height: 1.04; }
      .student-final p { max-width: 480px; margin: 0 auto 30px; color: rgba(255,255,255,.86); font-size: 18px; line-height: 1.6; }

      .student-footer { padding: 64px 24px 36px; background: #0F172A; color: #fff; }
      .student-footer-main { display: flex; justify-content: space-between; gap: 60px; padding-bottom: 48px; border-bottom: 1px solid rgba(255,255,255,.1); }
      .student-footer-brand { max-width: 390px; }
      .student-footer-brand strong { display: block; margin-bottom: 14px; font-size: 18px; letter-spacing: -.9px; }
      .student-footer-brand p { margin: 0; color: #94A3B8; font-size: 14px; line-height: 1.6; }
      .student-footer-links { display: flex; flex-wrap: wrap; gap: 12px 24px; align-content: flex-start; }
      .student-footer a { color: #CBD5E1; font-size: 14px; font-weight: 500; text-decoration: none; }
      .student-footer a:hover { color: #fff; }
      .student-footer-bottom { display: flex; justify-content: space-between; gap: 20px; padding-top: 26px; color: #64748B; font-size: 13px; }

      @media (max-width: 820px) {
        .student-nav-links { display: none; }
        .floating-doodles { display: none !important; }
        .kt-mock-sidebar { display: none !important; }
        .kt-mock-panel { height: auto !important; min-height: 440px; }
        .student-step-grid { grid-template-columns: 1fr; }
        .student-step-card { min-height: 240px; }
        .student-step-icon { margin-bottom: 34px; }
        .student-ai-grid { grid-template-columns: 1fr; }
        .student-ai-card { min-height: auto; }
        .student-ai-guardrail { grid-template-columns: auto 1fr; }
        .student-ai-rule { grid-column: 1 / -1; min-width: 0; display: grid; grid-template-columns: repeat(2, 1fr); }
        .student-forms-intro { grid-template-columns: 1fr; gap: 48px; }
        .student-comparison-heading { grid-template-columns: 1fr; gap: 20px; }
        .student-comparison-row { grid-template-columns: .75fr 1fr 1.25fr; }
        .student-connection-grid { grid-template-columns: 1fr; gap: 44px; }
      }

      @media (max-width: 640px) {
        .student-container { width: min(100% - 32px, 1080px); }
        .student-nav { top: 10px; width: calc(100% - 20px); padding: 9px 10px 9px 13px; }
        .student-brand-mark { display: none; }
        .student-audience-link { padding: 9px 11px; font-size: 12px; }
        .student-hero { min-height: 800px; padding: 124px 16px 0; }
        .student-hero h1 { font-size: clamp(38px, 11vw, 54px); letter-spacing: -1.8px; }
        .student-eyebrow { font-size: 8px; }
        .kt-mock-stats { grid-template-columns: 1fr !important; }
        .student-process { padding: 96px 16px 64px; }
        .student-section { padding: 88px 16px; }
        .student-section-heading { margin-bottom: 42px; }
        .student-benefit-grid { grid-template-columns: 1fr; }
        .student-ai-guardrail { grid-template-columns: 1fr; }
        .student-ai-guardrail-icon { display: none; }
        .student-ai-rule { grid-column: auto; grid-template-columns: 1fr; }
        .student-forms-intro { margin-bottom: 56px; }
        .student-forms-body { grid-template-columns: 1fr; }
        .student-form-insight { display: none; }
        .student-comparison { overflow: visible; border: 0; background: transparent; box-shadow: none; }
        .student-comparison-heading { padding: 0 0 28px; border-bottom: 0; }
        .student-comparison-table { display: flex; flex-direction: column; gap: 14px; }
        .student-comparison-header { display: none; }
        .student-comparison-row { display: block; overflow: hidden; border: 1px solid var(--student-border); border-radius: 14px; background: #fff; }
        .student-comparison-row > div { padding: 14px 16px; border-bottom: 1px solid #EEF1F5; }
        .student-comparison-row > div + div { border-left: 0; }
        .student-comparison-row > div:first-child { background: #F8FAFC; }
        .student-final { padding: 12px 12px 76px; }
        .student-final-card { padding: 58px 20px; }
        .student-footer-main, .student-footer-bottom { flex-direction: column; }
      }

      @media (prefers-reduced-motion: reduce) {
        .student-landing *, .student-landing *::before, .student-landing *::after {
          scroll-behavior: auto !important;
          animation-duration: .01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: .01ms !important;
        }
      }
    `}</style>
  );
}
