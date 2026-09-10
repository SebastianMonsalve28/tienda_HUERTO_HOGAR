document.addEventListener(
    "DOMContentLoaded",
    function () {

        const sesion =
            localStorage.getItem(
                "sesionHuertoHogar"
            );


        const usuario =
            document.querySelector(
                ".usuario"
            );


        if (!usuario) {
            return;
        }


        if (sesion) {

            usuario.innerHTML = `

                <span class="usuario-sesion">
                    Sesión iniciada
                </span>

                <button
                    id="cerrarSesion"
                    class="cerrar-sesion"
                    type="button">

                    Cerrar sesión

                </button>

                <a
                    href="carrito.html"
                    class="enlace-carrito">

                    Carrito
                    (<span id="contadorCarrito">0</span>)

                </a>

            `;


            const cerrarSesion =
                document.getElementById(
                    "cerrarSesion"
                );


            cerrarSesion.addEventListener(
                "click",
                function () {

                    localStorage.removeItem(
                        "sesionHuertoHogar"
                    );


                    window.location.href =
                        "index.html";

                }
            );

        }

    }
);