# 🌱 EcoCampus App (ReciclaFácil) - MVP Web

**Institución Universitaria Antonio José Camacho**
**Asignatura:** Ingeniería de Software I
**Estudiante:** Julio Francisco Mina Advíncula

## 📝 Descripción del Proyecto
EcoCampus es un Producto Mínimo Viable (MVP) web diseñado para fomentar la cultura del reciclaje. El sistema permite a los ciudadanos/estudiantes escanear residuos, identificar el contenedor correcto, validar el depósito mediante un escaneo en la caneca (simulando IoT) y acumular "EcoPuntos" canjeables en cafetería.

## 🛠️ Stack Tecnológico y Arquitectura
*   **Frontend:** HTML5, CSS3 y JavaScript (Vanilla).
*   **Lógica de Cámara:** Librería `html5-qrcode`.
*   **Persistencia:** `localStorage` (Simulando la capa DAO de una base de datos).
*   **Arquitectura:** Patrón en capas (Presentación -> Lógica de Negocio (BO) -> Datos (DAO)).

## 🚀 Características Principales (Blindaje del Sistema)
1.  **Validación Antiduplicados (Anti-Fraude):** El sistema guarda el ID de cada residuo escaneado. Si un usuario intenta escanear el mismo código dos veces para farmear puntos, la capa DAO lo detecta y bloquea la transacción.
2.  **Validación Físico-Digital (Simulación IoT):** Para evitar que el usuario mienta sobre dónde depositó el residuo, los puntos **no se asignan** al escanear el producto. El sistema exige un segundo escaneo del código QR del contenedor inteligente (ej. `caneca_gris`). Si el residuo no coincide con la caneca, se rechazan los puntos.
3.  **Trazabilidad por Zonas:** El usuario registra la zona (Bloque A, Biblioteca, etc.) donde recicla, permitiendo al personal de logística optimizar rutas.
4.  **Panel de Logística (RF-04):** Monitoreo visual de la capacidad de los contenedores con alertas automáticas al llegar al 80%.

## ⚙️ ¿Cómo ejecutar el proyecto?
1. Clona este repositorio.
2. Abre el archivo `index.html` en tu navegador (Chrome/Edge).
3. **Credenciales de prueba:** Usuario: `ciudadano` | Contraseña: `123`.
4. **Prueba del Escáner (Doble Paso):**
   *   Genera un QR con la palabra `coca` (Residuo).
   *   Genera un QR con la palabra `caneca_blanca` (Contenedor).
   *   Escanea ambos en orden para validar el flujo y ganar puntos.
