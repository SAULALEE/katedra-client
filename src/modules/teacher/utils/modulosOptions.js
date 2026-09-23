export const MODULOS_OPTIONS = {
  TUTOR: [
    { value: '4', label: '4 módulos (Compacto)' },
    { value: '6', label: '6 módulos (Estructura Estándar)' }
  ],
  CATEDRATICO: [
    { value: '8', label: '8 módulos (Detallado)' },
    { value: '10', label: '10 módulos (Exhaustivo)' }
  ]
};

export const getModulosOptions = (modelo) => MODULOS_OPTIONS[modelo] || MODULOS_OPTIONS.TUTOR;

export const isModulosValueValidForModelo = (modelo, value) => (
  getModulosOptions(modelo).some(opt => opt.value === value)
);
