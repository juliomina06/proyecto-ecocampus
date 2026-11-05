# 🌱 EcoCampus App (ReciclaFácil) - MVP Web

**Institución Universitaria Antonio José Camacho**  
**Asignatura:** Ingeniería de Software I  
**Docente:** Daniel Andres Pino Gomez  
**Estudiante:** Julio Francisco Mina Advíncula  

🔗 **Aplicación en vivo (GitHub Pages):** [https://juliomina06.github.io/proyecto-ecocampus/](https://juliomina06.github.io/proyecto-ecocampus/)  
💻 **Repositorio:** [https://github.com/juliomina06/proyecto-ecocampus](https://github.com/juliomina06/proyecto-ecocampus)

## 📝 Descripción del Proyecto
EcoCampus es un Producto Mínimo Viable (MVP) web diseñado para fomentar la cultura del reciclaje (ODS 12). El sistema permite a los ciudadanos/estudiantes escanear residuos, identificar el contenedor correcto, validar el depósito mediante un escaneo en la caneca (simulando IoT) y acumular "EcoPuntos" canjeables en cafetería. El sistema también cuenta con un panel de administración para el personal de logística.

## 🛠️ Stack Tecnológico y Arquitectura
*   **Frontend:** HTML5, CSS3 y JavaScript (Vanilla).
*   **Lógica de Cámara:** Librería `html5-qrcode`.
*   **Generación de QR:** Librería `qrcodejs`.
*   **Persistencia:** `localStorage` (Simulando la capa DAO de una base de datos).
*   **Arquitectura:** Patrón en capas (Presentación -> Lógica de Negocio (BO) -> Datos (DAO)).

---

## 📋 Requerimientos Funcionales (RF)

| ID | Nombre | Descripción | Estado |
| :--- | :--- | :--- | :--- |
| **RF-01** | Escanear productos | El sistema permite escanear el código QR del residuo para indicar el contenedor correcto. | ✅ Implementado |
| **RF-02** | Acumulación de EcoPuntos | Registra y acumula puntos digitales por cada depósito validado correctamente. | ✅ Implementado |
| **RF-03** | Redención de EcoPuntos | Permite canjear los puntos acumulados en la cafetería de la universidad. | ✅ Implementado |
| **RF-04** | Alertas de contenedores | Envía alertas visuales al personal de logística cuando un contenedor está próximo a llenarse (80%). | ✅ Implementado |
| **RF-05** | Historial de reciclaje | Muestra al estudiante un historial con los materiales reciclados, puntos ganados y zona. | ✅ Implementado |

## ⚙️ Requerimientos No Funcionales (RNF)

*   **Portabilidad:** El sistema es 100% web, adaptado a dispositivos móviles (Responsive) y desplegado en la nube (GitHub Pages), funcionando sin instalación.
*   **Seguridad y Antifraude:** Implementación de validación antiduplicados (replay attack). Un código de residuo no puede ser escaneado dos veces para farmear puntos.
*   **Integridad de Datos:** Validación cruzada (residuo vs. caneca). El sistema no otorga puntos hasta que el usuario escanea el contenedor correcto, simulando sensores IoT.
*   **Usabilidad:** Interfaz gráfica con paleta de colores ecológicos, animaciones, modales y avisos flotantes (Toasts) para guiar al usuario.
*   **Mantenibilidad:** Código modularizado en archivos separados (`app.js` para lógica general y `escaner.js` para cámara), facilitando futuras actualizaciones.

---

## 🚀 Historias de Usuario (HU) y Criterios de Aceptación

### HU-01: Escanear producto y validar contenedor
**Como** estudiante, **quiero** escanear el código de barras/QR de un producto para saber en qué contenedor debo depositarlo.
*   **CA-01:** Dado que el estudiante escanea un código válido, cuando el sistema lo reconoce, entonces muestra en pantalla el contenedor correcto con un color e ícono.
*   **CA-02:** Dado que el estudiante escanea un código no registrado, cuando el sistema no lo reconoce, entonces muestra un mensaje indicando que debe consultar el manual de residuos.

### HU-02: Acumular EcoPuntos de forma segura
**Como** estudiante, **quiero** acumular EcoPuntos digitales cada vez que reciclo para poder canjearlos después.
*   **CA-01:** Dado que el estudiante deposita correctamente un residuo, cuando el sistema confirma el depósito en la caneca correcta, entonces suma los EcoPuntos correspondientes.
*   **CA-02:** Dado que el estudiante intenta escanear el mismo residuo dos veces, cuando el sistema detecta duplicidad, entonces bloquea la transacción y muestra un mensaje de alerta.

### HU-03: Alerta de contenedor lleno (Logística)
**Como** miembro del personal de servicios generales, **quiero** recibir una alerta cuando un contenedor esté por llenarse.
*   **CA-01:** Dado que un contenedor alcanza el 80% de su capacidad (simulado), cuando el sistema lo detecta, entonces cambia la barra a color rojo y emite un aviso.
*   **CA-02:** Dado que el personal recibe la alerta, cuando va al lugar y lo vacía, puede presionar "Vaciar" para resetear el contador al 0%.

---

## 🔑 Credenciales de Prueba y Guía Rápida
1.  **Usuario:** `ciudadano` | **Contraseña:** `123`
2.  **Generar QR (Admin):** Ve al "Panel de Logística", crea un residuo (ej. ID: `botella_1`, Material: Plástico, Puntos: 10) y genera su QR.
3.  **Escanear:** Abre el escáner, lee el QR de `botella_1` y luego lee el QR del contenedor (`caneca_blanca`).
4.  **Reset:** Si necesitas limpiar los datos para una nueva prueba, usa el botón rojo en el Panel de Logística.
