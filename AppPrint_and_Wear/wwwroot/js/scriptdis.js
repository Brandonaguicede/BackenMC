// ==========================================================
//  INICIALIZACIÓN PRINCIPAL
// ==========================================================

document.addEventListener('DOMContentLoaded', function () {
    console.log("🚀 Inicializando aplicación de diseño...");

    cargarCategorias();
    initializeViews();
    initializeSizeSelection();
    initializeTools();
    initializeBottomTools();
});

// ==========================================================
//  CARGAR CATEGORÍAS DESDE LA BASE DE DATOS
// ==========================================================

let categoriasGlobal = []; // Guardar categorías para usarlas en "Cambiar producto"

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
        categoriasGlobal = categorias; // Guardar para modal
        console.log("✅ Categorías obtenidas:", categorias);

        if (!categorias || categorias.length === 0) {
            contenedor.innerHTML = `
                <p style="color: #999; text-align: center; padding: 15px; font-size: 14px;">
                    📁 No hay categorías disponibles
                </p>
            `;
            return;
        }

        // Crear botones para cada categoría
        contenedor.innerHTML = categorias.map(c => `
            <button class="tool-button categoria-btn" data-id="${c.id}">
                📁 ${c.nombre}
            </button>
        `).join("");

        // Agregar eventos de clic
        document.querySelectorAll(".categoria-btn").forEach(btn => {
            btn.addEventListener("click", function () {
                document.querySelectorAll(".categoria-btn").forEach(b =>
                    b.classList.remove("active")
                );
                this.classList.add("active");

                const categoriaId = this.dataset.id;
                const categoriaNombre = this.textContent.trim();

                console.log(`✅ Categoría seleccionada: ${categoriaNombre} (ID: ${categoriaId})`);

                // Aquí puedes cargar productos de esa categoría
                // cargarProductosPorCategoria(categoriaId);
            });
        });

        // Inicializar botón "Cambiar producto" después de cargar categorías
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
    // Botones de herramientas
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

    // Botón de añadir imagen
    const addImageBtn = document.getElementById('add-image-btn');
    if (addImageBtn) {
        addImageBtn.addEventListener('click', function () {
            const imageUpload = document.getElementById('image-upload');
            if (imageUpload) imageUpload.click();
        });
    }

    // Carga de imágenes
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

                makeDraggable(wrapper);

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
}

// Función para añadir texto al diseño
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

// ==========================================================
//  ARRASTRE DE ELEMENTOS
// ==========================================================




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

    // Deshacer y Rehacer (puedes implementar lógica aquí)
    const undoBtn = document.getElementById("btnUndo");
    const redoBtn = document.getElementById("btnRedo");

    if (undoBtn) {
        undoBtn.addEventListener("click", () => {
            console.log("🔙 Deshacer acción");
            // Implementar lógica de deshacer
        });
    }

    if (redoBtn) {
        redoBtn.addEventListener("click", () => {
            console.log("🔜 Rehacer acción");
            // Implementar lógica de rehacer
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

    if (text.trim() === '') {
        alert('Por favor, escribe algún texto primero.');
        return;
    }

    const activeView = document.querySelector('.lawView.active');
    if (!activeView) return;

    const designArea = activeView.querySelector('.content-inner');
    if (!designArea) return;

    // Crear elemento de texto arrastrable y escalable
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

    // Agregar al área de diseño
    designArea.appendChild(textElement);

    // Hacer el texto arrastrable y escalable
    makeDraggableAndResizable(textElement);

    // Limpiar input
    textInput.value = '';

    console.log('Texto añadido correctamente');
}


function mostrarVistaPrevia() {
    const frontContent = document.getElementById('front-content-inner');
    const backContent = document.getElementById('back-content-inner');

    if (!frontContent || !backContent) {
        alert("Error: No se encontraron las áreas de diseño");
        return;
    }

    const modal = document.createElement("div");
    modal.className = "preview-modal";
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.4s ease;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 14px;
            padding: 30px;
            max-width: 900px;
            width: 90%;
            max-height: 85vh;
            overflow-y: auto;
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
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
                <div>
                    <h3 style="text-align: center; margin-bottom: 15px; color: #333;">Frente</h3>
                    <div style="position: relative; background: #f9f9f9; border-radius: 10px; padding: 20px;">
                        ${frontContent.innerHTML}
                    </div>
                </div>
                <div>
                    <h3 style="text-align: center; margin-bottom: 15px; color: #333;">Espalda</h3>
                    <div style="position: relative; background: #f9f9f9; border-radius: 10px; padding: 20px;">
                        ${backContent.innerHTML}
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector(".close-preview");
    closeBtn.addEventListener("click", () => {
        modal.remove();
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
    });
}



// Hacer disponible globalmente
window.addTextToDesign = addTextToDesign;