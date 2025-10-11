// ==========================================
// JAVASCRIPT PARA PERSONALIZACIÓN DE CAMISETAS
// ==========================================

// Variables globales
let currentColor = '#ffffff';
let currentStyle = 'roundNeck';
let currentPosition = 'frente';

// ==========================================
// CAMBIAR COLOR DE LA CAMISETA (IMAGEN REAL)
// ==========================================
document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', function () {
        // Quitar selección previa
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');

        // Tomar color
        currentColor = this.getAttribute('data-color');
        const colorName = this.getAttribute('title').toLowerCase();
        document.getElementById('colorInput').value = colorName;

        // [CAMBIO CLAVE: Aplicar color a la capa de coloración]
        const colorLayer = document.getElementById('shirtColorLayer');
        if (colorLayer) {
            // Aplicamos el color HEX exacto a la capa superpuesta
            colorLayer.style.backgroundColor = currentColor;

            // Opcional: Si necesitas remover el filtro CSS de la imagen base:
            // document.getElementById('shirtBase').style.filter = 'none';
        }

        // Ajustar color del texto según fondo
        adjustTextColor(currentColor);

        calcularPrecio();
    });
});






// ==========================================
// CAMBIAR ESTILO DE CAMISETA
// ==========================================
document.querySelectorAll('.style-option').forEach(option => {
    option.addEventListener('click', function () {
        // Remover selección anterior
        document.querySelectorAll('.style-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');

        // Ocultar todos los estilos
        document.querySelectorAll('.shirt-style').forEach(style => {
            style.style.display = 'none';
        });

        // Mostrar estilo seleccionado
        const svgId = this.getAttribute('data-svg');
        currentStyle = svgId;
        document.getElementById(svgId).style.display = 'block';

        // Aplicar color actual
        document.querySelectorAll(`#${svgId} path, #${svgId} ellipse`).forEach(el => {
            if (el.getAttribute('fill') !== 'none') {
                el.setAttribute('fill', currentColor);
            }
        });

        // Guardar en input
        const styleName = this.getAttribute('data-style');
        document.getElementById('styleInput').value = styleName;

        calcularPrecio();
    });
});

// ==========================================
// CAMBIAR POSICIÓN DEL DISEÑO
// ==========================================
document.querySelectorAll('.position-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.position-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        currentPosition = this.getAttribute('data-position');
        document.getElementById('posicionInput').value = currentPosition;

        // Ajustar visualmente la posición
        const designArea = document.getElementById('designArea');
        if (currentPosition === 'espalda') {
            designArea.style.opacity = '0.7';
            designArea.style.transform = 'translate(-50%, -50%)';
        } else if (currentPosition === 'manga') {
            designArea.style.transform = 'translate(-120%, -50%) scale(0.6)';
            designArea.style.opacity = '1';
        } else {
            designArea.style.opacity = '1';
            designArea.style.transform = 'translate(-50%, -50%)';
        }
    });
});

// ==========================================
// SUBIR LOGO/IMAGEN
// ==========================================
const uploadArea = document.getElementById('uploadArea');
const logoInput = document.getElementById('logoInput');
const logoPreview = document.getElementById('logoPreview');

// Click en área de upload
uploadArea.addEventListener('click', () => logoInput.click());

// Drag over
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

// Drag leave
uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

// Drop
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageUpload(file);
    }
});

// Change en input file
logoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageUpload(file);
    }
});

// Función para manejar la subida de imagen
function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        logoPreview.src = e.target.result;
        logoPreview.style.display = 'block';
        document.getElementById('imagenEstampadoInput').value = e.target.result;
        calcularPrecio();
    };
    reader.readAsDataURL(file);
}

// ==========================================
// TEXTO PERSONALIZADO
// ==========================================
document.getElementById('textoInput').addEventListener('input', function () {
    document.getElementById('textPreview').textContent = this.value;
    calcularPrecio();
});

// ==========================================
// CALCULAR PRECIO
// ==========================================
document.getElementById('tipoEstampadoInput').addEventListener('change', calcularPrecio);
document.getElementById('cantidadInput').addEventListener('input', calcularPrecio);

function calcularPrecio() {
    let precio = 25.00;

    const texto = document.getElementById('textoInput').value;
    const tipoEstampado = document.getElementById('tipoEstampadoInput').value;
    const cantidad = parseInt(document.getElementById('cantidadInput').value) || 1;
    const tieneImagen = document.getElementById('logoPreview').style.display === 'block';

    // Agregar costo por texto
    if (texto.length > 0) precio += 3.00;

    // Agregar costo por tipo de estampado
    if (tipoEstampado === 'vinilo' || tipoEstampado === 'sublimacion') {
        precio += 5.00;
    } else if (tipoEstampado === 'bordado') {
        precio += 8.00;
    }

    // Agregar costo por imagen
    if (tieneImagen) precio += 10.00;

    // Calcular total
    const total = precio * cantidad;
    document.getElementById('precioTotal').textContent = '$' + total.toFixed(2);
}

// ==========================================
// AJUSTAR COLOR DE TEXTO SEGÚN FONDO
// ==========================================
function adjustTextColor(bgColor) {
    const textEl = document.getElementById('textPreview');

    // Convertir hex a RGB
    const r = parseInt(bgColor.substr(1, 2), 16);
    const g = parseInt(bgColor.substr(3, 2), 16);
    const b = parseInt(bgColor.substr(5, 2), 16);

    // Calcular brillo (fórmula de luminosidad)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Si el fondo es claro, texto oscuro. Si es oscuro, texto claro
    textEl.style.color = brightness > 128 ? '#000000' : '#ffffff';
    textEl.style.textShadow = brightness > 128
        ? '1px 1px 2px rgba(255,255,255,0.5)'
        : '1px 1px 2px rgba(0,0,0,0.5)';
}

// ==========================================
// ARRASTRAR LOGO
// ==========================================
let isDragging = false;
let startX, startY;

logoPreview.addEventListener('mousedown', function (e) {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    logoPreview.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', function (e) {
    if (isDragging) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        logoPreview.style.position = 'relative';
        logoPreview.style.left = deltaX + 'px';
        logoPreview.style.top = deltaY + 'px';
    }
});

document.addEventListener('mouseup', function () {
    if (isDragging) {
        isDragging = false;
        logoPreview.style.cursor = 'move';
    }
});

// Prevenir comportamiento por defecto del drag
logoPreview.addEventListener('dragstart', (e) => {
    e.preventDefault();
});

// ==========================================
// INICIALIZAR AL CARGAR LA PÁGINA
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    // Calcular precio inicial
    calcularPrecio();

    console.log('✅ Personalizador de camisetas cargado correctamente');
});