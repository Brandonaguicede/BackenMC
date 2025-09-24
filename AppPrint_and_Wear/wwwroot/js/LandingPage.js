document.addEventListener("DOMContentLoaded", () => {
    // ===== Formulario =====
    const form = document.getElementById("formContacto");
    const box = document.getElementById("confirmacion");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Honeypot
            const website = document.getElementById("website");
            if (website && website.value) return;

            const nombre = document.getElementById("nombre")?.value.trim();
            const correo = document.getElementById("correo")?.value.trim();
            const telefono = document.getElementById("telefono")?.value.trim();
            const mensaje = document.getElementById("mensaje")?.value.trim();

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
        box.hidden = false;
        setTimeout(() => { box.hidden = true; }, 4000);
    }

    // ===== Carrusel =====
    const carrusel = document.querySelector(".carrusel");
    const btnLeft = document.querySelector(".carrusel-btn.left");
    const btnRight = document.querySelector(".carrusel-btn.right");

    if (carrusel && btnLeft && btnRight) {
        const GAP_FALLBACK = 20;

        const firstItemWidth = () => {
            const firstItem = carrusel.querySelector(".carrusel-item");
            return firstItem ? firstItem.offsetWidth : 300;
        };

        const getGap = () => {
            // Intenta leer gap real del CSS
            const cs = getComputedStyle(carrusel);
            const gap = parseFloat(cs.columnGap || cs.gap || GAP_FALLBACK);
            return isNaN(gap) ? GAP_FALLBACK : gap;
        };

        const actualizarBotones = () => {
            const maxScroll = carrusel.scrollWidth - carrusel.clientWidth;
            btnLeft.disabled = carrusel.scrollLeft <= 0;
            btnRight.disabled = carrusel.scrollLeft >= maxScroll - 1;
        };

        const step = () => firstItemWidth() + getGap();

        btnRight.addEventListener("click", () => {
            carrusel.scrollBy({ left: step(), behavior: "smooth" });
            setTimeout(actualizarBotones, 350);
        });

        btnLeft.addEventListener("click", () => {
            carrusel.scrollBy({ left: -step(), behavior: "smooth" });
            setTimeout(actualizarBotones, 350);
        });

        carrusel.addEventListener("scroll", actualizarBotones);
        window.addEventListener("resize", actualizarBotones);
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

    const abrirModal = (producto) => {
        if (!modal) return;

        if (modalNombre) modalNombre.textContent = producto?.dataset?.nombre || "";
        if (precioMonto) precioMonto.textContent = producto?.dataset?.precio || "";
        if (modalInfo) modalInfo.textContent = producto?.dataset?.detalles || "";

        if (colorOpciones) {
            colorOpciones.innerHTML = "";
            (producto?.dataset?.colores || "")
                .split(",")
                .map(c => c.trim())
                .filter(Boolean)
                .forEach(color => {
                    const span = document.createElement("span");
                    // Usa tu clase actual; si tu CSS espera .color-chip, cámbiala aquí
                    span.className = "color-circle";
                    span.style.backgroundColor = color;
                    span.title = color;
                    colorOpciones.appendChild(span);
                });
        }

        if (tallaOpciones) {
            tallaOpciones.innerHTML = "";
            (producto?.dataset?.tallas || "")
                .split(",")
                .map(t => t.trim())
                .filter(Boolean)
                .forEach(talla => {
                    const span = document.createElement("span");
                    // Igual que arriba, ajusta si tu CSS usa .talla-chip
                    span.className = "talla-item";
                    span.textContent = talla;
                    tallaOpciones.appendChild(span);
                });
        }

        modal.style.display = "block";
    };

    document.querySelectorAll(".btn-detalles").forEach((boton) => {
        boton.addEventListener("click", (e) => {
            e.preventDefault();
            const producto = e.currentTarget.closest(".carrusel-item");
            if (producto) abrirModal(producto);
        });
    });

    cerrar?.addEventListener("click", () => { if (modal) modal.style.display = "none"; });
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });
});
