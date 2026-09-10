function obtenerContenedorNotificaciones() {

    let contenedor =
        document.getElementById(
            "notificaciones"
        );


    if (!contenedor) {

        contenedor =
            document.createElement("div");

        contenedor.id =
            "notificaciones";

        document.body.appendChild(
            contenedor
        );

    }


    return contenedor;

}



function mostrarNotificacion(
    mensaje,
    tipo = "exito"
) {

    const contenedor =
        obtenerContenedorNotificaciones();


    const notificacion =
        document.createElement("div");


    notificacion.className =
        "notificacion";


    let icono = "✓";


    if (tipo === "advertencia") {

        notificacion.classList.add(
            "advertencia"
        );

        icono = "!";

    }


    if (tipo === "error") {

        notificacion.classList.add(
            "notificacion-error"
        );

        icono = "×";

    }


    notificacion.innerHTML = `

        <span class="notificacion-icono">

            ${icono}

        </span>


        <span class="notificacion-mensaje">

            ${mensaje}

        </span>


        <button
            class="notificacion-cerrar"
            type="button">

            ×

        </button>

    `;


    contenedor.appendChild(
        notificacion
    );


    setTimeout(
        function() {

            notificacion.classList.add(
                "mostrar"
            );

        },
        10
    );


    function cerrar() {

        notificacion.classList.remove(
            "mostrar"
        );


        setTimeout(
            function() {

                notificacion.remove();

            },
            250
        );

    }


    notificacion
        .querySelector(
            ".notificacion-cerrar"
        )
        .addEventListener(
            "click",
            cerrar
        );


    setTimeout(
        cerrar,
        3200
    );

}