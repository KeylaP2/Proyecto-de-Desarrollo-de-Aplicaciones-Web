# SoloTenisRD

SoloTenisRD es una aplicación web para la venta y promoción de tenis deportivos y casuales en la República Dominicana. Permite explorar productos, filtrar el catálogo, utilizar un carrito y registrar usuarios.

Este proyecto fue desarrollado como parte de la asignatura Desarrollo de Aplicaciones Web.

## Estructura del proyecto

```text
Proyecto-de-Desarrollo-de-Aplicaciones-Web/
├── frontend/
│   ├── index.html
│   ├── catalogo.html
│   ├── registro.html
│   ├── catalogo.js
│   ├── registro.js
│   └── css/
│       └── style.css
├── backend/
│   ├── app.js
│   ├── package.json
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── models/
│   └── routes/
└── README.md
```

## Requisitos

Antes de comenzar, instala:

- [Node.js](https://nodejs.org/) y npm.
- Un navegador web moderno.
- Git, solamente si vas a clonar el repositorio.

Puedes comprobar que Node.js y npm están instalados ejecutando:

```bash
node --version
npm --version
```

## Instalación

### 1. Obtener el proyecto

Si descargaste el proyecto como archivo ZIP, descomprímelo y abre una terminal dentro de su carpeta.

Si tienes la dirección del repositorio de GitHub, también puedes clonarlo:

```bash
git clone URL_DEL_REPOSITORIO
cd Proyecto-de-Desarrollo-de-Aplicaciones-Web
```

### 2. Instalar el backend

Desde la raíz del proyecto, entra al directorio `backend` e instala sus dependencias:

```bash
cd backend
npm install
```

### 3. Configurar las variables de entorno

Crea el archivo `.env` a partir del ejemplo incluido:

macOS o Linux:

```bash
cp .env.example .env
```

Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

La configuración predeterminada es:

```env
PORT=3000
DB_FILE=database/mibase.db
CORS_ORIGIN=*
```

### 4. Inicializar la base de datos

Ejecuta este comando dentro de `backend`:

```bash
npm run init-db
```

Este comando crea o prepara la base de datos SQLite en `backend/database/mibase.db`.

## Cómo ejecutar la aplicación

La aplicación utiliza dos servidores. El backend y el frontend deben permanecer ejecutándose al mismo tiempo en dos terminales diferentes.

### Terminal 1: ejecutar el backend

Desde la raíz del proyecto:

```bash
cd backend
npm run dev
```

El backend estará disponible en:

```text
http://localhost:3000
```

Para comprobarlo, visita:

```text
http://localhost:3000/health
```

También se puede iniciar sin el modo de desarrollo:

```bash
npm start
```

### Terminal 2: ejecutar el frontend sin la extensión Live Server

Abre otra terminal en la raíz del proyecto y ejecuta:

```bash
npx live-server frontend --port=5500
```

La primera vez, `npx` puede preguntar si deseas instalar temporalmente `live-server`. Escribe `y` y presiona Enter.

El navegador debería abrir automáticamente. Si no se abre, visita:

```text
http://127.0.0.1:5500
```

Este método funciona desde cualquier IDE o desde una terminal normal; no requiere la extensión Live Server de Visual Studio Code.

### Alternativa con Python

Si no deseas utilizar `npx` y tienes Python 3 instalado:

macOS o Linux:

```bash
cd frontend
python3 -m http.server 5500
```

Windows:

```powershell
cd frontend
python -m http.server 5500
```

Después visita:

```text
http://localhost:5500
```

> No se recomienda abrir `index.html` directamente con doble clic. Usar un servidor local evita problemas de navegación y solicitudes al backend.

## Ejecutar con la extensión Live Server de VS Code

Si tienes instalada la extensión Live Server:

1. Abre la carpeta completa del proyecto en VS Code.
2. Presiona **Go Live**.
3. La configuración incluida en `.vscode/settings.json` utilizará `frontend` como raíz.
4. Visita `http://127.0.0.1:5500` si el navegador no se abre automáticamente.

El backend todavía debe ejecutarse por separado con `npm run dev`.

## Detener los servidores

En cada terminal donde haya un servidor ejecutándose, presiona:

```text
Ctrl + C
```

## Rutas principales del backend

- `GET /health`: comprueba el estado del servidor.
- `/api/usuarios`: operaciones relacionadas con los usuarios.

## Solución de problemas

### Live Server muestra las carpetas `backend` y `frontend`

Esto ocurre cuando se sirve la raíz del repositorio. Inicia el servidor indicando la carpeta correcta:

```bash
npx live-server frontend --port=5500
```

### El frontend no puede registrar o consultar usuarios

Comprueba que el backend esté ejecutándose en `http://localhost:3000` y que `http://localhost:3000/health` responda correctamente.

### El puerto ya está ocupado

Detén el proceso anterior con `Ctrl + C`. También puedes usar otro puerto para el frontend:

```bash
npx live-server frontend --port=5501
```

En ese caso, abre `http://127.0.0.1:5501`.

## Participantes

- Keyla Perdomo — 100075506
- Esteban De Jesús Revi — 100077916
- Darlyn Francisco — 100011821
- Yarolin Esmailin Polanco Nuñez — 100047803
- Jayson Enrique Peña Ferreras — 100042691
- Adrián Pérez López — 100077425
