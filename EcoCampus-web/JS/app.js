// 1. ESTADO DE LA APLICACIÓN
let usuario = JSON.parse(localStorage.getItem('usuarioEco')) || {
    nombre: "Julio Mina",
    puntos: 0,
    historial: [],
    codigosUsados: []
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
        mostrarToast(`¡Disfruta tu ${recompensa}! (-${costo} pts)`);
        cerrarModalCanje();
    } else {
        mostrarToast(`No tienes suficientes puntos. Necesitas ${costo} y tienes ${usuario.puntos}.`);
    }
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