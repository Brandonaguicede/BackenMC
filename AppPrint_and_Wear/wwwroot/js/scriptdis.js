function addText() {
    const textInput = document.getElementById('textInput');
    const previewText = document.getElementById('previewText');

    if (textInput.value.trim() !== '') {
        previewText.innerHTML = textInput.value;
        previewText.style.display = 'block';
        document.getElementById('previewImg').style.display = 'none';
    } else {
        alert('Por favor, escribe algún texto primero');
    }
}

function changeTextColor() {
    const color = prompt('Introduce un color (ej: red, #ff0000, blue):', 'black');
    if (color) {
        document.getElementById('previewText').style.color = color;
    }
}

function changeFontSize() {
    const size = prompt('Introduce el tamaño de fuente (ej: 20px, 1.5em):', '24px');
    if (size) {
        document.getElementById('previewText').style.fontSize = size;
    }
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const previewImg = document.getElementById('previewImg');
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
            document.getElementById('previewText').style.display = 'none';
        }
        reader.readAsDataURL(file);
    }
}

function addSampleImage() {
    const previewImg = document.getElementById('previewImg');
    // Usar una imagen de muestra
    previewImg.src = 'https://via.placeholder.com/300x300/007bff/ffffff?text=Tu+Logo';
    previewImg.style.display = 'block';
    document.getElementById('previewText').style.display = 'none';
}

function changeProductColor(colorName, colorCode) {
    document.getElementById('currentColor').textContent = colorName;
    document.querySelector('.product-preview').style.backgroundColor = colorCode;

    // Actualizar colores activos
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
    });
    event.target.classList.add('active');
}

function saveDesign() {
    alert('¡Diseño guardado correctamente! Podrás acceder a él desde tu cuenta.');
}

function continueOrder() {
    alert('Redirigiendo al proceso de pedido...');
    // Aquí iría la redirección real al proceso de compra
    // window.location.href = 'proceso-pedido.html';
}