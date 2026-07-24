import { Book, Calculator, FlaskConical, Globe2, Music2, Palette, Code, Microchip, Dumbbell, Stethoscope, Briefcase, Landmark, PenTool, Lightbulb, Microscope, Activity, Leaf, MonitorPlay, Zap, Telescope, BrainCircuit, Component, Aperture } from 'lucide-react';

const META_KEY = 'katedra_asignatura_meta';

export const SUBJECT_COLORS = ['#10B981', '#2563EB', '#F59E0B', '#F43F5E', '#06B6D4', '#7C3AED', '#EA580C', '#2B6CB0', '#DC2626', '#0D9488'];

export const SUBJECT_ICONS = {
  book: Book,
  calc: Calculator,
  flask: FlaskConical,
  globe: Globe2,
  music: Music2,
  palette: Palette,
  code: Code,
  chip: Microchip,
  gym: Dumbbell,
  health: Stethoscope,
  business: Briefcase,
  history: Landmark,
  art: PenTool,
  idea: Lightbulb,
  micro: Microscope,
  activity: Activity,
  nature: Leaf,
  media: MonitorPlay,
  zap: Zap,
  space: Telescope,
  brain: BrainCircuit,
  logic: Component,
  photo: Aperture
};

export const ICON_NAMES_ES = {
  book: 'Libro',
  calc: 'Cálculo',
  flask: 'Ciencia',
  globe: 'Geografía',
  music: 'Música',
  palette: 'Arte',
  code: 'Programación',
  chip: 'Tecnología',
  gym: 'Deportes',
  health: 'Salud',
  business: 'Negocios',
  history: 'Historia',
  art: 'Diseño',
  idea: 'Creatividad',
  micro: 'Biología',
  activity: 'Actividad',
  nature: 'Naturaleza',
  media: 'Multimedia',
  zap: 'Energía',
  space: 'Astronomía',
  brain: 'Psicología',
  logic: 'Lógica',
  photo: 'Fotografía'
};


const DEFAULT_META = { color: SUBJECT_COLORS[0], icon: 'book' };

const hashId = (id = '') => {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(META_KEY) || '{}');
  } catch {
    return {};
  }
};

const writeAll = (all) => {
  localStorage.setItem(META_KEY, JSON.stringify(all));
};

export const getAsignaturaMeta = (id) => {
  const all = readAll();
  if (all[id]) return { ...DEFAULT_META, ...all[id] };
  const idx = hashId(id);
  return {
    ...DEFAULT_META,
    color: SUBJECT_COLORS[idx % SUBJECT_COLORS.length],
    icon: Object.keys(SUBJECT_ICONS)[idx % Object.keys(SUBJECT_ICONS).length]
  };
};

export const setAsignaturaMeta = (id, partial) => {
  const all = readAll();
  all[id] = { ...getAsignaturaMeta(id), ...partial };
  writeAll(all);
  return all[id];
};

export const removeAsignaturaMeta = (id) => {
  const all = readAll();
  delete all[id];
  writeAll(all);
};

export const rgbFromHex = (hex) => {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)].join(',');
};

export const darkenHex = (hex) => {
  const h = hex.replace('#', '');
  const d = (v) => Math.max(0, Math.round(parseInt(v, 16) * 0.78)).toString(16).padStart(2, '0');
  return '#' + d(h.slice(0, 2)) + d(h.slice(2, 4)) + d(h.slice(4, 6));
};
