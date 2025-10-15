// Cambiar vistas (frente, espalda, etc.)
document.querySelectorAll('.view-button').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.view-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.lawView').forEach(view => {
            view.classList.remove('active');
        });

        this.classList.add('active');
        const view = this.getAttribute('data-view');
        document.getElementById(view + '-view').classList.add('active');
    });
});
const shirtImages = {
    "#3498db": {
        front: "/imagenes/azulFront.jpg",
        back: "https://www.positivos.com/tshirtecommerce/uploaded/Productos/camisetas_corta/dg-designer-9185f3ec149658293335791620510169032.jpg" //azul
    },
    "#ff0000": {
        front: "/imagenes/redFront.jpg",
        back: "https://www.positivos.com/tshirtecommerce/uploaded/Productos/camisetas_corta/dg-designer-97f081d3149658293546028289311086456.jpg" //rojo
    },
    "#194f29": {
        front: "/imagenes/VerdeOsFront.jpg", //verde
        back: "https://www.positivos.com/tshirtecommerce/uploaded/Productos/camisetas_corta/dg-designer-10787834149658293774111254010514196.jpg"
    },
    "#f1c40f": {
        front: "/imagenes/amarilloFront.jpg",
        back: "https://www.positivos.com/tshirtecommerce/uploaded/Productos/camisetas_corta/dg-designer-39cec6d414965829304972392161077508.jpg" //amarillo
    },
    "#9b59b6": {
        front: "/imagenes/moradoFront.jpg",
        back: "https://www.positivos.com/tshirtecommerce/uploaded/Productos/camisetas_corta/dg-designer-6d0c9328149658293640392635210986806.jpg" //morado
    },
    "#1abc9c": {
        front: "/imagenes/VerdeFront.jpg",
        back: "https://www.positivos.com/tshirtecommerce/uploaded/Productos/camisetas_corta/dg-designer-1e5186bc149658293650939966010101862.jpg" //turquesa
    },
    "#000000": {
        front: "/imagenes/negro.jpg",
        back: "/imagenes/negrotras.jpg" //negro
    },
    "#e67e22": {
        front: "/imagenes/naranjaFron.jpg",
        back: "https://www.positivos.com/tshirtecommerce/uploaded/Productos/camisetas_corta/dg-designer-33b3214d149658293523773788910288604.jpg" //naranja
    },
    "#ffffff": {
        front: "/imagenes/blanco.jpg",
        back: "https://www.positivos.com/tshirtecommerce/uploaded/Productos/camisetas_corta/dg-designer-421b3ac5149658293155344928010112072.jpg" //blanco
    }
}; 

// Funcionalidad de selección de colores
document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', function () {
        document.querySelectorAll('.color-option').forEach(opt => {
            opt.classList.remove('active');
        });
        this.classList.add('active');
        // Obtener el color en formato HEX y minúsculas
        const color = this.style.backgroundColor;
        const hexColor = rgbToHex(color).toLowerCase();

        if (shirtImages[hexColor]) {
            document.getElementById('front-shirt-img').src = shirtImages[hexColor].front;
            document.getElementById('back-shirt-img').src = shirtImages[hexColor].back;
        } else {
            // Opcional: para depuración
            console.log("Color no encontrado:", hexColor);
        }
    });
});
// 🧼 Botón para borrar color y volver al default (blanco)
const btnResetColor = document.getElementById("btnResetColor");
if (btnResetColor) {
    btnResetColor.addEventListener("click", () => {
        // Quitar selección activa
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));

        // Restablecer imágenes base
        const defaultFront = "/imagenes/blanco.jpg";
        const defaultBack = "/imagenes/blancotras.jpg";
        document.getElementById('front-shirt-img').src = defaultFront;
        document.getElementById('back-shirt-img').src = defaultBack;

        console.log("Color restablecido al predeterminado.");
    });
}


function rgbToHex(rgb) {
    if (!rgb) return "";
    rgb = rgb.trim();
    if (rgb.startsWith('#')) return rgb.toLowerCase();
    const rgbArr = rgb.match(/\d+/g);
    if (!rgbArr) return rgb;
    return "#" + rgbArr.map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join('');
}


// Funcionalidad de selección de tallas
// Funcionalidad de opciones de tamaño
document.querySelectorAll('.size-option').forEach(option => {
    option.addEventListener('click', function () {
        document.querySelectorAll('.size-option').forEach(opt => {
            opt.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// Funcionalidad de botones de herramientas
document.querySelectorAll('.tool-button').forEach(button => {
    button.addEventListener('click', function () {
        if (this.getAttribute('data-tool')) {
            document.querySelectorAll('.tool-button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');

            // Mostrar/ocultar editores
            document.querySelectorAll('.text-editor').forEach(editor => {
                editor.classList.remove('active');
            });

            const tool = this.getAttribute('data-tool');
            if (tool === 'text') {
                const textEditor = document.getElementById('text-editor');
                if (textEditor) {
                    textEditor.classList.add('active');
                }
            }
        }
    });
});

// Función para añadir texto al diseño
function addTextToDesign() {
    const textInput = document.getElementById('design-text');
    const colorInput = document.getElementById('text-color');
    const fontInput = document.getElementById('font-family');

    if (!textInput || !colorInput || !fontInput) {
        console.error('Elementos de texto no encontrados');
        return;
    }

    const text = textInput.value;
    const color = colorInput.value;
    const font = fontInput.value;

    if (text.trim() !== '') {
        const activeView = document.querySelector('.lawView.active');
        if (activeView) {
            const designArea = activeView.querySelector('.content-inner');
            if (designArea) {
                // Crear elemento de texto arrastrable
                const textElement = document.createElement('div');
                textElement.className = 'arrastrable-escalable';
                textElement.style.position = 'absolute';
                textElement.style.left = '50px';
                textElement.style.top = '50px';
                textElement.style.color = color;
                textElement.style.fontFamily = font;
                textElement.style.fontSize = '18px';
                textElement.style.fontWeight = 'bold';
                textElement.style.cursor = 'move';
                textElement.style.zIndex = '100';
                textElement.style.padding = '10px';
                textElement.style.background = 'rgba(255,255,255,0.8)';
                textElement.style.borderRadius = '5px';
                textElement.textContent = text;
                textElement.contentEditable = 'false';

                designArea.appendChild(textElement);

                // Limpiar el input de texto
                textInput.value = '';

                console.log('Texto añadido correctamente');
            }
        }
    } else {
        alert('Por favor, escribe algún texto primero.');
    }
}

// Event listener para botón de imagen
const addImageBtn = document.getElementById('add-image-btn');
if (addImageBtn) {
    addImageBtn.addEventListener('click', function () {
        const imageUpload = document.getElementById('image-upload');
        if (imageUpload) {
            imageUpload.click();
        }
    });
}

let isDragging = false;
let currentElement = null;
let offsetX, offsetY;

// Solo aplicar arrastre a elementos con la clase específica
document.addEventListener('mousedown', function (e) {
    // Verificar si se hizo clic en un elemento arrastrable
    const arrastrable = e.target.closest('.arrastrable-escalable');

    if (arrastrable && !e.target.classList.contains('resizer-handle')) {
        startDragElement(e, arrastrable);
    }
});

function startDragElement(e, element) {
    isDragging = true;
    currentElement = element;

    // Calcular offset relativo al elemento
    const rect = element.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // Aplicar estilos para el arrastre
    element.style.cursor = 'grabbing';
    element.style.zIndex = '1000';
    element.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';

    document.addEventListener('mousemove', dragElement);
    document.addEventListener('mouseup', stopDragElement);
    e.preventDefault();
    e.stopPropagation();
}

function dragElement(e) {
    if (!isDragging || !currentElement) return;

    const parent = currentElement.parentElement; // content-inner
    const parentRect = parent.getBoundingClientRect();

    // Calcular nueva posición
    let newX = e.clientX - parentRect.left - offsetX;
    let newY = e.clientY - parentRect.top - offsetY;

    // Limitar dentro del contenedor padre (content-inner)
    const elementRect = currentElement.getBoundingClientRect();
    const maxX = parentRect.width - elementRect.width;
    const maxY = parentRect.height - elementRect.height;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    currentElement.style.left = newX + 'px';
    currentElement.style.top = newY + 'px';
}

function stopDragElement() {
    if (currentElement) {
        currentElement.style.cursor = 'move';
        currentElement.style.zIndex = '200';
        currentElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    }
    isDragging = false;
    currentElement = null;
    document.removeEventListener('mousemove', dragElement);
    document.removeEventListener('mouseup', stopDragElement);
}

// ========== SISTEMA DE CARGA DE IMÁGENES CORREGIDO ==========

const imageUpload = document.getElementById('image-upload');
if (imageUpload) {
    imageUpload.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecciona un archivo de imagen válido.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
        const activeView = document.querySelector('.lawView.active .content-inner');
        if (!activeView) {
            console.error('No se encontró el área de diseño activa');
            return;
        }

            // Crear contenedor para la imagen
            const wrapper = document.createElement('div');
            wrapper.className = 'arrastrable-escalable imagen-arrastrable';
            wrapper.style.position = 'absolute';
            wrapper.style.left = '50px';
            wrapper.style.top = '30px';
            wrapper.style.width = '100px';
            wrapper.style.height = '100px';
            wrapper.style.zIndex = '200';

            // Crear la imagen
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            img.style.pointerEvents = 'none'; // Los eventos van al wrapper

            // Crear handle de redimensionamiento
            const resizer = document.createElement('div');
            resizer.className = 'resizer-handle';

            // Añadir elementos al wrapper
            wrapper.appendChild(img);
            wrapper.appendChild(resizer);

            // Añadir al área de diseño
            activeView.appendChild(wrapper);

            // Hacer redimensionable
            makeResizable(wrapper, resizer);

            console.log('Imagen cargada correctamente');
    };

            reader.onerror = function () {
                console.error('Error al leer el archivo');
                alert('Error al cargar la imagen. Inténtalo de nuevo.');
            };

        reader.readAsDataURL(file);
        e.target.value = '';
    });
}


// Función de redimensionamiento 


function makeResizable(element, resizer) {
    let isResizing = false;
    let startX, startY;
    let startWidth, startHeight;

    resizer.addEventListener('mousedown', function (e) {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
        e.stopPropagation();
        e.preventDefault();
    });

    function resize(e) {
        if (!isResizing) return;

        let newWidth = startWidth + (e.clientX - startX);
        let newHeight = startHeight + (e.clientY - startY);

        // Obtener el tamaño del área de diseño padre
        const parent = element.parentElement;
        const parentRect = parent.getBoundingClientRect();

        // Limitar el tamaño al 80% del área de diseño como máximo
        const maxWidth = parentRect.width * 0.8;
        const maxHeight = parentRect.height * 0.8;

        // Tamaños mínimos y máximos relativos al contenedor
        newWidth = Math.max(30, Math.min(newWidth, maxWidth));
        newHeight = Math.max(30, Math.min(newHeight, maxHeight));

        element.style.width = newWidth + 'px';
        element.style.height = newHeight + 'px';
    }

    function stopResize() {
        isResizing = false;
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }
}
document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', function () {
        document.querySelectorAll('.color-option').forEach(opt => {
            opt.classList.remove('active');
        });
        this.classList.add('active');
        const color = this.style.backgroundColor;
        const hexColor = rgbToHex(color).toLowerCase();

        if (shirtImages[hexColor]) {
            document.getElementById('front-shirt-img').src = shirtImages[hexColor].front;
            document.getElementById('back-shirt-img').src = shirtImages[hexColor].back;
        } else {
            console.log("Color no encontrado:", hexColor);
        }
    });
});

// =====================================
// 🔧 BOTONES DE LA BARRA INFERIOR
// =====================================

// Variables globales para historial
let historyStack = [];
let redoStack = [];

// Guardar estado actual
function saveSnapshot() {
    const front = document.getElementById('front-content-inner').innerHTML;
    const back = document.getElementById('back-content-inner').innerHTML;
    historyStack.push({ front, back });
    redoStack = [];
    if (historyStack.length > 20) historyStack.shift(); // limitar tamaño
}

// Restaurar un estado previo
function restoreSnapshot(snapshot) {
    if (!snapshot) return;
    document.getElementById('front-content-inner').innerHTML = snapshot.front;
    document.getElementById('back-content-inner').innerHTML = snapshot.back;
}

// ==========================
// 🔍 ZOOM
// ==========================
let zoomed = false;
const btnZoom = document.getElementById('btnZoom');
if (btnZoom) {
    btnZoom.addEventListener('click', () => {
        const previewPanel = document.querySelector('.preview-panel');
        if (!previewPanel) return;

        zoomed = !zoomed;
        previewPanel.style.transition = 'transform 0.3s ease';
        previewPanel.style.transformOrigin = 'center center';
        previewPanel.style.transform = zoomed ? 'scale(1.3)' : 'scale(1)';
        btnZoom.innerHTML = zoomed
            ? '<i class="fa fa-search-minus"></i> Restaurar Zoom'
            : '<i class="fa fa-search-plus"></i> Zoom';
    });
}

// ==========================
// ↩️ DESHACER
// ==========================
const btnUndo = document.getElementById('btnUndo');
if (btnUndo) {
    btnUndo.addEventListener('click', () => {
        if (historyStack.length > 1) {
            const current = historyStack.pop();
            redoStack.push(current);
            const last = historyStack[historyStack.length - 1];
            restoreSnapshot(last);
            console.log("↩️ Deshacer ejecutado");
        } else {
            console.log("⚠️ No hay más pasos para deshacer");
        }
    });
}

// ==========================
// ↪️ REHACER
// ==========================
const btnRedo = document.getElementById('btnRedo');
if (btnRedo) {
    btnRedo.addEventListener('click', () => {
        if (redoStack.length > 0) {
            const redoAction = redoStack.pop();
            historyStack.push(redoAction);
            restoreSnapshot(redoAction);
            console.log("↪️ Rehacer ejecutado");
        } else {
            console.log("⚠️ No hay pasos para rehacer");
        }
    });
}

// ==========================
// 👁️ PREVIO
// ==========================
const btnPreview = document.getElementById('btnPreview');
if (btnPreview) {
    btnPreview.addEventListener('click', () => {
        const overlays = document.querySelectorAll('.design-area-overlay');
        overlays.forEach(o => o.classList.toggle('ocultar-overlay'));
        const active = overlays[0].classList.contains('ocultar-overlay');
        btnPreview.innerHTML = active
            ? '<i class="fa fa-eye-slash"></i> Mostrar guías'
            : '<i class="fa fa-eye"></i> Previo';
        console.log("👁️ Vista previa alternada");
    });
}

// ==========================
// 🧩 SELECCIONAR TODO
// ==========================
const btnSelectAll = document.getElementById('btnSelectAll');
if (btnSelectAll) {
    btnSelectAll.addEventListener('click', () => {
        const elementos = document.querySelectorAll('.arrastrable-escalable');
        elementos.forEach(e => e.classList.add('seleccionado'));
        setTimeout(() => {
            elementos.forEach(e => e.classList.remove('seleccionado'));
        }, 1200);
        console.log("🧩 Todos los elementos seleccionados");
    });
}

// Guardar automáticamente tras cada acción
document.addEventListener('mouseup', saveSnapshot);
document.addEventListener('keyup', saveSnapshot);

