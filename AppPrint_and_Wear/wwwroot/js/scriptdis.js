//tiene que servir ahora si

// ==========================================================
//  INICIALIZACIÓN PRINCIPAL
// ==========================================================

document.addEventListener('DOMContentLoaded', function () {
    console.log("🚀 Inicializando aplicación de diseño...");

    // Agregar estilos necesarios para design-elements-layer
    const style = document.createElement('style');
    style.textContent = `
        .design-elements-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 150;
        }
        
        .design-elements-layer > * {
            pointer-events: auto !important;
        }
        
        .content-inner {
            pointer-events: none !important;
        }
    `;
  

    cargarCategorias();
    initializeViews();
    initializeSizeSelection();
    initializeTools();
    initializeBottomTools();
});

// ==========================================================
//  CARGAR CATEGORÍAS DESDE LA BASE DE DATOS
// ==========================================================

let categoriasGlobal = [];


async function cargarCategorias() {
    const contenedor = document.getElementById("categoriasContainer");

    if (!contenedor) {
        console.error("❌ No se encontró el contenedor de categorías");
        return;
    }

    console.log("📦 Cargando categorías desde el servidor...");

    try {
        const response = await fetch("/Categorias/ObtenerCategorias");

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const categorias = await response.json();
        categoriasGlobal = categorias;
        console.log("✅ Categorías obtenidas:", categorias);

        if (!categorias || categorias.length === 0) {
            contenedor.innerHTML = `
                <p style="color: #999; text-align: center; padding: 15px; font-size: 14px;">
                    📁 No hay categorías disponibles
                </p>
            `;
            return;
        }

        contenedor.innerHTML = categorias.map(c => `
            <button class="tool-button categoria-btn" data-id="${c.id}">
                📁 ${c.nombre}
            </button>
        `).join("");

        document.querySelectorAll(".categoria-btn").forEach(btn => {
            btn.addEventListener("click", function () {
                document.querySelectorAll(".categoria-btn").forEach(b =>
                    b.classList.remove("active")
                );
                this.classList.add("active");

                const categoriaId = this.dataset.id;
                const categoriaNombre = this.textContent.trim();

                console.log(`✅ Categoría seleccionada: ${categoriaNombre} (ID: ${categoriaId})`);
            });
        });

        initializeCambiarProducto();

        console.log(`✅ ${categorias.length} categorías cargadas exitosamente`);

    } catch (error) {
        console.error("❌ Error cargando categorías:", error);
        contenedor.innerHTML = `
            <div style="color: #e74c3c; padding: 15px; text-align: center; font-size: 14px;">
                <p style="margin-bottom: 5px;">⚠️ Error al cargar categorías</p>
                <small style="color: #999;">${error.message}</small>
            </div>
        `;
    }
}

function initializeCambiarProducto() {
    const changeProductBtn = document.getElementById('change-product-btn');
    if (!changeProductBtn) return;

    changeProductBtn.addEventListener('click', mostrarModalCategorias);
}

function mostrarModalCategorias() {
    const modalElement = document.getElementById('modalCategorias');
    if (!modalElement) return;

    const modalBootstrap = new bootstrap.Modal(modalElement, { backdrop: 'static', keyboard: false });
    modalBootstrap.show();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: fadeIn 0.3s ease, fadeOut 0.3s ease 2.5s forwards;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// ==========================================================
//  CAMBIO DE VISTAS (FRENTE/ESPALDA)
// ==========================================================

function initializeViews() {
    document.querySelectorAll('.view-button').forEach(button => {
        button.addEventListener('click', function () {
            document.querySelectorAll('.view-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.lawView').forEach(view => view.classList.remove('active'));

            this.classList.add('active');
            const view = this.getAttribute('data-view');
            const viewElement = document.getElementById(view + '-view');
            if (viewElement) {
                viewElement.classList.add('active');
            }
        });
    });
}

// ==========================================================
//  SELECCIÓN DE TALLAS
// ==========================================================

function initializeSizeSelection() {
    document.querySelectorAll('.size-option').forEach(option => {
        option.addEventListener('click', function () {
            document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            console.log('Talla seleccionada:', this.textContent);
        });
    });
}

// ==========================================================
//  HERRAMIENTAS (TEXTO E IMÁGENES)
// ==========================================================

function initializeTools() {
    document.querySelectorAll('.tool-button').forEach(button => {
        button.addEventListener('click', function () {
            if (this.getAttribute('data-tool')) {
                document.querySelectorAll('.tool-button').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                document.querySelectorAll('.text-editor').forEach(editor => editor.classList.remove('active'));

                const tool = this.getAttribute('data-tool');
                if (tool === 'text') {
                    const textEditor = document.getElementById('text-editor');
                    if (textEditor) textEditor.classList.add('active');
                }
            }
        });
    });

    const addImageBtn = document.getElementById('add-image-btn');
    if (addImageBtn) {
        addImageBtn.addEventListener('click', function () {
            const imageUpload = document.getElementById('image-upload');
            if (imageUpload) imageUpload.click();
        });
    }

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

                const wrapper = document.createElement('div');
                wrapper.className = 'arrastrable-escalable imagen-arrastrable';
                wrapper.style.cssText = `
                    position: absolute;
                    left: 50px;
                    top: 30px;
                    width: 100px;
                    height: 100px;
                    z-index: 200;
                    cursor: move;
                `;

                const img = document.createElement('img');
                img.src = event.target.result;
                img.style.cssText = `
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    pointer-events: none;
                `;

                wrapper.appendChild(img);
                activeView.appendChild(wrapper);

                hacerArrastrableYEscalable(wrapper);

                console.log('✅ Imagen cargada correctamente');
            };

            reader.onerror = function () {
                console.error('Error al leer el archivo');
                alert('Error al cargar la imagen. Inténtalo de nuevo.');
            };

            reader.readAsDataURL(file);
            e.target.value = '';
        });
    }

    // Vincular el botón de añadir texto
    const addTextBtn = document.getElementById('add-text-btn');
    if (addTextBtn) {
        addTextBtn.addEventListener('click', addTextToDesign);
    }
}

// ==========================================================
//  FUNCIÓN PARA AÑADIR TEXTO AL DISEÑO
// ==========================================================

function addTextToDesign() {
    const textInput = document.getElementById('design-text');
    const colorInput = document.getElementById('text-color');
    const fontInput = document.getElementById('font-family');

    if (!textInput || !colorInput || !fontInput) {
        console.error('Elementos de texto no encontrados');
        return;
    }

    const text = textInput.value.trim();
    const color = colorInput.value;
    const font = fontInput.value;

    if (text === '') {
        alert('Por favor, escribe algún texto primero.');
        return;
    }

    const activeView = document.querySelector('.lawView.active .design-elements-layer');
    if (!activeView) {
        console.error('No se encontró el área de diseño activa');
        return;
    }

    // Crear elemento de texto arrastrable
    const textElement = document.createElement('div');
    textElement.className = 'arrastrable-escalable texto-arrastrable';
    textElement.style.cssText = `
        position: absolute;
        left: 50px;
        top: 50px;
        color: ${color};
        font-family: ${font};
        font-size: 18px;
        font-weight: bold;
        cursor: move;
        z-index: 200;
        padding: 10px;
        background: rgba(255,255,255,0.8);
        border-radius: 5px;
        user-select: none;
    `;
    textElement.textContent = text;

    activeView.appendChild(textElement);

    // IMPORTANTE: Hacer el texto arrastrable y escalable
    hacerArrastrableYEscalable(textElement);

    // Limpiar input
    textInput.value = '';

    console.log('✅ Texto añadido correctamente');
}

// ==========================================================
//  MOVIMIENTO, ESCALADO Y ROTACIÓN DE ELEMENTOS
// ==========================================================

// ==========================================================
//  MOVIMIENTO, ESCALADO, ROTACIÓN Y ELIMINACIÓN DE ELEMENTOS
// ==========================================================

function hacerArrastrableYEscalable(elemento) {
    let isDragging = false;
    let isResizing = false;
    let isRotating = false;
    let offsetX, offsetY, startX, startY, startWidth, startHeight;

    elemento.style.position = "absolute";
    elemento.style.cursor = "move";
    elemento.style.userSelect = "none";
    elemento.style.transition = "transform 0.1s ease";

    // ======================================================
    // 🔷 CONTROLES (botones en esquinas)
    // ======================================================
    const controlsContainer = document.createElement("div");
    controlsContainer.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
    `;

    // 🔺 Rotar (arriba)
    const rotateHandle = document.createElement("div");
    rotateHandle.innerHTML = "↻";
    rotateHandle.style.cssText = `
        position: absolute;
        top: -25px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 18px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: auto;
        cursor: grab;
        box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    `;

    // 🔶 Redimensionar (abajo a la derecha)
    const resizeHandle = document.createElement("div");
    resizeHandle.innerHTML = "↔";
    resizeHandle.style.cssText = `
        position: absolute;
        right: -12px;
        bottom: -12px;
        font-size: 14px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 50%;
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: auto;
        cursor: se-resize;
        box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    `;

    // ❌ Eliminar (arriba derecha)
    const deleteHandle = document.createElement("div");
    deleteHandle.innerHTML = "🗑️";
    deleteHandle.style.cssText = `
        position: absolute;
        top: -25px;
        right: -25px;
        font-size: 18px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: auto;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    `;

    controlsContainer.appendChild(rotateHandle);
    controlsContainer.appendChild(resizeHandle);
    controlsContainer.appendChild(deleteHandle);
    elemento.appendChild(controlsContainer);

    // ======================================================
    // 🔹 MOVIMIENTO
    // ======================================================
    elemento.addEventListener("mousedown", (e) => {
        if ([rotateHandle, resizeHandle, deleteHandle].includes(e.target)) return;
        isDragging = true;
        const rect = elemento.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        elemento.style.zIndex = 1000;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const parent = elemento.parentElement.getBoundingClientRect();
            let x = e.clientX - parent.left - offsetX;
            let y = e.clientY - parent.top - offsetY;
            x = Math.max(0, Math.min(x, parent.width - elemento.offsetWidth));
            y = Math.max(0, Math.min(y, parent.height - elemento.offsetHeight));
            elemento.style.left = x + "px";
            elemento.style.top = y + "px";
        }

        if (isResizing) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            elemento.style.width = startWidth + dx + "px";
            elemento.style.height = startHeight + dy + "px";
        }

        if (isRotating) {
            const rect = elemento.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
            const deg = angle * (180 / Math.PI);
            elemento.style.transform = `rotate(${deg}deg)`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        isResizing = false;
        isRotating = false;
    });

    // ======================================================
    // 🔸 REDIMENSIÓN
    // ======================================================
    resizeHandle.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = elemento.offsetWidth;
        startHeight = elemento.offsetHeight;
    });

    // ======================================================
    // 🔸 ROTACIÓN
    // ======================================================
    rotateHandle.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        isRotating = true;
    });

    // ======================================================
    // 🔸 ELIMINAR
    // ======================================================
    deleteHandle.addEventListener("click", (e) => {
        e.stopPropagation();
        if (confirm("¿Eliminar este elemento del diseño?")) {
            elemento.remove();
            console.log("🗑️ Elemento eliminado");
        }
    });

    // ======================================================
    // 🔸 Mostrar/ocultar controles al pasar el mouse
    // ======================================================
    elemento.addEventListener("mouseenter", () => {
        controlsContainer.style.display = "block";
        elemento.style.outline = "1px dashed #555";
    });

    elemento.addEventListener("mouseleave", () => {
        controlsContainer.style.display = "none";
        elemento.style.outline = "none";
    });

    controlsContainer.style.display = "none"; // ocultar por defecto
}


// ==========================================================
//  BOTONES INFERIORES (ZOOM, DESHACER, ETC.)
// ==========================================================

function initializeBottomTools() {
    // Zoom
    let zoomLevel = 1;
    const zoomBtn = document.getElementById("btnZoom");
    const designArea = document.querySelector(".design-area");

    if (zoomBtn && designArea) {
        zoomBtn.addEventListener("click", () => {
            zoomLevel += 0.2;
            if (zoomLevel > 1.6) zoomLevel = 1;
            designArea.style.transform = `scale(${zoomLevel})`;
            designArea.style.transition = "transform 0.4s ease";
        });
    }

    // Deshacer
    const undoBtn = document.getElementById("btnUndo");
    if (undoBtn) {
        undoBtn.addEventListener("click", () => {
            console.log("🔙 Deshacer acción");
        });
    }

    // Rehacer
    const redoBtn = document.getElementById("btnRedo");
    if (redoBtn) {
        redoBtn.addEventListener("click", () => {
            console.log("🔜 Rehacer acción");
        });
    }

    // Vista previa
    const previewBtn = document.getElementById("btnPreview");
    if (previewBtn) {
        previewBtn.addEventListener("click", mostrarVistaPrevia);
    }

    // Seleccionar todo
    const selectAllBtn = document.getElementById("btnSelectAll");
    if (selectAllBtn) {
        selectAllBtn.addEventListener("click", () => {
            document.querySelectorAll(".arrastrable-escalable").forEach(el => {
                el.style.outline = "2px dashed #3498db";
            });
            console.log("🖱️ Todos los elementos seleccionados");
        });
    }
}

// ==========================================================
//  VISTA PREVIA
// ==========================================================

function mostrarVistaPrevia() {
    const frontView = document.getElementById('front-view');
    const backView = document.getElementById('back-view');

    if (!frontView || !backView) {
        alert("Error: no se encontraron las vistas del diseño.");
        return;
    }

    // Clonar las vistas completas (camisa + contenido)
    const frontClone = frontView.cloneNode(true);
    const backClone = backView.cloneNode(true);

    // Eliminar clases que puedan ocultar algo
    frontClone.classList.remove("active");
    backClone.classList.remove("active");

    // Asegurar que las imágenes y los elementos se vean igual
    [frontClone, backClone].forEach(clone => {
        clone.style.pointerEvents = "none";
        clone.style.transform = "scale(0.8)";
        clone.style.transformOrigin = "top center";
        clone.querySelectorAll(".arrastrable-escalable").forEach(el => {
            el.style.border = "none";
            el.style.cursor = "default";
        });
    });

    // Crear modal
    const modal = document.createElement("div");
    modal.className = "preview-modal";
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        animation: fadeIn 0.3s ease;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 16px;
            padding: 30px;
            max-width: 1000px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 0 25px rgba(0,0,0,0.2);
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="color: #2c3e50; font-size: 1.5rem;">Vista previa del diseño</h2>
                <span class="close-preview" style="
                    font-size: 28px;
                    cursor: pointer;
                    color: #555;
                    transition: color 0.3s;
                ">&times;</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <div style="text-align:center;">
                    <h3 style="margin-bottom: 15px; color: #333;">Frente</h3>
                    <div class="preview-shirt" style="background:#f7f7f7; border-radius:12px; padding:15px; display:flex; justify-content:center;">
                    </div>
                </div>
                <div style="text-align:center;">
                    <h3 style="margin-bottom: 15px; color: #333;">Espalda</h3>
                    <div class="preview-shirt" style="background:#f7f7f7; border-radius:12px; padding:15px; display:flex; justify-content:center;">
                    </div>
                </div>
            </div>
        </div>
    `;

    // Insertar clones en los contenedores del modal
    const previewShirts = modal.querySelectorAll(".preview-shirt");
    previewShirts[0].appendChild(frontClone);
    previewShirts[1].appendChild(backClone);

    document.body.appendChild(modal);

    // Cerrar el modal
    const closeBtn = modal.querySelector(".close-preview");
    closeBtn.addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
    });
}







// Hacer disponible globalmente
window.addTextToDesign = addTextToDesign;