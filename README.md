# Katedra Client

Este repositorio contiene el frontend de **Katedra**, una herramienta de generación de contenido académico impulsada por Inteligencia Artificial para profesores.

---

## 🛠️ Requisitos Previos e Instalación

Asegúrate de tener instalado lo siguiente en tu máquina local:

### 1. Bun
Runtime de JavaScript y gestor de dependencias principal del proyecto.
- **Instalación:** Sigue las instrucciones de la [documentación oficial de Bun](https://bun.sh/).

### 2. Doppler CLI
Cliente para inyectar variables de entorno de forma segura sin usar archivos locales `.env`.

#### 🐧 En Linux (Debian/Ubuntu/macOS)
Puedes utilizar el instalador rápido oficial:
```bash
curl -sLf https://web.doppler.com/install.sh | sh
```
*O vía Homebrew:*
```bash
brew install dopplerhq/cli/doppler
```

#### 🪟 En Windows
Puedes instalarlo mediante gestores de paquetes comunes de Windows:

**Opción A: Winget (Recomendado)**
```powershell
winget install Doppler.DopplerCLI
```

**Opción B: Scoop**
```powershell
scoop bucket add doppler https://github.com/DopplerHQ/scoop-bucket.git
scoop install doppler
```

**Opción C: Chocolatey**
```powershell
choco install doppler
```

---

## 🚀 Configuración del Entorno Local

Una vez completadas las instalaciones del sistema, sigue estos pasos:

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone <url-del-repositorio>
cd katedra-client
bun install
```

### 2. Autenticar y enlazar Doppler
Debes conectarte a Doppler y enlazar este directorio local al proyecto de la aplicación:

```bash
# Iniciar sesión en Doppler (solo la primera vez)
doppler login

# Enlazar la carpeta local al proyecto
doppler setup
```
> [!NOTE]
> Cuando ejecutes `doppler setup`, selecciona el proyecto **`katedra-client`** y la configuración de entorno **`dev`** (o tu configuración de desarrollo asignada).

### 3. Ejecutar el servidor de desarrollo
Para iniciar la aplicación local con los secretos inyectados automáticamente:

```bash
bun run dev
```

El servidor de desarrollo correrá por defecto en `http://localhost:5173`.

---

## 📦 Scripts Disponibles

El proyecto expone los siguientes scripts definidos con Bun:

- `bun run dev`: Levanta el entorno de desarrollo Vite bajo el contexto de `doppler run`.
- `bun run build`: Compila el cliente optimizado para producción.
- `bun run lint`: Ejecuta el análisis de linter (ESLint) sobre el código.
- `bun run preview`: Previsualiza localmente el build de producción generado.

---

## 🔒 Gestión de Variables de Entorno

* **No crear archivos `.env` locales:** No es necesario crear archivos de configuración local en el disco. Doppler se encarga de inyectar las variables directamente en el proceso de ejecución.
* **Agregar nuevos secretos:** Si necesitas registrar una nueva variable (por ejemplo, `VITE_NUEVA_VARIABLE`), agrégala en la plataforma de Doppler para el proyecto `katedra-client` y notifica a tu equipo para sincronizar los cambios.
