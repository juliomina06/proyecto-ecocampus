// 1. ESTADO DE LA APLICACIÓN
let usuario = JSON.parse(localStorage.getItem('usuarioEco')) || {
    nombre: "Julio Mina",
    puntos: 0,
    historial: [],
    codigosUsados: [],
    co2Evitado: 0,
    aguaAhorrada: 0,
    plasticosReciclados: 0,
    logros: [],
    triviaCompletada: false
};


if (!usuario.codigosUsados) usuario.codigosUsados = [];

// 2. NAVEGACIÓN
function mostrarPantalla(idPantalla) {
    document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
    document.getElementById(idPantalla).classList.add('activa');
}

function mostrarToast(mensaje) {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.classList.remove('oculto');
    setTimeout(() => { toast.classList.add('oculto'); }, 3500);
}

// 3. LOGIN
function iniciarSesion() {
    const user = document.getElementById('usuario').value;
    const pass = document.getElementById('password').value;
    if ((user === "estudiante" || user === "ciudadano") && pass === "123") {
        document.getElementById('nombre-usuario').textContent = usuario.nombre;
        actualizarInterfaz();
        mostrarPantalla('pantalla-dashboard');
    } else {
        alert("Credenciales incorrectas. Usa: ciudadano / 123");
    }
}

function cerrarSesion() {
    mostrarPantalla('pantalla-login');
    document.getElementById('usuario').value = '';
    document.getElementById('password').value = '';
}

// 4. PUNTOS E HISTORIAL
function actualizarInterfaz() {
    document.getElementById('puntos-totales').textContent = usuario.puntos;
    const lista = document.getElementById('lista-historial');
    lista.innerHTML = ''; 
    if (usuario.historial.length === 0) {
        lista.innerHTML = '<li>Aún no has reciclado nada. ¡Anímate!</li>';
    } else {
        usuario.historial.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span><b>+${item.puntos} pts</b> - ${item.producto}</span> <small>📍 ${item.zona || 'N/A'}</small>`;
            lista.appendChild(li);
        });
    }
}

function agregarEcoPuntos(nombreProducto, puntosGanados) {
    usuario.puntos += puntosGanados;
    const zonaSeleccionada = document.getElementById('zona-selector') ? document.getElementById('zona-selector').value : 'General';
    const fechaActual = new Date().toLocaleDateString();
    usuario.historial.unshift({ producto: nombreProducto, puntos: puntosGanados, fecha: fechaActual, zona: zonaSeleccionada });
    localStorage.setItem('usuarioEco', JSON.stringify(usuario));
    actualizarInterfaz();
}

// 5. ESCÁNER NAV
function irAEscanner() {
    pasoEscaneo = "producto"; 
    document.getElementById('resultado-escaneo').classList.add('oculto');
    document.querySelector('.instruccion').textContent = "Apunta la cámara al código de barras o QR del producto.";
    mostrarPantalla('pantalla-escaner');
    iniciarCamara(); 
}

function volverAlDashboard() {
    detenerCamara(); 
    document.getElementById('resultado-escaneo').classList.add('oculto');
    mostrarPantalla('pantalla-dashboard');
}

// 6. CANJE
function abrirModalCanje() { document.getElementById('modal-canje').classList.remove('oculto'); }
function cerrarModalCanje() { document.getElementById('modal-canje').classList.add('oculto'); }

function canjearPuntos(costo, recompensa) {
    if (usuario.puntos >= costo) {
        usuario.puntos -= costo;
        localStorage.setItem('usuarioEco', JSON.stringify(usuario));
        actualizarInterfaz();
        registrarImpactoYLogros(null, true); // Desbloquea logro Impulsor Local
        cerrarModalCanje();

        // Generar Voucher QR para el comercio aliado
        const codigoUnico = `RF-${Date.now().toString().slice(-5)}`;
        document.getElementById('voucher-premio').textContent = `${recompensa} (-${costo} pts)`;
        document.getElementById('voucher-fecha').textContent = `Código: ${codigoUnico} | ${new Date().toLocaleString()}`;
        
        const qrBox = document.getElementById('voucher-qr');
        qrBox.innerHTML = '';
        new QRCode(qrBox, {
            text: `VOUCHER|${codigoUnico}|${recompensa}`,
            width: 140,
            height: 140,
            colorDark: "#264653",
            colorLight: "#ffffff"
        });

        document.getElementById('modal-voucher').classList.remove('oculto');
    } else {
        mostrarToast(`No tienes suficientes puntos. Necesitas ${costo} y tienes ${usuario.puntos}.`);
    }
}

function cerrarVoucher() {
    document.getElementById('modal-voucher').classList.add('oculto');
}


// 7. LOGÍSTICA
let contenedores = { plastico: 20, papel: 45 };
function irAAdmin() { mostrarPantalla('pantalla-admin'); actualizarBarras(); }

function actualizarBarras() {
    document.getElementById('porcentaje-plastico').textContent = `${contenedores.plastico}%`;
    const barraPlastico = document.getElementById('barra-plastico');
    barraPlastico.style.width = `${contenedores.plastico}%`;
    
    document.getElementById('porcentaje-papel').textContent = `${contenedores.papel}%`;
    const barraPapel = document.getElementById('barra-papel');
    barraPapel.style.width = `${contenedores.papel}%`;

    [barraPlastico, barraPapel].forEach(barra => {
        let valor = parseInt(barra.style.width);
        if (valor >= 80) barra.style.backgroundColor = '#C1121F';
        else if (valor >= 50) barra.style.backgroundColor = '#FF6B35';
        else barra.style.backgroundColor = 'var(--verde-principal)';
    });
}

function simularLlenado(tipo) {
    contenedores[tipo] += 15;
    if (contenedores[tipo] > 100) contenedores[tipo] = 100;
    actualizarBarras();
    if (contenedores[tipo] >= 80) mostrarToast(`⚠️ ¡ALERTA! Contenedor ${tipo.toUpperCase()} al ${contenedores[tipo]}%.`);
}

function vaciarContenedor(tipo) {
    contenedores[tipo] = 0;
    actualizarBarras();
    mostrarToast(`✅ Contenedor ${tipo} vaciado.`);
}

// 8. GENERADOR DE QR Y RESET
function resetearSistema() {
    if (confirm("¿Seguro que quieres borrar todos los datos?")) {
        localStorage.clear();
        location.reload();
    }
}

function generarQRAdmin() {
    // Limpiamos espacios en blanco y pasamos a minúsculas
    const id = document.getElementById('admin-id').value.trim().toLowerCase();
    const tipo = document.getElementById('admin-tipo').value;
    const puntos = parseInt(document.getElementById('admin-puntos').value);

    if (!id || isNaN(puntos)) {
        alert("Por favor, llena todos los campos.");
        return;
    }

    // Guardar en la configuración
    let configuraciones = JSON.parse(localStorage.getItem('configResiduos')) || {};
    configuraciones[id] = { material: tipo, puntos: puntos };
    localStorage.setItem('configResiduos', JSON.stringify(configuraciones));
    
    console.log("Guardado exitosamente en DB:", configuraciones); // Para debug

    // Generar QR
    const qrContainer = document.getElementById('qr-container');
    qrContainer.innerHTML = ''; 

    new QRCode(qrContainer, {
        text: id, // Usamos el ID limpio
        width: 200, 
        height: 200, 
        colorDark : "#264653",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    mostrarToast(`QR generado para: ${id}`);
    document.getElementById('admin-id').value = '';
    document.getElementById('admin-puntos').value = '';
}

// 9. MOTOR DE IMPACTO AMBIENTAL Y LOGROS
function registrarImpactoYLogros(material, esCanje = false) {
    if (!esCanje) {
        // Cálculo aproximado por unidad reciclada
        if (material === 'plastico') {
            usuario.co2Evitado += 80;
            usuario.aguaAhorrada += 2;
            usuario.plasticosReciclados += 1;
        } else if (material === 'papel' || material === 'carton') {
            usuario.co2Evitado += 50;
            usuario.aguaAhorrada += 5;
        } else if (material === 'vidrio') {
            usuario.co2Evitado += 120;
            usuario.aguaAhorrada += 1;
        }
    }

    // Evaluar desbloqueo de retos
    const desbloquear = (id, titulo) => {
        if (!usuario.logros.includes(id)) {
            usuario.logros.push(id);
            setTimeout(() => mostrarToast(`🏆 ¡Reto Desbloqueado: ${titulo}!`), 800);
        }
    };

    if (usuario.historial.length >= 1) desbloquear('primer', 'Primer Impacto');
    if (usuario.plasticosReciclados >= 3) desbloquear('plastico', 'Héroe del Plástico');
    if (usuario.co2Evitado >= 200) desbloquear('co2', 'Guardián del Aire');
    if (esCanje) desbloquear('comercio', 'Impulsor Local');

    localStorage.setItem('usuarioEco', JSON.stringify(usuario));
    actualizarInterfaz();
}

// Sobrescribimos actualización visual para pintar impacto y medallas
const actualizarInterfazBase = actualizarInterfaz;
actualizarInterfaz = function() {
    actualizarInterfazBase();
    if (document.getElementById('impacto-co2')) {
        document.getElementById('impacto-co2').textContent = `${usuario.co2Evitado || 0} g`;
        document.getElementById('impacto-agua').textContent = `${usuario.aguaAhorrada || 0} L`;
    }
    ['primer', 'plastico', 'co2', 'comercio'].forEach(id => {
        const el = document.getElementById(`reto-${id}`);
        if (el && usuario.logros && usuario.logros.includes(id)) {
            el.classList.remove('bloqueado');
        }
    });
};

// 10. MINIJUEGO EDUCATIVO: ECO-TRIVIA (RESOLUCIÓN 2184)
const preguntasTrivia = [
    { emoji: "🍕", item: "Caja de pizza con grasa", correcta: "negra", error: "La grasa contamina el cartón y daña el material del reciclador. ¡Va en la NEGRA!" },
    { emoji: "🧴", item: "Botella plástica limpia y seca", correcta: "blanca", error: "Al estar limpia y seca, es 100% aprovechable. ¡Va en la BLANCA!" },
    { emoji: "🍌", item: "Cáscaras de frutas y restos de comida", correcta: "verde", error: "Son residuos orgánicos aprovechables para compostaje. ¡Van en la VERDE!" },
    { emoji: "🧻", item: "Servilletas usadas o papel higiénico", correcta: "negra", error: "El papel usado con residuos biológicos no se recicla. ¡Va en la NEGRA!" },
    { emoji: "🥫", item: "Lata de gaseosa vacía", correcta: "blanca", error: "El aluminio es altamente reciclable si está vacío. ¡Va en la BLANCA!" }
];

let indiceTrivia = 0;
let aciertosTrivia = 0;

function abrirEcoTrivia() {
    indiceTrivia = 0;
    aciertosTrivia = 0;
    cargarPreguntaTrivia();
    document.getElementById('modal-trivia').classList.remove('oculto');
}

function cerrarEcoTrivia() {
    document.getElementById('modal-trivia').classList.add('oculto');
}

function cargarPreguntaTrivia() {
    const p = preguntasTrivia[indiceTrivia];
    document.getElementById('trivia-progreso').textContent = `Pregunta ${indiceTrivia + 1} de ${preguntasTrivia.length}`;
    document.getElementById('trivia-emoji').textContent = p.emoji;
    document.getElementById('trivia-item').textContent = p.item;
}

function responderTrivia(eleccion) {
    const p = preguntasTrivia[indiceTrivia];
    if (eleccion === p.correcta) {
        aciertosTrivia++;
        mostrarToast("✅ ¡Correcto! Así proteges el trabajo del reciclador.");
    } else {
        alert(`❌ ¡Ups! ${p.error}`);
    }

    indiceTrivia++;
    if (indiceTrivia < preguntasTrivia.length) {
        cargarPreguntaTrivia();
    } else {
        cerrarEcoTrivia();
        if (aciertosTrivia >= 4 && !usuario.triviaCompletada) {
            usuario.triviaCompletada = true;
            agregarEcoPuntos("Bono Educativo Eco-Trivia", 15);
            mostrarToast(`🎉 ¡Acertaste ${aciertosTrivia}/5! Ganaste +15 EcoPuntos.`);
        } else if (usuario.triviaCompletada) {
            mostrarToast(`🎯 ¡Acertaste ${aciertosTrivia}/5! Ya reclamaste tu bono educativo.`);
        } else {
            mostrarToast(`Acertaste ${aciertosTrivia}/5. ¡Consigue 4 o más para ganar +15 pts!`);
        }
    }
}

// 11. SEMÁFORO DE DISPONIBILIDAD Y RUTAS DE RECICLADORES
function actualizarSemaforoPuntos() {
    const indicador = document.getElementById('estado-punto');
    if (!indicador) return;

    if (contenedores.plastico >= 80 || contenedores.papel >= 80) {
        indicador.style.background = '#ffe5e5';
        indicador.style.color = '#C1121F';
        indicador.textContent = '🔴 Alerta: Un contenedor está casi lleno (>80%).';
    } else if (contenedores.plastico >= 50 || contenedores.papel >= 50) {
        indicador.style.background = '#fff3e0';
        indicador.style.color = '#e65100';
        indicador.textContent = '🟡 Punto Ecológico con ocupación media.';
    } else {
        indicador.style.background = 'var(--verde-claro)';
        indicador.style.color = 'var(--verde-oscuro)';
        indicador.textContent = '🟢 Punto Ecológico Disponible (Capacidad óptima)';
    }
}

// Enganchar semáforo cada vez que cambian las barras o se inicia sesión
const actualizarBarrasBase = actualizarBarras;
actualizarBarras = function() {
    actualizarBarrasBase();
    actualizarSemaforoPuntos();
};

function asignarRutaReciclador() {
    const bitacora = document.getElementById('bitacora-rutas');
    if (bitacora.innerHTML.includes('Sin rutas despachadas')) {
        bitacora.innerHTML = '';
    }

    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const li = document.createElement('li');
    li.style.fontSize = '0.75rem';
    li.innerHTML = `<span>✅ <b>Ruta #${Math.floor(100 + Math.random() * 900)}</b> asignada a Asorecicladores</span> <small>${hora}</small>`;
    bitacora.prepend(li);

    mostrarToast("🚛 Notificación enviada al reciclador de zona.");
}
