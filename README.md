# API RESTful de Usuarios con Express y SQLite

Proyecto backend para gestionar usuarios mediante una API RESTful construida con Node.js, Express.js y SQLite.

## Requisitos

- Node.js instalado
- npm instalado

## Instalacion

1. Clonar o descargar el repositorio.
2. Entrar a la carpeta del proyecto:

```bash
cd Proyecto-de-Desarrollo-de-Aplicaciones-Web
```

3. Instalar las dependencias:

```bash
npm install
```

En PowerShell de Windows puede aparecer un error de politicas de ejecucion con `npm.ps1`. Si ocurre, usar:

```bash
npm.cmd install
```

4. Inicializar la base de datos SQLite:

```bash
npm run init-db
```

5. Iniciar el servidor:

```bash
npm start
```

Para desarrollo con reinicio automatico:

```bash
npm run dev
```

## Configuracion

El proyecto usa variables de entorno desde `.env`.

```env
PORT=3000
DB_FILE=database/mibase.db
CORS_ORIGIN=*
```

Si el puerto `3000` esta ocupado, se puede usar otro puerto al iniciar el servidor:

```bash
PORT=3001 npm start
```

En PowerShell:

```powershell
$env:PORT=3001; npm start
```

## Endpoints

URL base por defecto:

```text
http://localhost:3000
```

La API de usuarios esta montada bajo `/api/usuarios`.

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/health` | Verifica que el servidor este funcionando |
| GET | `/api/usuarios` | Lista todos los usuarios |
| GET | `/api/usuarios/:id` | Obtiene un usuario por id |
| POST | `/api/usuarios` | Crea un usuario |
| PUT | `/api/usuarios/:id` | Actualiza un usuario |
| DELETE | `/api/usuarios/:id` | Elimina un usuario |

## Ejemplo de cuerpo JSON

Para crear o actualizar un usuario:

```json
{
  "nombre": "Ana Perez",
  "email": "ana@example.com",
  "password": "password_demo_1"
}
```

## Scripts disponibles

```bash
npm start
npm run dev
npm run init-db
```

## Notas de entrega

- `package-lock.json` debe agregarse al repositorio junto con `package.json`.
- La base de datos SQLite generada en `database/mibase.db` no se versiona porque esta incluida en `.gitignore`.
