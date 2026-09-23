export const INTEGRATIONS = [
    {
      name: 'Documento Word',
      dotColor: '#2563EB',
      icon: (color) => (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          {/* Back document */}
          <rect x="8" y="3" width="13" height="18" rx="1.5" />
          <line x1="12" y1="8" x2="17" y2="8" />
          <line x1="12" y1="12" x2="17" y2="12" />
          <line x1="12" y1="16" x2="16" y2="16" />
          {/* Front square with W */}
          <rect x="3" y="7" width="10" height="10" rx="1.5" fill={color} />
          <path d="M5.5 10l1.25 4 1.25-3 1.25 3 1.25-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      name: 'Google Forms',
      dotColor: '#9333EA',
      icon: (color) => (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          {/* Google Forms sheet with lines and round bullet points */}
          <rect x="4" y="2" width="16" height="20" rx="3" fill="none" />
          <line x1="9" y1="7" x2="17" y2="7" strokeWidth="2" strokeLinecap="round" />
          <line x1="9" y1="12" x2="17" y2="12" strokeWidth="2" strokeLinecap="round" />
          <line x1="9" y1="17" x2="17" y2="17" strokeWidth="2" strokeLinecap="round" />
          <circle cx="6.5" cy="7" r="1" fill={color} stroke="none" />
          <circle cx="6.5" cy="12" r="1" fill={color} stroke="none" />
          <circle cx="6.5" cy="17" r="1" fill={color} stroke="none" />
        </svg>
      )
    },
    {
      name: 'Markdown',
      dotColor: '#475569',
      icon: (color) => (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M5 8v8l3-3.5L11 16V8" />
          <path d="M17 8v5M15 11.5l2 2 2-2" />
        </svg>
      )
    },
    {
      name: 'Presentación PPTX',
      dotColor: '#D97706',
      icon: (color) => (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          {/* Back slide with a small pie chart */}
          <rect x="8" y="3" width="13" height="18" rx="1.5" />
          <path d="M12 9a2.5 2.5 0 1 1 5 0H12v2.5" fill={color} opacity="0.3" />
          {/* Front square with P */}
          <rect x="3" y="7" width="10" height="10" rx="1.5" fill={color} />
          <path d="M6.5 10h1.8c.66 0 1.2.54 1.2 1.2s-.54 1.2-1.2 1.2H6.5v2.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      name: 'Documento PDF',
      dotColor: '#DC2626',
      icon: (color) => (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <rect x="7" y="12" width="10" height="6" rx="1" fill={color} />
          <text x="8.5" y="16.5" fill="currentColor" fontSize="4.5" fontFamily="system-ui" fontWeight="bold">PDF</text>
        </svg>
      )
    }
  ];

export const INTEGRATIONS_LOOP = [...INTEGRATIONS, ...INTEGRATIONS, ...INTEGRATIONS, ...INTEGRATIONS];

export const FAQ_DATA = [
    { q: '¿Puedo revisar la teoría generada?', a: 'Sí. La teoría incluye referencias para que puedas verificarla y editarla antes de usarla en clase.' },
    { q: '¿Puedo editar todo lo que Katedra produce?', a: 'Sí. Los módulos, la teoría, las evaluaciones y las diapositivas son totalmente editables dentro de un editor de documentos limpio. Modifica oraciones, cambia preguntas o reestructura bloques antes de exportar.' },
    { q: '¿A qué formatos puedo exportar mis cursos?', a: 'Según el tipo de material, Katedra exporta a Word (DOCX), PDF, Markdown y presentaciones PPTX.' },
    { q: '¿El motor funciona para cualquier materia?', a: 'Katedra maneja ciencias naturales, humanidades, matemáticas, ingeniería y más. Si puedes definir el tema, la inteligencia artificial puede estructurar el temario.' },
    { q: '¿Hay algún plan gratuito?', a: 'Sí, el plan Básico es gratuito para siempre e incluye la creación de cursos completos con un límite mensual. Puedes mejorar a Pro en cualquier momento.' }
  ];

export const STATS_DATA = [
    { target: 40, prefix: '', suffix: '%', label: 'Ahorro de tiempo promedio' },
    { target: 10000, prefix: '+', suffix: '', label: 'Temarios diseñados' },
    { target: 98, prefix: '', suffix: '%', label: 'Índice de satisfacción' }
  ];

export const CAROUSEL_COLOR = '#ffffff';
