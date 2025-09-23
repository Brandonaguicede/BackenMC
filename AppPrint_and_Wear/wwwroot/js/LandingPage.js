document.addEventListener("DOMContentLoaded", () => {
  

    // ===== Formulario =====
    const form = document.getElementById("formContacto");
    const box = document.getElementById("confirmacion");

    if (form) {
        form.addEventListener("submit", e => {
            e.preventDefault();
            const website = document.getElementById("website");
            if (website && website.value) return; 

            const nombre = document.getElementById("nombre").value.trim();
            const correo = document.getElementById("correo").value.trim();
            const telefono = document.getElementById("telefono").value.trim();
            const mensaje = document.getElementById("mensaje").value.trim();

            if (!nombre || !correo || !telefono || !mensaje) {
                mostrarConfirmacion("⚠️ Por favor, complete todos los campos.", "error");
                return;
            }

            const registro = { nombre, correo, telefono, mensaje, fechaISO: new Date().toISOString() };

            try {
                const clave = "contacto_envios";
                const existentes = JSON.parse(localStorage.getItem(clave) || "[]");
                existentes.push(registro);
                localStorage.setItem(clave, JSON.stringify(existentes));
            } catch (err) {
                console.warn("No se pudo registrar en localStorage:", err);
            }

            mostrarConfirmacion("✅ ¡Gracias por contactarnos! Te responderemos pronto.");
            form.reset();
        });
    }

    function mostrarConfirmacion(msg, tipo = "ok") {
        if (!box) return;
        box.textContent = msg;
        box.className = tipo === "error" ? "mensaje error" : "mensaje ok";
        box.style.display = "block";
        setTimeout(() => { box.style.display = "none"; }, 4000);
    }

    // ===== Carrusel =====
    const carrusel = document.querySelector(".carrusel");
    const btnLeft = document.querySelector(".carrusel-btn.left");
    const btnRight = document.querySelector(".carrusel-btn.right");

    if (carrusel && btnLeft && btnRight) {
        const itemGap = 20;

        const actualizarBotones = () => {
            const maxScroll = carrusel.scrollWidth - carrusel.clientWidth;
            btnLeft.disabled = carrusel.scrollLeft <= 0;
            btnRight.disabled = carrusel.scrollLeft >= maxScroll - 1;
        };

        btnRight.addEventListener("click", () => {
            const firstItem = carrusel.querySelector('.carrusel-item');
            if (!firstItem) return;
            carrusel.scrollBy({ left: firstItem.offsetWidth + itemGap, behavior: 'smooth' });
            setTimeout(actualizarBotones, 600);
        });

        btnLeft.addEventListener("click", () => {
            const firstItem = carrusel.querySelector('.carrusel-item');
            if (!firstItem) return;
            carrusel.scrollBy({ left: -(firstItem.offsetWidth + itemGap), behavior: 'smooth' });
            setTimeout(actualizarBotones, 600);
        });

        carrusel.addEventListener('scroll', actualizarBotones);
        window.addEventListener('resize', actualizarBotones);
        actualizarBotones();
    }

    // ===== Modal de detalles =====
    const modal = document.getElementById("modal-detalles");
    const modalNombre = document.getElementById("modal-nombre");
    const modalInfo = document.getElementById("modal-info");
    const precioMonto = document.getElementById("precio-monto");
    const colorOpciones = document.getElementById("color-opciones");
    const tallaOpciones = document.getElementById("talla-opciones");
    const cerrar = document.querySelector(".modal .cerrar");

    document.querySelectorAll(".btn-detalles").forEach(boton => {
        boton.addEventListener("click", e => {
            e.preventDefault();
            const producto = e.target.closest(".carrusel-item");
            if (!producto) return;

            modalNombre.textContent = producto.dataset.nombre;
            precioMonto.textContent = producto.dataset.precio;
            modalInfo.textContent = producto.dataset.detalles;

            colorOpciones.innerHTML = "";
            (producto.dataset.colores || "").split(",").forEach(color => {
                const span = document.createElement("span");
                span.className = "color-circle";
                span.style.backgroundColor = color;
                span.title = color;
                colorOpciones.appendChild(span);
            });

            tallaOpciones.innerHTML = "";
            (producto.dataset.tallas || "").split(",").forEach(talla => {
                const span = document.createElement("span");
                span.className = "talla-item";
                span.textContent = talla;
                tallaOpciones.appendChild(span);
            });

            modal.style.display = "block";
        });
    });

    cerrar.addEventListener("click", () => { modal.style.display = "none"; });
    window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

});
