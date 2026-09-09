const formulario =
    document.getElementById("contactoForm");


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
            document.getElementById("errorComentario");


        const mensajeExito =
            document.getElementById("mensajeExito");


        errorNombre.textContent = "";

        errorCorreo.textContent = "";

        errorComentario.textContent = "";

        mensajeExito.textContent = "";


        let correcto = true;



        if (nombre.value.trim() === "") {

            errorNombre.textContent =
                "El nombre es obligatorio.";

            correcto = false;

        }



        const dominios = [

            "@duoc.cl",

            "@profesor.duoc.cl",

            "@gmail.com"

        ];



        if (correo.value !== "") {


            let correoCorrecto =
                dominios.some(function(dominio) {

                    return correo.value
                        .toLowerCase()
                        .endsWith(dominio);

                });


            if (!correoCorrecto) {

                errorCorreo.textContent =
                    "Correo no permitido.";

                correcto = false;

            }

        }



        if (comentario.value.trim() === "") {

            errorComentario.textContent =
                "El comentario es obligatorio.";

            correcto = false;

        }



        if (comentario.value.length > 500) {

            errorComentario.textContent =
                "Máximo 500 caracteres.";

            correcto = false;

        }



        if (correcto) {

            mensajeExito.textContent =
                "Mensaje enviado correctamente.";


            formulario.reset();

        }

    }
);