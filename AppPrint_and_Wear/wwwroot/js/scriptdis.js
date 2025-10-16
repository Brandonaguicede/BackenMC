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
            document.getElementById('front-shirt').src = shirtImages[hexColor].front;
            document.getElementById('back-shirt').src = shirtImages[hexColor].back;
        } else {
            // Opcional: para depuración
            console.log("Color no encontrado:", hexColor);
        }
    });
});
// 🧼 BOTÓN DE BORRAR (versión fluida con animaciones suaves)
const btnResetColor = document.getElementById("btnResetColor");

if (btnResetColor) {
    btnResetColor.addEventListener("click", () => {
        console.log("🧽 Limpiando vista actual con efecto fluido...");

        // Detectar vista activa
        const activeView = document.querySelector('.lawView.active');
        const isFront = activeView && activeView.id === 'front-view';

        // Quitar selección de color
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));

        // Color base (blanco o color por defecto)
        const defaultColor = "#ffffff";
        const colorSet = currentProduct.colors[defaultColor] || Object.values(currentProduct.colors)[0];

        // Referencias a imágenes
        const frontImg = document.getElementById('shirt-front');
        const backImg = document.getElementById('shirt-back');

        // 🌫️ Animación suave tipo “fluido”
        [frontImg, backImg].forEach(img => {
            if (img) {
                img.style.transition = "opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), filter 0.5s ease";
                img.style.opacity = "0";
                img.style.transform = "scale(1.05)";
                img.style.filter = "blur(5px)";
            }
        });

        // Cambiar imágenes después de la transición
        setTimeout(() => {
            if (frontImg && colorSet.front) frontImg.src = colorSet.front;
            if (backImg && colorSet.back) backImg.src = colorSet.back;

            [frontImg, backImg].forEach(img => {
                if (img) {
                    img.style.opacity = "1";
                    img.style.transform = "scale(1)";
                    img.style.filter = "blur(0)";
                }
            });
        }, 500);

        // 🧹 Limpiar área activa
        const content = isFront
            ? document.getElementById('front-content-inner')
            : document.getElementById('back-content-inner');

        if (content) {
            content.classList.add('cleaning-fluid');
            setTimeout(() => {
                content.querySelectorAll('.arrastrable-escalable, img').forEach(e => e.remove());
                content.textContent = '';
                content.classList.remove('cleaning-fluid');
            }, 600);
        }

        // Limpiar historial
        historyStack = [];
        redoStack = [];
        saveSnapshot();

        // ✅ Notificación suave
        showNotification?.("✨ Diseño limpiado con fluidez elegante");
        console.log("✅ Limpieza completada con animación fluida.");
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
// ===========================================
// 🧩 BOTONES INFERIORES - FUNCIONALIDAD COMPLETA
// ===========================================

// 🎯 1️⃣ ZOOM
let zoomLevel = 1;
const zoomBtn = document.getElementById("btnZoom");
const designArea = document.querySelector(".design-area");

if (zoomBtn && designArea) {
    zoomBtn.addEventListener("click", () => {
        zoomLevel += 0.2;
        if (zoomLevel > 1.6) zoomLevel = 1; // vuelve al tamaño normal
        designArea.style.transform = `scale(${zoomLevel})`;
        designArea.style.transition = "transform 0.4s ease";
        zoomBtn.classList.add("zoom-pulse");
        setTimeout(() => zoomBtn.classList.remove("zoom-pulse"), 300);
    });
}

// 🎯 2️⃣ DESHACER (ya está en tu código, aquí solo visual extra)
const undoBtn = document.getElementById("btnUndo");
if (undoBtn) {
    undoBtn.addEventListener("mouseenter", () => undoBtn.classList.add("btn-hover"));
    undoBtn.addEventListener("mouseleave", () => undoBtn.classList.remove("btn-hover"));
}

// 🎯 3️⃣ REHACER (ya está también, solo efecto visual)
const redoBtn = document.getElementById("btnRedo");
if (redoBtn) {
    redoBtn.addEventListener("mouseenter", () => redoBtn.classList.add("btn-hover"));
    redoBtn.addEventListener("mouseleave", () => redoBtn.classList.remove("btn-hover"));
}

// 🎯 BOTÓN DE PREVIO — Vista previa real con animación y cierre fluido
const previewBtn = document.getElementById("btnPreview");
if (previewBtn) {
    previewBtn.addEventListener("click", () => {
        // Crea el modal principal
        const preview = document.createElement("div");
        preview.className = "preview-modal";

        preview.innerHTML = `
            <div class="preview-box">
                <span class="close-preview">&times;</span>
                <h2>Vista previa del diseño</h2>
                <div class="preview-content">
                    <div class="preview-item animate-preview">
                        <h3>Frente</h3>
                        <div class="mockup-area">
                            <img src="${document.getElementById('shirt-front').src}" class="mockup-img" alt="Frente">
                            <div class="mockup-overlay">
                                ${document.getElementById('front-content-inner').innerHTML}
                            </div>
                        </div>
                    </div>
                    <div class="preview-item animate-preview">
                        <h3>Espalda</h3>
                        <div class="mockup-area">
                            <img src="${document.getElementById('shirt-back').src}" class="mockup-img" alt="Espalda">
                            <div class="mockup-overlay">
                                ${document.getElementById('back-content-inner').innerHTML}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(preview);

        // Botón para cerrar con animación
        const closeBtn = preview.querySelector(".close-preview");
        closeBtn.addEventListener("click", () => {
            preview.classList.add("fade-out");
            setTimeout(() => preview.remove(), 400);
        });
    });
}

// 🎯 5️⃣ SELECCIONAR TODO
const selectAllBtn = document.getElementById("btnSelectAll");
if (selectAllBtn) {
    selectAllBtn.addEventListener("click", () => {
        document.querySelectorAll(".arrastrable-escalable").forEach(el => {
            el.classList.add("selected-rotate");
        });

        selectAllBtn.classList.add("select-flash");
        setTimeout(() => selectAllBtn.classList.remove("select-flash"), 300);

        console.log("🖱️ Todos los elementos seleccionados");
    });
}









// ==========================================================
//  SISTEMA DE PERSONALIZACIÓN DE CAMISETAS - HOMBRE Y MUJER
// ==========================================================

const productStyles = [
    // ================= Hombre =================
    {
        id: 1,
        name: "Camiseta Básica Hombre",
        type: "basica-hombre",
        colors: {
            // Lime
            "#b4d334": {
                front: "https://cdn.inksoft.com/images/products/2570/products/8000/Lime/front/500.png?decache=637411205149570000",
                back: "https://cdn.inksoft.com/images/products/2570/products/8000/Lime/back/500.png?decache=637411205149570000"
            },
            // Red
            "#c0392b": {
                front: "https://cdn.inksoft.com/images/products/2570/products/8000/Red/front/500.png?decache=637411207460830000",
                back: "https://cdn.inksoft.com/images/products/2570/products/8000/Red/back/500.png?decache=637411207460830000"
            },
            // Black
            "#000000": {
                front: "https://cdn.inksoft.com/images/products/2570/products/8000/Black/front/500.png?decache=637411201611730000",
                back: "https://cdn.inksoft.com/images/products/2570/products/8000/Black/back/500.png?decache=637411201611730000"
            },
            // Orange
            "#f39c12": {
                front: "https://cdn.inksoft.com/images/products/2570/products/8000/Orange/front/500.png?decache=637411205149570000",
                back: "https://cdn.inksoft.com/images/products/2570/products/8000/Orange/back/500.png?decache=637411205149570000"
            },
            // Daisy 
            "#f7dc6f": {
                front: "https://cdn.inksoft.com/images/products/2570/products/8000/Daisy/front/500.png?decache=637413825674170000",
                back: "https://cdn.inksoft.com/images/products/2570/products/8000/Daisy/back/500.png?decache=637413825674170000"
            },
            // Sapphire 
            "#1e90ff": {
                front: "https://cdn.inksoft.com/images/products/2570/products/8000/Sapphire/front/500.png?decache=637411207460830000",
                back: "https://cdn.inksoft.com/images/products/2570/products/8000/Sapphire/back/500.png?decache=637411207460830000"
            },
            // White 
            "#ffffff": {
                front: "https://cdn.inksoft.com/images/products/2570/products/8000/White/front/500.png?decache=637411207460830000",
                back: "https://cdn.inksoft.com/images/products/2570/products/8000/White/back/500.png?decache=637411207460830000"
            },
            // Azalea
            "#ff66b2": {
                front: "https://cdn.inksoft.com/images/products/2570/products/8000/Azalea/front/500.png?decache=637411201611730000",
                back: "https://cdn.inksoft.com/images/products/2570/products/8000/Azalea/back/500.png?decache=637411201611730000"
            }
           
        }

    },
    {
        id: 2,
        name: "Camiseta Cuello V Hombre",
        type: "cuello-v-hombre",
        colors: {
            // Envy 
            "#2e8b57": {
                front: "https://cdn.inksoft.com/images/products/2570/products/6040/Envy/front/500.png?decache=637357660432470000",
                back: "https://cdn.inksoft.com/images/products/2570/products/6040/Envy/back/500.png?decache=637357660432470000"
            },
            // Vintage Red 
            "#b22222": {
                front: "https://cdn.inksoft.com/images/products/2570/products/6040/Vintage_Red/front/500.png?decache=637357662401200000",
                back: "https://cdn.inksoft.com/images/products/2570/products/6040/Vintage_Red/back/500.png?decache=637357662401200000"
            },
            // Vintage negro
            "#2f2f2f": {
                front: "https://cdn.inksoft.com/images/products/2570/products/6040/Vintage_Black/front/500.png?decache=637357662401200000",
                back: "https://cdn.inksoft.com/images/products/2570/products/6040/Vintage_Black/back/500.png?decache=637357662401200000"
            },
            // Vintage Royal
            "#4169e1": {
                front: "https://cdn.inksoft.com/images/products/2570/products/6040/Vintage_Royal/front/500.png?decache=637357662401200000",
                back: "https://cdn.inksoft.com/images/products/2570/products/6040/Vintage_Royal/back/500.png?decache=637357662401200000"
            }
        }

    },
    {
        id: 3,
        name: "Camiseta Manga Larga Hombre",
        type: "manga-larga-hombre",
        colors: {
            // Rojo
            "#ff0000": {
                front: "https://cdn.inksoft.com/images/products/2570/products/ST350LS/True_Red/front/500.png?decache=637354048421530000",
                back: "https://cdn.inksoft.com/images/products/2570/products/ST350LS/True_Red/back/500.png?decache=637354048421530000"
            },
            // Negro
            "#000000": {
                front: "https://cdn.inksoft.com/images/products/2570/products/ST350LS/Black/front/500.png?decache=637354047277200000",
                back: "https://cdn.inksoft.com/images/products/2570/products/ST350LS/Black/back/500.png?decache=637354047277200000"
            },
            // Fuscia 
            "#ff1493": {
                front: "https://cdn.inksoft.com/images/products/2570/products/ST350LS/Neon_Pink/front/500.png?decache=637354047277200000",
                back: "https://cdn.inksoft.com/images/products/2570/products/ST350LS/Neon_Pink/back/500.png?decache=637354047277200000"
            },
            // Gold
            "#ffd700": {
                front: "https://cdn.inksoft.com/images/products/2570/products/ST350LS/Gold/front/500.png?decache=637354047277200000",
                back: "https://cdn.inksoft.com/images/products/2570/products/ST350LS/Gold/back/500.png?decache=637354047277200000"
            },
            // Verde Lima 
            "#32cd32": {
                front: "https://cdn.inksoft.com/images/products/2570/products/ST350LS/Lime_Shock/front/500.png?decache=637354047277200000",
                back: "https://cdn.inksoft.com/images/products/2570/products/ST350LS/Lime_Shock/back/500.png?decache=637354047277200000"
            }
        }

    },
    {
        id: 4,
        name: "Polo Clásico Hombre",
        type: "polo-hombre",
        colors: {
            // Blanco
            "#ffffff": {
                front: "https://cdn.inksoft.com/images/products/2570/products/8800/White/front/500.png?decache=638459986732330000",
                back: "https://cdn.inksoft.com/images/products/2570/products/8800/White/back/500.png?decache=638459986732330000"
            },
            // Negro
            "#000000": {
                front: "https://cdn.inksoft.com/images/products/2570/products/8800/Black/front/500.png?decache=638459986732330000",
                back: "https://cdn.inksoft.com/images/products/2570/products/8800/Black/back/500.png?decache=638459986732330000"
            },
            // Rojo
            "#ff0000": {
                front: "https://cdn.inksoft.com/images/products/2570/products/8800/Red/front/500.png?decache=638459986732330000",
                back: "https://cdn.inksoft.com/images/products/2570/products/8800/Red/back/500.png?decache=638459986732330000"
            },
            // Azul (Royal)
            "#4169e1": {
                front: "https://cdn.inksoft.com/images/products/2570/products/8800/Royal/front/500.png?decache=638459986732330000",
                back: "https://cdn.inksoft.com/images/products/2570/products/8800/Royal/back/500.png?decache=638459986732330000"
            }
        }

    },

    // ================= Mujer =================
    {
        id: 5,
        name: "Camiseta Básica Mujer",
        type: "basica-mujer",
        colors: {
            // Rosa claro 
            "#ffb6c1": {
                front: "https://cdn.inksoft.com/images/products/2570/products/2000L/Light_Pink/front/500.png?decache=",
                back: "https://cdn.inksoft.com/images/products/2570/products/2000L/Light_Pink/back/500.png?decache="
            },
            // Blanco 
            "#ffffff": {
                front: "https://cdn.inksoft.com/images/products/2570/products/2000L/White/front/500.png?decache=",
                back: "https://cdn.inksoft.com/images/products/2570/products/2000L/White/back/500.png?decache="
            },
            // Fucsia 
            "#ff1493": {
                front: "https://cdn.inksoft.com/images/products/2570/products/2000L/Heliconia/front/500.png?decache=",
                back: "https://cdn.inksoft.com/images/products/2570/products/2000L/Heliconia/back/500.png?decache="
            },
            // Celeste claro 
            "#add8e6": {
                front: "https://cdn.inksoft.com/images/products/2570/products/2000L/Light_Blue/front/500.png?decache=",
                back: "https://cdn.inksoft.com/images/products/2570/products/2000L/Light_Blue/back/500.png?decache="
            },
            // Negro 
            "#000000": {
                front: "https://cdn.inksoft.com/images/products/2570/products/2000L/Black/front/500.png?decache=",
                back: "https://cdn.inksoft.com/images/products/2570/products/2000L/Black/back/500.png?decache="
            }
        }

    },
    {
        id: 6,
        name: "Camiseta Cuello V Mujer",
        type: "cuello-v-mujer",
        colors: {
            // Banana Cream 
            "#fff59d": {
                front: "https://cdn.inksoft.com/images/products/2570/products/1540/Banana_Cream/front/500.png?decache=636686566188070000",
                back: "https://cdn.inksoft.com/images/products/2570/products/1540/Banana_Cream/back/500.png?decache=636686566188070000"
            },
            // Blanca
            "#ffffff": {
                front: "https://cdn.inksoft.com/images/products/2570/products/1540/White/front/500.png?decache=636686566188070000",
                back: "https://cdn.inksoft.com/images/products/2570/products/1540/White/back/500.png?decache=636686566188070000"
            },
            // Rosa Fucsia 
            "#e30b5c": {
                front: "https://cdn.inksoft.com/images/products/2570/products/1540/Raspberry/front/500.png?decache=636686566188070000",
                back: "https://cdn.inksoft.com/images/products/2570/products/1540/Raspberry/back/500.png?decache=636686566188070000"
            },
            // Negra
            "#000000": {
                front: "https://cdn.inksoft.com/images/products/2570/products/1540/Black/front/500.png?decache=636686566188070000",
                back: "https://cdn.inksoft.com/images/products/2570/products/1540/Black/back/500.png?decache=636686566188070000"
            },
            // Roja
            "#ff0000": {
                front: "https://cdn.inksoft.com/images/products/2570/products/1540/Red/front/500.png?decache=636686566188070000",
                back: "https://cdn.inksoft.com/images/products/2570/products/1540/Red/back/500.png?decache=636686566188070000"
            }
        }

    },
    {
        id: 7,
        name: "Camiseta Manga Larga Mujer",
        type: "manga-larga-mujer",
        colors: {
            // Negro
            "#000000": {
                front: "https://cdn.inksoft.com/images/products/2570/products/3911NL/Black/front/500.png?decache=638407054010770000",
                back: "https://cdn.inksoft.com/images/products/2570/products/3911NL/Black/back/500.png?decache=638407054010770000"
            },
            // Rojo
            "#ff0000": {
                front: "https://cdn.inksoft.com/images/products/2570/products/3911NL/Red/front/500.png?decache=638407054010770000",
                back: "https://cdn.inksoft.com/images/products/2570/products/3911NL/Red/back/500.png?decache=638407054010770000"
            },
            // Blanco
            "#ffffff": {
                front: "https://cdn.inksoft.com/images/products/2570/products/3911NL/White/front/500.png?decache=638407054010770000",
                back: "https://cdn.inksoft.com/images/products/2570/products/3911NL/White/back/500.png?decache=638407054010770000"
            },
            // Rosa Ahumado / Desert Pink
            "#f1c0b0": { 
                front: "https://cdn.inksoft.com/images/products/2570/products/3911NL/Desert_Pink/front/500.png?decache=638407054010770000",
                back: "https://cdn.inksoft.com/images/products/2570/products/3911NL/Desert_Pink/back/500.png?decache=638407054010770000"
            }
        }

    },
    {
        id: 8,
        name: "Polo Clásico Mujer",
        type: "polo-mujer",
        colors: {
            // Blanco
            "#ffffff": {
                front: "https://cdn.inksoft.com/images/products/2570/products/2515/White/front/500.png?decache=637435398933100000",
                back: "https://cdn.inksoft.com/images/products/2570/products/2515/White/back/500.png?decache=637435398933100000"
            },
            // Rojo vino
            "#800000": {
                front: "https://cdn.inksoft.com/images/products/2570/products/2515/Red/front/500.png?decache=637435397708130000",
                back: "https://cdn.inksoft.com/images/products/2570/products/2515/Red/back/500.png?decache=637435397708130000"
            },
            // Negro
            "#000000": {
                front: "https://cdn.inksoft.com/images/products/2570/products/2515/Black/front/500.png?decache=637435392047200000",
                back: "https://cdn.inksoft.com/images/products/2570/products/2515/Black/back/500.png?decache=637435392047200000"
            },
            // Rosado claro
            "#ffb6c1": {
                front: "https://cdn.inksoft.com/images/products/2570/products/2515/Light_Pink/front/500.png?decache=637435393542030000",
                back: "https://cdn.inksoft.com/images/products/2570/products/2515/Light_Pink/back/500.png?decache=637435393542030000"
            },
            // Verde menta
            "#98ff98": {
                front: "https://cdn.inksoft.com/images/products/2570/products/2515/Mint_Green/front/500.png?decache=637435394888400000",
                back: "https://cdn.inksoft.com/images/products/2570/products/2515/Mint_Green/back/500.png?decache=637435394888400000"
            },
            // Celeste claro
            "#add8e6": {
                front: "https://cdn.inksoft.com/images/products/2570/products/2515/Light_Blue/front/500.png?decache=637435393542030000",
                back: "https://cdn.inksoft.com/images/products/2570/products/2515/Light_Blue/back/500.png?decache=637435393542030000"
            }
        }

    }
];



// ----------------------------------------------------------
// FUNCIONALIDAD PRINCIPAL
// ----------------------------------------------------------

// Estado actual
let currentProductIndex = 0;
let currentProduct = productStyles[0];

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', function () {
    initializeProductChanger();
    updateProductDisplay();
});

// =====================
// CAMBIO DE PRODUCTO
// =====================
function initializeProductChanger() {
    const changeProductBtn = document.querySelector('.change-product button');
    if (changeProductBtn) {
        changeProductBtn.addEventListener('click', showProductSelector);
    }
}

function showProductSelector() {
    const modal = document.createElement('div');
    modal.className = 'product-selector-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 15px;
        padding: 30px;
        max-width: 800px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        animation: slideUp 0.3s ease;
    `;

    let html = `
        <h2 style="margin-bottom: 20px; color: #2c3e50; font-size: 24px;">Selecciona un estilo de producto</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px;">
    `;

    productStyles.forEach((product, index) => {
        const isActive = index === currentProductIndex;
        html += `
            <div class="product-card" data-index="${index}" style="
                border: 3px solid ${isActive ? '#3498db' : '#e9ecef'};
                border-radius: 10px;
                padding: 15px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: ${isActive ? '#f0f8ff' : 'white'};
            ">
                <img src="${Object.values(product.colors)[0].front}" 
                     style="width: 100%; height: 150px; object-fit: contain; margin-bottom: 10px;"
                     alt="${product.name}">
                <h3 style="font-size: 16px; color: #2c3e50; margin: 10px 0;">${product.name}</h3>
                ${isActive ? '<div style="color: #3498db; font-weight: 600; font-size: 12px;">✓ Actualmente seleccionado</div>' : ''}
            </div>
        `;
    });

    html += `</div>
        <button id="close-modal" style="
            margin-top: 20px;
            width: 100%;
            padding: 12px;
            background: #95a5a6;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
        ">Cerrar</button>
    `;

    modalContent.innerHTML = html;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .product-card:hover {
            border-color: #3498db !important;
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
        }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function () {
            const index = parseInt(this.dataset.index);
            changeProduct(index);
            modal.remove();
        });
    });

    document.getElementById('close-modal').addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function changeProduct(index) {
    currentProductIndex = index;
    currentProduct = productStyles[index];
    updateProductDisplay();
    showNotification(`Cambiado a: ${currentProduct.name}`);
}

function updateProductDisplay() {
    const activeColor = document.querySelector('.color-option.active');
    const colorHex = activeColor ? rgbToHex(activeColor.style.backgroundColor).toLowerCase() : '#3498db';
    updateShirtImages(colorHex);
    mostrarColores(currentProduct.id); // <- agrega esto
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



function updateShirtImages(colorHex) {
    const imgFront = document.querySelector('#shirt-front');
    const imgBack = document.querySelector('#shirt-back');

    if (!imgFront || !imgBack) return;

    const colorSet = currentProduct.colors[colorHex] || Object.values(currentProduct.colors)[0];
    imgFront.src = colorSet.front;
    imgBack.src = colorSet.back;
}

document.addEventListener('DOMContentLoaded', function () {
    initializeProductChanger();
    updateProductDisplay();
    mostrarColores(currentProduct.id); // <- esto genera los circulitos
});

// Función que muestra los circulitos de colores de la camiseta activa
function mostrarColores(camisetaId) {
    const camiseta = productStyles.find(p => p.id === camisetaId);
    const container = document.querySelector('#color-options');
    container.innerHTML = ''; // Limpiar colores anteriores

    for (const color in camiseta.colors) {
        const div = document.createElement('div');
        div.classList.add('color-option');
        div.dataset.color = color;
        div.style.backgroundColor = color; // esto crea el color visual

        div.addEventListener('click', () => {
            // Cambia la imagen de la camiseta
            document.querySelector('#shirt-front').src = camiseta.colors[color].front;
            document.querySelector('#shirt-back').src = camiseta.colors[color].back;

            // Marca el circulito como activo
            document.querySelectorAll('.color-option').forEach(c => c.classList.remove('active'));
            div.classList.add('active');
        });

        container.appendChild(div);
    }

    // Selecciona automáticamente el primer color
    const primerColor = Object.keys(camiseta.colors)[0];
    document.querySelector('#shirt-front').src = camiseta.colors[primerColor].front;
    document.querySelector('#shirt-back').src = camiseta.colors[primerColor].back;
    container.querySelector('.color-option').classList.add('active');
}
// 📏 Modal Guía de Tallas
document.addEventListener('DOMContentLoaded', () => {
    const modalTallas = document.getElementById('modalTallas');
    const closeTallas = document.getElementById('closeTallas');
    const links = document.querySelectorAll('.product-info a');
    const guiaLink = Array.from(links).find(link => link.textContent.includes('Guía de tallas'));

    if (guiaLink && modalTallas && closeTallas) {
        guiaLink.addEventListener('click', (e) => {
            e.preventDefault();
            modalTallas.style.display = 'flex';
            modalTallas.classList.add('open');
        });

        closeTallas.addEventListener('click', () => {
            modalTallas.style.display = 'none';
        });

        // Cerrar al hacer clic fuera del contenido
        window.addEventListener('click', (e) => {
            if (e.target === modalTallas) {
                modalTallas.style.display = 'none';
            }
        });
    }
});
// 🧴 Modal de Información del Producto
document.addEventListener('DOMContentLoaded', () => {
    const modalInfo = document.getElementById('modalInfo');
    const closeInfo = document.getElementById('closeInfo');
    const links = document.querySelectorAll('.product-info a');
    const infoLink = Array.from(links).find(link => link.textContent.includes('Info del producto'));

    if (infoLink && modalInfo && closeInfo) {
        infoLink.addEventListener('click', (e) => {
            e.preventDefault();
            modalInfo.style.display = 'flex';
            modalInfo.classList.add('open');
        });

        closeInfo.addEventListener('click', () => {
            modalInfo.style.display = 'none';
        });

        // Cerrar haciendo clic fuera
        window.addEventListener('click', (e) => {
            if (e.target === modalInfo) {
                modalInfo.style.display = 'none';
            }
        });
    }
});

// 🔄 ROTAR ELEMENTOS SELECCIONADOS ============================

// Variable para guardar el elemento actualmente seleccionado
let selectedElement = null;

// Detectar clic sobre elementos arrastrables
document.addEventListener('click', function (e) {
    const target = e.target.closest('.arrastrable-escalable');
    if (target) {
        // Deseleccionar otros
        document.querySelectorAll('.arrastrable-escalable').forEach(el => el.classList.remove('selected-rotate'));
        // Seleccionar el clicado
        selectedElement = target;
        selectedElement.classList.add('selected-rotate');
    }
});

// Botón de rotar
const rotateBtn = Array.from(document.querySelectorAll('.tool-button'))
    .find(btn => btn.textContent.trim() === "Rotar");

if (rotateBtn) {
    rotateBtn.addEventListener('click', () => {
        if (!selectedElement) {
            alert("Selecciona un elemento (texto o imagen) para rotar.");
            return;
        }

        // Leer ángulo actual y aumentar 15°
        let currentRotation = parseFloat(selectedElement.getAttribute('data-rotation') || "0");
        currentRotation += 15; // rota de 15° en 15° por clic

        // Aplicar rotación con animación suave
        selectedElement.style.transition = "transform 0.3s ease";
        selectedElement.style.transform = `rotate(${currentRotation}deg)`;
        selectedElement.setAttribute('data-rotation', currentRotation);

        // Efecto visual breve de "rotación activa"
        selectedElement.classList.add('rotating');
        setTimeout(() => selectedElement.classList.remove('rotating'), 300);
    });
}
