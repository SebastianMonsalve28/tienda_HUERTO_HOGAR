const formulario =
    document.getElementById("contactoForm");


const dominiosPermitidos = [
    "duoc.cl",
    "profesor.duoc.cl",
    "gmail.com"
];


function nombreValido(nombre) {

    const expresion =
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

    return expresion.test(nombre);

}


function correoValido(correo) {

    const expresion =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!expresion.test(correo)) {
        return false;
    }


    const dominio =
        correo
            .split("@")[1]
            .toLowerCase();


    return dominiosPermitidos.includes(
        dominio
    );

}


if (formulario) {


    formulario.addEventListener(
        "submit",
        function(evento) {


            evento.preventDefault();


            const nombre =
                document.getElementById("nombre");


            const correo =
                document.getElementById("correo");


            const comentario =
                document.getElementById("comentario");


            const errorNombre =
                document.getElementById("errorNombre");


            const errorCorreo =
                document.getElementById("errorCorreo");


            const errorComentario =
                document.getElementById(
                    "errorComentario"
                );


            const mensajeExito =
                document.getElementById(
                    "mensajeExito"
                );


            errorNombre.textContent = "";

            errorCorreo.textContent = "";

            errorComentario.textContent = "";

            mensajeExito.textContent = "";


            let correcto = true;


            /* NOMBRE */

            if (
                nombre.value.trim() === ""
            ) {

                errorNombre.textContent =
                    "El nombre es obligatorio.";

                correcto = false;

            }

            else if (
                nombre.value.trim().length > 100
            ) {

                errorNombre.textContent =
                    "El nombre no puede superar los 100 caracteres.";

                correcto = false;

            }

            else if (
                !nombreValido(
                    nombre.value.trim()
                )
            ) {

                errorNombre.textContent =
                    "El nombre solo puede contener letras.";

                correcto = false;

            }


            /* CORREO */

            if (
                correo.value.trim() !== ""
            ) {


                if (
                    correo.value.length > 100
                ) {

                    errorCorreo.textContent =
                        "El correo no puede superar los 100 caracteres.";

                    correcto = false;

                }

                else if (
                    !correoValido(
                        correo.value.trim()
                    )
                ) {

                    errorCorreo.textContent =
                        "Use un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";

                    correcto = false;

                }

            }


            /* COMENTARIO */

            if (
                comentario.value.trim() === ""
            ) {

                errorComentario.textContent =
                    "El comentario es obligatorio.";

                correcto = false;

            }

            else if (
                comentario.value.length > 500
            ) {

                errorComentario.textContent =
                    "El comentario no puede superar los 500 caracteres.";

                correcto = false;

            }


            /* CORRECTO */

            if (correcto) {

                mensajeExito.textContent =
                    "Mensaje enviado correctamente.";

                formulario.reset();

            }

        }
    );

}