# Guion de defensa técnica — SoloTenisRD

## Información general

- **Asignatura:** Desarrollo de Aplicaciones Web
- **Grupo:** Grupo 3
- **Proyecto:** SoloTenisRD
- **Duración máxima:** 5 minutos
- **Tiempo por integrante:** 1 minuto
- **Formato:** exposición continua con demostración en vivo

## Objetivo del video

Demostrar de forma breve y coherente que SoloTenisRD es una aplicación web completa, funcional, responsive y segura. Durante la defensa deben verse claramente:

1. La arquitectura separada en frontend y backend.
2. El uso efectivo de Bootstrap y estilos responsive.
3. Las funcionalidades principales de la tienda.
4. La API REST, SQLite y la persistencia de datos.
5. El login, logout y la protección de sesiones y rutas.
6. El panel administrativo y el CRUD de usuarios.
7. La limpieza y calidad técnica del código.

## Participantes y orden

| Tiempo | Integrante | Tema principal |
|---|---|---|
| 0:00–1:00 | Keyla Perdomo — 100075506 | Presentación, propósito, arquitectura y framework |
| 1:00–2:00 | Esteban De Jesús Revi — 100077916 | Funcionalidades del frontend y diseño responsive |
| 2:00–3:00 | Darlyn Francisco — 100011821 | Backend, API REST y SQLite |
| 3:00–4:00 | Yarolin Esmailin Polanco Nuñez — 100047803 | Autenticación, sesiones y seguridad |
| 4:00–5:00 | Jayson Enrique Peña Ferreras — 100042691 | Panel administrativo, calidad y cierre |

---

## Antes de grabar

### Preparación técnica

Abrir dos terminales.

Terminal 1 — backend:

```bash
cd backend
npm install
npm run init-db
npm run check
npm run dev
```

Terminal 2 — frontend:

```bash
npx live-server frontend --port=5500
```

Comprobar antes de grabar:

- `http://localhost:3000/health` responde correctamente.
- `http://127.0.0.1:5500` abre la tienda.
- Existe al menos un usuario cliente para demostrar el carrito.
- El acceso administrativo funciona.
- WhatsApp Web está disponible o la pantalla de selección de WhatsApp puede abrirse.
- La consola del navegador no presenta errores.
- El zoom del navegador está entre 90 % y 100 %.
- No se muestra el contenido del archivo `.env` durante el video.

### Ventanas que deben estar preparadas

1. Tienda abierta en `index.html`.
2. Visual Studio Code o el IDE con las carpetas `frontend` y `backend` expandidas.
3. Terminal con `npm run check` finalizado correctamente.
4. Panel administrativo preparado, pero sin mostrar la contraseña.

### Reglas para mantener los cinco minutos

- Cada integrante debe ensayar con cronómetro.
- Hablar entre 120 y 140 palabras por minuto.
- No repetir lo explicado por otro compañero.
- El siguiente integrante comienza exactamente donde termina el anterior.
- Las páginas deben estar abiertas previamente para evitar esperas.
- No detenerse a escribir comandos largos durante la exposición.

---

# Guion minuto a minuto

## Minuto 1 — Keyla Perdomo

### Tema

Presentación del proyecto, objetivo, arquitectura y uso del framework.

### Qué mostrar en pantalla

1. Página de inicio de SoloTenisRD.
2. Cambiar brevemente al IDE.
3. Mostrar las carpetas `frontend` y `backend`.
4. Mostrar `index.html` y las clases de Bootstrap sin detenerse demasiado.

### Guion hablado

> Buenos días. Somos el Grupo 3 y presentamos SoloTenisRD, nuestro proyecto final de Desarrollo de Aplicaciones Web. Es una tienda virtual de tenis deportivos y casuales diseñada para ofrecer una experiencia clara, moderna y adaptable a diferentes dispositivos. El proyecto está organizado con una arquitectura cliente-servidor. En la carpeta frontend se encuentran las páginas HTML, los estilos CSS y la lógica JavaScript de la tienda. En backend tenemos Express, controladores, modelos, rutas, middleware y las bases de datos SQLite. Para la interfaz utilizamos Bootstrap 5: su sistema de filas, columnas, tarjetas, formularios, botones y puntos de ruptura nos permite mantener consistencia visual y diseño responsive. También añadimos estilos propios para conservar la identidad de SoloTenisRD. A continuación, Esteban demostrará cómo esta arquitectura se convierte en una experiencia funcional para el usuario.

### Frase de enlace

> A continuación, Esteban demostrará cómo esta arquitectura se convierte en una experiencia funcional para el usuario.

---

## Minuto 2 — Esteban De Jesús Revi

### Tema

Catálogo, filtros, detalles, carrito, compra por WhatsApp y responsive.

### Qué mostrar en pantalla

1. Navegar de Inicio a Catálogo.
2. Aplicar un filtro por marca.
3. Hacer clic en la imagen de un producto.
4. Mostrar el modal de detalles y cerrarlo.
5. Añadir un producto seleccionando género y talla.
6. Abrir el carrito y señalar imagen, cantidad, subtotal y total.
7. Mostrar el botón de WhatsApp sin enviar el mensaje.

### Guion hablado

> En el frontend, el usuario puede navegar entre Inicio y Catálogo y filtrar los productos por marca. Cada tarjeta presenta imagen, nombre, categoría y precio. Al seleccionar una imagen se abre una ficha responsive con descripción, material, suela, uso recomendado, stock y galería preparada para múltiples imágenes. Para añadir un producto se requiere seleccionar género y talla. El carrito muestra la fotografía, variante, cantidad, precio unitario, subtotal y total; también permite aumentar, reducir, eliminar o vaciar artículos. Al presionar Comprar por WhatsApp se genera automáticamente un pedido con código, cliente, productos, cantidades y total, dirigido al número de la tienda. Las imágenes inválidas se controlan sin romper la interfaz. Todo se adapta a computadoras, tabletas y teléfonos mediante Bootstrap, media queries y componentes flexibles. Ahora Darlyn explicará cómo el backend procesa y conserva esta información.

### Frase de enlace

> Ahora Darlyn explicará cómo el backend procesa y conserva esta información.

---

## Minuto 3 — Darlyn Francisco

### Tema

Backend, API REST, estructura MVC y persistencia con SQLite.

### Qué mostrar en pantalla

1. IDE con `backend/app.js`.
2. Mostrar rápidamente `routes`, `controllers`, `models`, `middleware` y `database`.
3. Abrir `http://localhost:3000/health`.
4. Mostrar `database/database.sql` o la estructura de tablas.

### Guion hablado

> El backend está construido con Node.js y Express y sigue una separación por responsabilidades. Las rutas reciben las solicitudes; los middleware verifican autenticación, permisos y protección CSRF; los controladores validan los datos y coordinan la respuesta; y los modelos ejecutan las consultas parametrizadas sobre SQLite. La API incluye autenticación, usuarios, carrito, seguridad y administración. Podemos comprobar su disponibilidad mediante el endpoint health, que devuelve el estado del servidor y la base de datos. SQLite almacena usuarios, carritos, administradores e intentos fallidos. Las sesiones se guardan en una base separada, por lo que permanecen activas aunque el backend se reinicie. El comando npm run init-db crea las tablas de forma idempotente y configura el administrador sin eliminar usuarios existentes. Las contraseñas nunca se devuelven desde la API y se almacenan con hash bcrypt. Yarolin continuará con las medidas de autenticación y seguridad.

### Frase de enlace

> Yarolin continuará con las medidas de autenticación y seguridad.

---

## Minuto 4 — Yarolin Esmailin Polanco Nuñez

### Tema

Login, logout, persistencia de sesión, rutas protegidas y defensa de seguridad.

### Qué mostrar en pantalla

1. Iniciar sesión como cliente o utilizar una sesión preparada.
2. Mostrar que Registro desaparece y aparece Cerrar sesión.
3. Navegar entre Inicio y Catálogo para evidenciar la persistencia.
4. Mostrar brevemente `middleware/authRequired.js`, `adminRequired.js` y `csrf.js`.
5. Cerrar sesión.

### Guion hablado

> La autenticación está separada para clientes y administradores. Al iniciar sesión, Express regenera el identificador para prevenir fijación de sesión y envía una cookie HttpOnly, SameSite Lax y segura en producción. Las sesiones duran dos horas y se almacenan en SQLite, por lo que el usuario puede navegar entre páginas sin perder su estado. Las rutas del carrito exigen una sesión válida y el CRUD de usuarios exige además el rol administrativo. Todas las operaciones que modifican información utilizan un token CSRF de 64 caracteres; si falta o está vencido, el backend responde con estado 403. También utilizamos CORS con orígenes permitidos, Helmet con encabezados HTTP de seguridad y limitación persistente de intentos de acceso. Las contraseñas se procesan con bcrypt y las credenciales privadas permanecen en `.env`, fuera de Git. Finalmente, Jayson mostrará el módulo administrativo y las comprobaciones de calidad.

### Frase de enlace

> Finalmente, Jayson mostrará el módulo administrativo y las comprobaciones de calidad.

---

## Minuto 5 — Jayson Enrique Peña Ferreras

### Tema

Panel administrativo, CRUD, limpieza del código, pruebas y conclusión.

### Qué mostrar en pantalla

1. Entrar al panel administrativo con una sesión ya preparada.
2. Mostrar total de usuarios y buscador.
3. Abrir el formulario de crear o editar usuario, sin guardar datos innecesarios.
4. Señalar botones Editar y Eliminar.
5. Cambiar a la terminal y mostrar el resultado de `npm run check`.
6. Terminar en la página principal del proyecto.

### Guion hablado

> El módulo administrativo está aislado de la vista pública y solo puede abrirse con una sesión de rol admin. Desde este panel se visualizan y buscan usuarios y se ejecuta el CRUD completo: crear, consultar, actualizar y eliminar, siempre mediante rutas protegidas. La lista de usuarios no se expone en el registro público. Para garantizar la calidad ejecutamos npm run check. Este comando aplica ESLint al frontend y backend, ejecuta cinco pruebas automatizadas y revisa las dependencias con npm audit. Las pruebas comprueban encabezados de seguridad, rechazo de rutas sin sesión, protección CSRF, autenticación administrativa y privacidad del listado de usuarios. El resultado final es cinco pruebas aprobadas, sintaxis válida, referencias completas y cero vulnerabilidades conocidas. Con SoloTenisRD integramos framework, diseño responsive, API REST, persistencia, seguridad, administración y calidad de código en una aplicación completa y funcional. Muchas gracias.

### Cierre final

> Con SoloTenisRD integramos framework, diseño responsive, API REST, persistencia, seguridad, administración y calidad de código en una aplicación completa y funcional. Muchas gracias.

---

# Recorrido visual exacto

Para que el video se sienta como una sola exposición, utilizar este orden de ventanas:

```text
Inicio de la tienda
   ↓
Estructura frontend/backend en el IDE
   ↓
Catálogo y filtros
   ↓
Modal de producto
   ↓
Carrito y WhatsApp
   ↓
Estructura del backend
   ↓
Endpoint /health
   ↓
Login y navegación autenticada
   ↓
Middleware de seguridad
   ↓
Panel administrativo
   ↓
Terminal con npm run check
   ↓
Página principal y despedida
```

# Evidencias de la consigna

## Uso efectivo del framework

Durante los minutos de Keyla y Esteban deben verse:

- Navbar y botones consistentes.
- Grid responsive de productos.
- Tarjetas y formularios de Bootstrap.
- Adaptación del carrito y los modales.
- Interfaz en una resolución de escritorio y, si el tiempo lo permite, una vista móvil preparada.

## Seguridad en el manejo de sesiones

Durante el minuto de Yarolin deben mencionarse:

- Login y logout funcionales.
- Cookie HttpOnly, SameSite y Secure en producción.
- Regeneración de sesión después del login.
- Sesiones persistentes en SQLite.
- Rutas de carrito protegidas.
- Rutas administrativas protegidas por rol.
- Tokens CSRF.
- Hash bcrypt.
- CORS, Helmet y límite de intentos.

## Calidad de la defensa y limpieza del código

Durante los minutos de Darlyn y Jayson deben verse:

- Separación entre rutas, middleware, controladores y modelos.
- Consultas parametrizadas.
- Variables privadas en `.env`.
- Ausencia de credenciales en el repositorio.
- Resultado de ESLint.
- Cinco pruebas automatizadas aprobadas.
- Cero vulnerabilidades reportadas por npm audit.

# Preguntas que puede hacer el docente

## ¿Por qué separaron frontend y backend?

Porque permite dividir la presentación, la lógica de negocio y la persistencia. El frontend consume la API sin conocer directamente la base de datos, mientras el backend centraliza validación, seguridad y acceso a SQLite.

## ¿Qué framework utilizaron?

Bootstrap 5 para la interfaz responsive y Express para el servidor y la API REST.

## ¿Dónde se almacenan las contraseñas?

En SQLite como hashes bcrypt. La contraseña original no se almacena ni se devuelve en las respuestas.

## ¿Cómo protegen las sesiones?

Con cookies HttpOnly, SameSite Lax, Secure en producción, regeneración del ID al iniciar sesión, expiración de dos horas y persistencia del lado del servidor en SQLite.

## ¿Qué sucede si alguien intenta acceder al panel sin iniciar sesión?

El middleware administrativo rechaza la solicitud con estado HTTP 401. Si tiene sesión de cliente pero no rol administrativo, tampoco obtiene acceso al CRUD.

## ¿Qué es CSRF y cómo lo evitaron?

Es un ataque que intenta ejecutar operaciones usando la sesión de otra persona. Cada operación que modifica datos requiere un token aleatorio asociado a la sesión; sin él, el backend responde con 403.

## ¿Cómo garantizan la calidad del código?

Con separación por módulos, ESLint, validaciones, pruebas automatizadas, revisión de sintaxis y `npm audit` sin vulnerabilidades conocidas.

## ¿Por qué utilizaron SQLite?

Porque es adecuada para el alcance académico del proyecto, no necesita un servidor independiente y permite demostrar persistencia y relaciones mediante SQL real.

## ¿El carrito se conserva?

El carrito de clientes se guarda en SQLite asociado al usuario. El administrador también puede usar un carrito dentro de su sesión protegida.

# Lista de control final

- [ ] Los cinco integrantes conocen su minuto y la frase de enlace.
- [ ] El video dura como máximo 5:00 minutos.
- [ ] Se muestra el frontend funcionando.
- [ ] Se muestra la estructura del backend.
- [ ] Se demuestra el uso de Bootstrap.
- [ ] Se muestra un producto y su modal.
- [ ] Se añade un producto al carrito.
- [ ] Se enseña el pedido de WhatsApp sin enviarlo.
- [ ] Se demuestra login, persistencia y logout.
- [ ] Se muestra el panel administrativo.
- [ ] Se explica el CRUD protegido.
- [ ] Se muestra `npm run check` exitoso.
- [ ] No se muestra `.env` ni ninguna contraseña.
- [ ] No aparecen errores en la consola.
- [ ] El cierre menciona framework, seguridad y calidad.

# Recomendación de ensayo

Realizar al menos dos ensayos completos:

1. **Primer ensayo:** comprobar que cada persona puede completar sus acciones y texto en un minuto.
2. **Segundo ensayo:** grabar una prueba de cinco minutos y corregir pausas, repeticiones o cambios lentos de ventana.

Si una demostración tarda más de lo esperado, continuar hablando y pasar al siguiente punto. La prioridad es cubrir los tres criterios de evaluación dentro del límite de tiempo.
