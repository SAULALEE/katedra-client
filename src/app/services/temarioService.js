import api from './api';

const MOCK_INITIAL_COURSES = [
  { id: '1', titulo: 'Introducción a Python y Control de Flujo', asignatura: 'Programación I', temas: 5, fecha: '2026-05-28', estado: 'Completado', origen: 'Manual' },
  { id: '2', titulo: 'Límites, Continuidad y Derivadas', asignatura: 'Cálculo Diferencial', temas: 8, fecha: '2026-05-25', estado: 'Completado', origen: 'Manual' },
  { id: '3', titulo: 'Leyes de Newton y Fuerza de Fricción', asignatura: 'Física Clásica', temas: 4, fecha: '2026-05-20', estado: 'Completado', origen: 'Manual' },
];

const MOCK_GENERATED_CONTENT = {
  teoria: `## Unidad 1: Estructuras de Datos Lineales

### 1.1 Introducción a las Estructuras de Datos
En programación, una estructura de datos es una forma particular de organizar y almacenar datos en una computadora para que puedan usarse de manera eficiente. Las estructuras de datos lineales son aquellas cuyos elementos forman una secuencia ordenada donde cada elemento tiene un único predecesor y sucesor directo (excepto el primero y el último).

### 1.2 Listas Enlazadas (Linked Lists)
Una lista enlazada es una colección lineal de elementos de datos, llamados nodos, donde el orden lineal no está dado por su ubicación física en la memoria. En su lugar, cada nodo contiene un puntero o referencia que apunta al siguiente nodo de la secuencia.

*   **Nodo:** Contiene el campo de valor (dato) y el enlace al siguiente nodo (*next*).
*   **Complejidad temporal:** Búsqueda $O(n)$, Inserción al inicio $O(1)$, Eliminación al inicio $O(1)$.

### 1.3 Pilas (Stacks)
Una pila es una estructura de tipo **LIFO** (Last In, First Out - Último en entrar, primero en salir). Permite almacenar y recuperar datos utilizando únicamente dos operaciones básicas:
1.  **Push:** Introduce un elemento en el tope de la pila.
2.  **Pop:** Retira el elemento superior del tope de la pila.
`,
  ejercicios: `## Guía de Ejercicios Prácticos: Estructuras de Datos Lineales

### Ejercicio 1: Inversión de una Lista Enlazada
**Instrucciones:** Escribe una función en Python/JavaScript que tome la cabeza (*head*) de una lista enlazada simple y la invierta de forma iterativa, devolviendo la nueva cabeza.

*   **Restricción de Espacio:** $O(1)$ memoria auxiliar.
*   **Restricción de Tiempo:** $O(n)$ complejidad lineal.

**Solución Guía:**
\`\`\`javascript
function invertirLista(head) {
  let prev = null;
  let current = head;
  while (current !== null) {
    let nextTemp = current.next;
    current.next = prev;
    prev = current;
    current = nextTemp;
  }
  return prev;
}
\`\`\`

### Ejercicio 2: El problema de los Paréntesis Balanceados
**Instrucciones:** Utilizando una pila (*Stack*), diseña un algoritmo para determinar si una cadena de texto que contiene paréntesis \`()\`, llaves \`{}\` y corchetes \`[]\` se encuentra balanceada correctamente.
`,
  evaluacion: [
    {
      pregunta: "¿Cuál es la complejidad de tiempo para insertar un nodo al inicio de una Lista Enlazada Simple?",
      opciones: ["O(1) - Tiempo Constante", "O(n) - Tiempo Lineal", "O(log n) - Tiempo Logarítmico", "O(n²) - Tiempo Cuadrático"],
      opcionCorrectaIndex: 0,
      explicacion: "Dado que solo se requiere reasignar el puntero 'next' del nuevo nodo al actual 'head' y reasignar el puntero de la cabeza, la operación se realiza en tiempo constante O(1)."
    },
    {
      pregunta: "¿Qué principio de almacenamiento rige el funcionamiento de una estructura de tipo Pila (Stack)?",
      opciones: ["FIFO (First In, First Out)", "LIFO (Last In, First Out)", "LILO (Last In, Last Out)", "Random Access"],
      opcionCorrectaIndex: 1,
      explicacion: "Las Pilas se rigen bajo el principio LIFO (Last In, First Out), donde el último elemento añadido al tope es el primero en ser extraído."
    },
    {
      pregunta: "Si realizas una operación 'pop' en una pila que se encuentra vacía, ¿qué término técnico describe este error de desbordamiento?",
      opciones: ["Stack Overflow", "Stack Underflow", "Null Pointer Exception", "Memory Leak"],
      opcionCorrectaIndex: 1,
      explicacion: "El intento de extraer un elemento de una pila sin datos disponibles se denomina técnicamente 'Stack Underflow'."
    }
  ],
  diapositivas: [
    {
      titulo: "Diapositiva 1: Estructuras Lineales",
      puntos: [
        "Definición básica de estructuras secuenciales.",
        "Diferencia entre orden físico (arrays) y lógico (listas).",
        "Importancia de la selección de estructuras en la optimización."
      ]
    },
    {
      titulo: "Diapositiva 2: La Lista Enlazada Simple",
      puntos: [
        "Estructura del Nodo: Dato + Enlace al sucesor.",
        "Ventaja: Inserciones y eliminaciones ultra rápidas O(1).",
        "Desventaja: Búsqueda secuencial costosa O(n)."
      ]
    },
    {
      titulo: "Diapositiva 3: Pilas y su Aplicación",
      puntos: [
        "Concepto LIFO (Last In, First Out).",
        "Operaciones fundamentales: Push y Pop.",
        "Casos prácticos: Historial del navegador y llamadas recursivas."
      ]
    }
  ]
};

/**
 * Fetches all courses/temarios.
 * Restores from localStorage if available to support mockup persistence.
 */
export const getTemarios = async () => {
  try {
    const response = await api.get('/temarios');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener temarios');
  }
};

/**
 * Adds a new temario to the system (supporting links, drive, pdfs, etc.).
 * Fully prepared for backend ingestion.
 * 
 * @param {object} temarioData { titulo, asignatura, gradoAcademico, descripcion, temas, origen, detalleOrigen }
 */
export const crearTemarioRequest = async (temarioData) => {
  try {
    const response = await api.post('/temarios', temarioData);
    return response.data;
  } catch (error) {
    throw new Error('Error al guardar el temario');
  }
};

export const generarMaterialAI = async (materia, tema, unidades) => {
  // Option 1: Backend Integration
  /*
  try {
    const response = await api.post('/temarios/generar-material', { materia, tema, unidades });
    return response.data;
  } catch (error) {
    throw new Error('Error al generar material con IA');
  }
  */

  // Option 2: Mock Static Simulation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_GENERATED_CONTENT);
    }, 5400);
  });
};

export const getContenidoTemario = async (id) => {
  // Mock function to get content of an already generated temario
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_GENERATED_CONTENT);
    }, 800);
  });
};
