import { useState } from 'react';
import { generarMaterialAI } from '../services/temarioService';

export const useGenerator = () => {
  const [tema, setTema] = useState('Estructuras de Datos Lineales');
  const [materia, setMateria] = useState('Programación I');
  const [unidades, setUnidades] = useState('Unidad 1: Pilas y Listas Enlazadas');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedData, setGeneratedData] = useState(null);
  
  const [activeTab, setActiveTab] = useState('teoria');
  const [checkedAnswers, setCheckedAnswers] = useState({});

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedData(null);
    setCheckedAnswers({});
    
    const steps = [
      'Analizando sílabo académico...',
      'Generando explicaciones de teoría con Anthropic API...',
      'Estructurando problemas prácticos y soluciones...',
      'Creando banco de preguntas tipo test de opción múltiple...',
      'Compilando esquema para diapositivas de clase...',
      'Validando esquemas de datos finales...'
    ];

    let currentStepIndex = 0;
    setGenerationStep(steps[currentStepIndex]);

    const stepInterval = setInterval(() => {
      currentStepIndex++;
      if (currentStepIndex < steps.length) {
        setGenerationStep(steps[currentStepIndex]);
      } else {
        clearInterval(stepInterval);
      }
    }, 900);

    try {
      const data = await generarMaterialAI(materia, tema, unidades);
      setGeneratedData(data);
    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setIsGenerating(false);
      clearInterval(stepInterval);
    }
  };

  return {
    tema, setTema,
    materia, setMateria,
    unidades, setUnidades,
    isGenerating,
    generationStep,
    generatedData,
    activeTab, setActiveTab,
    checkedAnswers, setCheckedAnswers,
    handleGenerate
  };
};
