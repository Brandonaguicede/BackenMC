document.addEventListener("DOMContentLoaded", function () {
    // ===================================
    // LÓGICA DEL FORMULARIO DE CONTACTO
    // ===================================
    const formContacto = document.getElementById("formContacto");
    const boxConfirmacion = document.getElementById("confirmacion");

    function mostrarConfirmacion(msg, tipo = "ok") {
        if (!boxConfirmacion) return;
        boxConfirmacion.textContent = msg;
        boxConfirmacion.className = tipo === "error" ? "mensaje error" : "mensaje ok";
        boxConfirmacion.hidden = false;
        setTimeout(() => { boxConfirmacion.hidden = true; }, 4000);
    }

    if (formContacto) {
        formContacto.addEventListener("submit", (e) => {
            e.preventDefault();
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
                mostrarConfirmacion("✅ ¡Gracias por contactarnos! Te responderemos pronto.");
                formContacto.reset();
            } catch (err) {
                console.warn("No se pudo registrar en localStorage:", err);
                mostrarConfirmacion("⚠️ Hubo un error al guardar los datos.", "error");
            }
        });
    }

    // ===============================
    // LÓGICA DEL CARRUSEL DE PRODUCTOS
    // ===============================
    const carrusel = document.querySelector(".carrusel");
    const btnLeft = document.querySelector(".carrusel-btn.left");
    const btnRight = document.querySelector(".carrusel-btn.right");
    const GAP_FALLBACK = 20;

    if (carrusel && btnLeft && btnRight) {
        const firstItemWidth = () => {
            const firstItem = carrusel.querySelector(".carrusel-item");
            return firstItem ? firstItem.offsetWidth : 300;
        };
        const getGap = () => {
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

    // =========================================
    // LÓGICA DEL MODAL DE DETALLES DEL PRODUCTO
    // =========================================
    const modalDetalles = document.getElementById("modal-detalles");
    const modalNombre = document.getElementById("modal-nombre");
    const modalInfo = document.getElementById("modal-info");
    const precioMonto = document.getElementById("precio-monto");
    const colorOpciones = document.getElementById("color-opciones");
    const tallaOpciones = document.getElementById("talla-opciones");
    const cerrarDetalles = document.querySelector("#modal-detalles .cerrar");

    const abrirModalDetalles = (producto) => {
        if (!modalDetalles) return;
        if (modalNombre) modalNombre.textContent = producto?.dataset?.nombre || "";
        if (precioMonto) precioMonto.textContent = producto?.dataset?.precio || "";
        if (modalInfo) modalInfo.textContent = producto?.dataset?.detalles || "";

        if (colorOpciones) {
            colorOpciones.innerHTML = "";
            (producto?.dataset?.colores || "").split(",").map(c => c.trim()).filter(Boolean)
                .forEach(color => {
                    const span = document.createElement("span");
                    span.className = "color-circle";
                    span.style.backgroundColor = color;
                    span.title = color;
                    colorOpciones.appendChild(span);
                });
        }

        if (tallaOpciones) {
            tallaOpciones.innerHTML = "";
            (producto?.dataset?.tallas || "").split(",").map(t => t.trim()).filter(Boolean)
                .forEach(talla => {
                    const span = document.createElement("span");
                    span.className = "talla-item";
                    span.textContent = talla;
                    tallaOpciones.appendChild(span);
                });
        }
        modalDetalles.style.display = "block";
    };

    document.querySelectorAll(".btn-detalles").forEach((boton) => {
        boton.addEventListener("click", (e) => {
            e.preventDefault();
            const producto = e.currentTarget.closest(".carrusel-item");
            if (producto) abrirModalDetalles(producto);
        });
    });

    if (cerrarDetalles) {
        cerrarDetalles.addEventListener("click", () => {
            modalDetalles.style.display = "none";
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === modalDetalles) modalDetalles.style.display = "none";
    });

    // =========================================
    // MODAL DE REGISTRO CON VALIDACIÓN
    // =========================================
    const btnRegistro = document.getElementById("btn-registrarse");
    const modalRegistro = document.getElementById("modal-registro");
    const cerrarRegistro = document.querySelector(".cerrar-registro");
    const formRegistro = document.getElementById("form-registro");
    const mensajeRegistro = document.getElementById("mensaje-registro");

    function ocultarBotonesFlotantes() {
        document.querySelectorAll("#btn-registrarse, #btn-login")
            .forEach(btn => btn.style.display = "none");
    }

    function validarCorreo(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }


    if (btnRegistro) {
        btnRegistro.addEventListener("click", () => modalRegistro.style.display = "block");
    }

    if (cerrarRegistro) {
        cerrarRegistro.addEventListener("click", () => modalRegistro.style.display = "none");
    }

    window.addEventListener("click", (event) => {
        if (event.target === modalRegistro) modalRegistro.style.display = "none";
    });

    if (formRegistro) {
        formRegistro.addEventListener("submit", function (event) {
            event.preventDefault();

            const correo = formRegistro.querySelector("#registro-correo")?.value.trim();
            const telefono = formRegistro.querySelector("#registro-telefono")?.value.trim();

            if (!validarCorreo(correo)) {
                mensajeRegistro.textContent = "⚠️ El correo no es válido";
                mensajeRegistro.style.color = "red";
                mensajeRegistro.style.display = "block";
                return;
            }


            const formData = new FormData(formRegistro);

            fetch(formRegistro.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'RequestVerificationToken': document.getElementsByName('__RequestVerificationToken')[0].value
                }
            })
                .then(response => response.json())
                .then(data => {
                    mensajeRegistro.textContent = data.message;
                    mensajeRegistro.style.color = data.success ? "green" : "red";
                    mensajeRegistro.style.display = "block";

                    if (data.success) {
                        formRegistro.reset();
                        ocultarBotonesFlotantes();
                    }

                    setTimeout(() => mensajeRegistro.style.display = "none", 5000);
                })
                .catch(error => {
                    console.error('Error:', error);
                    mensajeRegistro.textContent = "Ocurrió un error inesperado al conectar con el servidor.";
                    mensajeRegistro.style.color = "red";
                    mensajeRegistro.style.display = "block";
                });
        });
    }

    // =========================================
    // MODAL DE LOGIN DE CLIENTES
    // =========================================
    const btnLogin = document.getElementById("btn-login");
    const modalLogin = document.getElementById("modal-login");
    const cerrarLogin = document.querySelector(".cerrar-login");
    const formLogin = document.getElementById("form-login");
    const mensajeLogin = document.getElementById("mensaje-login");

    if (btnLogin) btnLogin.addEventListener("click", () => modalLogin.style.display = "block");
    if (cerrarLogin) cerrarLogin.addEventListener("click", () => modalLogin.style.display = "none");
    window.addEventListener("click", (event) => { if (event.target === modalLogin) modalLogin.style.display = "none"; });

    if (formLogin) {
        formLogin.addEventListener("submit", function (event) {
            event.preventDefault();

            const formData = new FormData(formLogin);

            fetch(formLogin.action, {
                method: 'POST',
                body: formData,
                headers: { 'RequestVerificationToken': document.getElementsByName('__RequestVerificationToken')[0].value }
            })
                .then(response => response.json())
                .then(data => {
                    mensajeLogin.textContent = data.message;
                    mensajeLogin.style.color = data.success ? "green" : "red";
                    mensajeLogin.style.display = "block";

                    if (data.success) ocultarBotonesFlotantes();
                })
                .catch(error => {
                    console.error('Error:', error);
                    mensajeLogin.textContent = "Ocurrió un error inesperado al conectar con el servidor.";
                    mensajeLogin.style.color = "red";
                    mensajeLogin.style.display = "block";
                });
        });
    }
});
