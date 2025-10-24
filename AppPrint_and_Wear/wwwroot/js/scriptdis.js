// ==========================================================
//  INICIALIZACIÓN PRINCIPAL
// ==========================================================
document.addEventListener('DOMContentLoaded', function () {
    console.log("🚀 Inicializando aplicación de diseño...");

    // Llama a las funciones principales que preparan la interfaz
    cargarCategorias();
    initializeViews();
    initializeSizeSelection();
    initializeTools();
    initializeBottomTools();
});

// ==========================================================
//  CARGAR CATEGORÍAS DESDE LA BASE DE DATOS
// ==========================================================
// Variable global para almacenar las categorías obtenidas del servidor
let categoriasGlobal = [];



// =======================================================================
// Función principal que obtiene las categorías y las muestra en pantalla
// =======================================================================
async function cargarCategorias() {

    // Busca el contenedor HTML donde se mostrarán las categorías
    const contenedor = document.getElementById("categoriasContainer");

    // Si no se encuentra el contenedor, se muestra un error en la consola
    if (!contenedor) {
        console.error("❌ No se encontró el contenedor de categorías");
        return;
    }

    console.log("📦 Cargando categorías desde el servidor...");

    try {
        // Realiza una solicitud HTTP GET al backend para obtener las categorías
        const response = await fetch("/Categorias/ObtenerCategorias");

        // Si la respuesta del servidor no es correcta lanza un error
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        // Convierte la respuesta JSON en un array de objetos js
        const categorias = await response.json();

        // Guarda las categorías globalmente para poder reutilizarlas
        categoriasGlobal = categorias;
        console.log("✅ Categorías obtenidas:", categorias);


        // Si no hay categorías disponibles, muestra un mensaje en el contenedor
        if (!categorias || categorias.length === 0) {
            contenedor.innerHTML = `
                <p style="color: #999; text-align: center; padding: 15px; font-size: 14px;">
                    📁 No hay categorías disponibles
                </p>
            `;
            return;
        }


        // Crea los botones HTML de cada categoría usando .map()
        contenedor.innerHTML = categorias.map(c => `
            <button class="tool-button categoria-btn" data-id="${c.id}">
                📁 ${c.nombre}
            </button>
        `).join("");

        // Agrega un evento de clic a cada botón generado
        document.querySelectorAll(".categoria-btn").forEach(btn => {
            btn.addEventListener("click", function () {

                // Quita la clase "active" de todos los botones
                document.querySelectorAll(".categoria-btn").forEach(b =>
                    b.classList.remove("active")
                );

                // Marca este botón como activo
                this.classList.add("active");

                // Obtiene el ID y nombre de la categoría seleccionada
                const categoriaId = this.dataset.id;
                const categoriaNombre = this.textContent.trim();


                // Muestra qué categoría se seleccionó
                console.log(`✅ Categoría seleccionada: ${categoriaNombre} (ID: ${categoriaId})`);
            });
        });

        // Llama a otra función que cambia el producto o recarga los productos según la categoría
        initializeCambiarProducto();

        console.log(`✅ ${categorias.length} categorías cargadas exitosamente`);

    } catch (error) {

        // se muestra el mensaje de error 
        console.error("❌ Error cargando categorías:", error);
        contenedor.innerHTML = `
            <div style="color: #e74c3c; padding: 15px; text-align: center; font-size: 14px;">
                <p style="margin-bottom: 5px;">⚠️ Error al cargar categorías</p>
                <small style="color: #999;">${error.message}</small>
            </div>
        `;
    }
}


// ==========================================================
//  Funsión para cambiar de categoría
// ==========================================================
function initializeCambiarProducto() {

    // Busca el botón que permite cambiar de producto (por su ID)
    const changeProductBtn = document.getElementById('change-product-btn');
    if (!changeProductBtn) return;


    // Si el botón sí existe, le asigna un evento al hacer clic
    // Al presionar, se mostrará el modal de categorías
    changeProductBtn.addEventListener('click', mostrarModalCategorias);
}



// ==========================================================
//  Funsion de mostrar categorias 
// ==========================================================
function mostrarModalCategorias() {

    // Busca el modal de categorías en el documento
    const modalElement = document.getElementById('modalCategorias');
    if (!modalElement) return;

    // Crea una instancia de Bootstrap Modal con ciertas configuraciones:
    //  backdrop: 'static' que evita que el usuario cierre el modal haciendo clic fuera
    //  keyboard: false que evita que se cierre presionando la tecla ESC
    const modalBootstrap = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
    });

    //muestra el mpodal
    modalBootstrap.show();
}

function showNotification(message) {

    // Crea dinámicamente un nuevo elemento <div> que servirá como notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Después de 3 segundos (3000 milisegundos), elimina la notificación del DOM
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

            // Obtiene el valor de data-view (por ejemplo 'front' o 'back')
            const view = this.getAttribute('data-view');

            // Busca el elemento de la vista correspondiente usando el ID
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
    // Selecciona todas las opciones de talla
    document.querySelectorAll('.size-option').forEach(option => {
        option.addEventListener('click', function () {
            document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));

            // Activa la opción que se presionó
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


                // Obtiene la herramienta seleccionada
                const tool = this.getAttribute('data-tool');
                if (tool === 'text') {
                    const textEditor = document.getElementById('text-editor');
                    if (textEditor) textEditor.classList.add('active');
                }
            }
        });
    });

    // BOTÓN PARA AÑADIR IMAGEN
    const addImageBtn = document.getElementById('add-image-btn');
    if (addImageBtn) {
        addImageBtn.addEventListener('click', function () {

            // Simula un clic en el input tipo "file" para subir imagen
            const imageUpload = document.getElementById('image-upload');
            if (imageUpload) imageUpload.click();
        });
    }

    // INPUT DE SUBIDA DE IMAGEN
    const imageUpload = document.getElementById('image-upload');
    if (imageUpload) {
        imageUpload.addEventListener('change', function (e) {
            const file = e.target.files[0]; // toma el primer archivo seleccionado
            if (!file) return;


            // Verifica que sea un archivo de imagen
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecciona un archivo de imagen válido.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {

                // Obtiene la vista activa donde se insertará la imagen
                const activeView = document.querySelector('.lawView.active .content-inner');
                if (!activeView) {
                    console.error('No se encontró el área de diseño activa');
                    return;
                }

                // Crea un contenedor para la imagen, que será arrastrable y escalable
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

                // Crea el elemento <img> con la imagen cargada
                const img = document.createElement('img');
                img.src = event.target.result;
                img.style.cssText = `
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    pointer-events: none;
                `;

                // Añade la imagen al contenedor y este al área activa
                wrapper.appendChild(img);
                activeView.appendChild(wrapper);

                // Hace que el contenedor sea arrastrable y escalable
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

    // BOTÓN PARA AÑADIR TEXTO
    const addTextBtn = document.getElementById('add-text-btn');
    if (addTextBtn) {

        // Llama a la función addTextToDesign() que agrega texto al diseño
        addTextBtn.addEventListener('click', addTextToDesign);
    }
}



// ==========================================================
//  FUNCIÓN PARA AÑADIR TEXTO AL DISEÑO
// ==========================================================
function addTextToDesign() {

    // Obtener referencias a los inputs de texto, color y fuente
    const textInput = document.getElementById('design-text');
    const colorInput = document.getElementById('text-color');
    const fontInput = document.getElementById('font-family');

    if (!textInput || !colorInput || !fontInput) {
        console.error('Elementos de texto no encontrados');
        return;
    }

    // Obtener valores ingresados por el usuario
    const text = textInput.value.trim(); //texto
    const color = colorInput.value; //color
    const font = fontInput.value; //fuente

    if (text === '') {
        alert('Por favor, escribe algún texto primero.');
        return;
    }

    // Seleccionar la capa activa del diseño donde se agregará el texto
    const activeView = document.querySelector('.lawView.active .design-elements-layer');
    if (!activeView) {
        console.error('No se encontró el área de diseño activa');
        return;
    }

    // Crear un nuevo div que contendrá el texto y será arrastrable/escalable
    const textElement = document.createElement('div');
    textElement.className = 'arrastrable-escalable texto-arrastrable';

    // Aplicar estilos al div de texto
    textElement.style.cssText = `
      position: absolute;
      left: 50px;          /* posición inicial desde la izquierda */
      top: 50px;           /* posición inicial desde arriba */
      color: ${color};     /* color seleccionado */
      font-family: ${font};/* fuente seleccionada */
      font-size: 18px;     /* tamaño de fuente */
      font-weight: bold;   /* negrita */
      cursor: move;        /* cursor de arrastrar */
      z-index: 200;        /* capa sobre otros elementos */
      padding: 10px;       /* espacio interno */
      background: transparent; /* fondo 100% transparente */
      border-radius: 5px;  /* bordes redondeados */
      user-select: none;   /* no permitir selección del texto al arrastrar */
  `;

    textElement.textContent = text; // asignar el contenido del texto

    // Añadir el texto al área activa del diseño
    activeView.appendChild(textElement);

    // Hacer que el texto sea arrastrable, escalable y rotatable
    hacerArrastrableYEscalable(textElement);

    // Limpiar el input de texto después de añadirlo
    textInput.value = '';

    console.log('✅ Texto añadido correctamente');
}




// ==========================================================
//  MOVIMIENTO, ESCALADO, ROTACIÓN Y ELIMINACIÓN DE ELEMENTOS
// ==========================================================
function hacerArrastrableYEscalable(elemento) {
    let isDragging = false;   // indica si el elemento se está moviendo
    let isResizing = false;   // indica si el elemento se está redimensionando
    let isRotating = false;   // indica si el elemento se está rotando
    let offsetX, offsetY, startX, startY, startWidth, startHeight;

    elemento.style.position = "absolute";
    elemento.style.cursor = "move";
    elemento.style.userSelect = "none";
    elemento.style.transition = "transform 0.1s ease";

    // ===== Contenedor de controles (rotar, redimensionar, eliminar) =====
    const controlsContainer = document.createElement("div");
    controlsContainer.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
    `;

    // ===== Botón de rotación (arriba)
    const rotateHandle = document.createElement("div");
    rotateHandle.innerHTML = "↻"; // símbolo de rotación
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

    // ===== Botón de redimensionar (abajo derecha)
    const resizeHandle = document.createElement("div");
    resizeHandle.innerHTML = "↔"; // símbolo de cambio de tamaño
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

    // ===== Botón de eliminar (arriba derecha) 
    const deleteHandle = document.createElement("div");
    deleteHandle.innerHTML = "🗑️"; // simbolo de eliminar
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

    // ===== Añadir controles al contenedor y al elemento
    controlsContainer.appendChild(rotateHandle);
    controlsContainer.appendChild(resizeHandle);
    controlsContainer.appendChild(deleteHandle);
    elemento.appendChild(controlsContainer);

    //MOVIMIENTO
    elemento.addEventListener("mousedown", (e) => {
        if ([rotateHandle, resizeHandle, deleteHandle].includes(e.target)) return;
        isDragging = true;
        const rect = elemento.getBoundingClientRect();
        offsetX = e.clientX - rect.left; // calcular desplazamiento X
        offsetY = e.clientY - rect.top;  // calcular desplazamiento Y
        elemento.style.zIndex = 1000;    // traer al frente
    });


    // ===== Movimiento, redimensionado y rotación mientras se mueve el mouse 
    document.addEventListener("mousemove", (e) => {

        // Movimiento
        if (isDragging) {
            const parent = elemento.parentElement.getBoundingClientRect();
            let x = e.clientX - parent.left - offsetX;
            let y = e.clientY - parent.top - offsetY;
            x = Math.max(0, Math.min(x, parent.width - elemento.offsetWidth));
            y = Math.max(0, Math.min(y, parent.height - elemento.offsetHeight));
            elemento.style.left = x + "px";
            elemento.style.top = y + "px";
        }

        // Redimensionamiento
        if (isResizing) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            elemento.style.width = startWidth + dx + "px";
            elemento.style.height = startHeight + dy + "px";
        }

        // Rotación
        if (isRotating) {
            const rect = elemento.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const angle = Math.atan2(e.clientY - cy, e.clientX - cx); // ángulo en radianes
            const deg = angle * (180 / Math.PI); // convertir a grados
            elemento.style.transform = `rotate(${deg}deg)`; // aplicar rotación
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        isResizing = false;
        isRotating = false;
    });

    // ===== Redimensionar 
    resizeHandle.addEventListener("mousedown", (e) => {
        e.stopPropagation();  // evitar que arrastre
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = elemento.offsetWidth;
        startHeight = elemento.offsetHeight;
    });

    // ===== Rotación
    rotateHandle.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        isRotating = true;
    });

    // ===== Eliminar 
    deleteHandle.addEventListener("click", (e) => {
        e.stopPropagation();
        if (confirm("¿Eliminar este elemento del diseño?")) {
            elemento.remove();
            console.log("🗑️ Elemento eliminado");
        }
    });

    // ===== Mostrar/ocultar controles al pasar el mouse 
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
    let zoomLevel = 1;  // nivel inicial de zoom
    const zoomBtn = document.getElementById("btnZoom"); // botón de zoom
    const designArea = document.querySelector(".design-area");

    if (zoomBtn && designArea) {
        zoomBtn.addEventListener("click", () => {
            zoomLevel += 0.2; // aumentar zoom
            if (zoomLevel > 1.6) zoomLevel = 1;// reiniciar si pasa de 160%
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



// ==========================================================
//  MODAL DE CATEGORÍAS Y PRODUCTOS
// ==========================================================
document.addEventListener('DOMContentLoaded', function () {
    const modalElement = document.getElementById('modalCategorias');
    const categoriasContainer = document.getElementById('categoriasContainer'); // contenedor de categorías
    const productosContainer = document.getElementById('productosContainer');// contenedor de productos

    if (!modalElement) return;

    const modalBootstrap = new bootstrap.Modal(modalElement, { backdrop: 'static', keyboard: false });

    // Mostrar modal si no hay producto seleccionado
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('productoId');
    if (!productoId) {
        modalBootstrap.show();
    } else {
        console.log("🧩 Producto seleccionado:", productoId);
    }

    // Cargar categorías
    fetch('/Categorias/ObtenerCategorias')
        .then(res => res.json())
        .then(categorias => {
            if (!categorias || categorias.length === 0) {
                categoriasContainer.innerHTML = `<p style="text-align:center; color:#777; margin:20px 0;">No hay categorías disponibles.</p>`;
                return;
            }

            // Mostrar categorías
            categoriasContainer.innerHTML = categorias.map(c => `
                <div class="categoria-card" data-id="${c.id}">
                    🧵 ${c.nombre}
                </div>
            `).join('');

            // Click en categoría
            document.querySelectorAll('.categoria-card').forEach(card => {
                card.addEventListener('click', function () {
                    const categoriaId = this.dataset.id;

                    fetch(`/Productos/ObtenerPorCategoria/${categoriaId}`)
                        .then(res => res.json())
                        .then(productos => {
                            productosContainer.innerHTML = '';
                            if (!productos || productos.length === 0) {
                                productosContainer.innerHTML = `<p style="text-align:center; color:#777; margin:20px 0;">No hay productos en esta categoría.</p>`;
                                return;
                            }

                            // Mostrar productos con control de stock
                            productos.forEach(p => {
                                const div = document.createElement('div');
                                div.className = 'producto-card';

                                const sinStock = p.stock <= 0;
                                const stockText = sinStock ? "Sin stock" : `Stock: ${p.stock}`;
                                const botonDeshabilitado = sinStock ? "disabled" : "";

                                div.innerHTML = `
                                    <img src="${p.imagenUrlFrende}" alt="${p.descripcion}">
                                    <p style="font-weight:bold; font-size:16px; margin-bottom:8px;">${p.descripcion}</p>
                                    <p style="color:#ff5722; font-weight:600; margin-bottom:5px;">₡${p.precio}</p>
                                    <p style="color:${sinStock ? '#c00' : '#4caf50'}; font-weight:600; margin-bottom:10px;">${stockText}</p>
                                    <button type="button" class="btn-aceptar" ${botonDeshabilitado}>${sinStock ? 'No disponible' : 'Aceptar'}</button>
                                `;

                                productosContainer.appendChild(div);

                                // Solo permitir clic si hay stock
                                if (!sinStock) {
                                    div.querySelector('.btn-aceptar').addEventListener('click', () => {
                                        console.log("Producto seleccionado:", p);
                                        window.location.href = `/Home/Diseno?productoId=${p.productoId}`;
                                    });
                                }
                            });
                        })
                        .catch(err => {
                            productosContainer.innerHTML = `<p style="color:red; text-align:center;">Error cargando productos.</p>`;
                            console.error(err);
                        });
                });
            });
        })
        .catch(err => {
            categoriasContainer.innerHTML = `<p style="color:red; text-align:center;">Error cargando categorías</p>`;
            console.error(err);
        });

    // Abrir modal manualmente
    const openCategorias = document.getElementById('openCategorias');
    if (openCategorias && modalElement) {
        openCategorias.addEventListener('click', () => modalBootstrap.show());
    }
});

// === BOTÓN VOLVER AL INICIO ===
const btnInicio = document.getElementById("btnInicio");

// Acción: volver a la página principal
btnInicio.addEventListener("click", () => {
    window.location.href = "/Home/Index";
});

// Ocultar al pasar el mouse por los paneles laterales
const leftPanel = document.querySelector(".tools-panel");
const rightPanel = document.querySelector(".options-panel");

[leftPanel, rightPanel].forEach(panel => {
    if (!panel) return;
    panel.addEventListener("mouseenter", () => btnInicio.classList.remove("visible"));
    panel.addEventListener("mouseleave", () => btnInicio.classList.add("visible"));
});


// Hacer disponible globalmente
window.addTextToDesign = addTextToDesign