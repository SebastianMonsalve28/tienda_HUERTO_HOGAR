const dominiosPermitidos = [

    "@duoc.cl",

    "@profesor.duoc.cl",

    "@gmail.com"

];

function correoPermitido(correo) {

    return dominiosPermitidos.some(
        function(dominio) {

            return correo
                .toLowerCase()
                .endsWith(dominio);

        }
    );

}

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {


    loginForm.addEventListener(
        "submit",
        function(evento) {


            evento.preventDefault();


            const correo =
                document.getElementById(
                    "correoLogin"
                );


            const password =
                document.getElementById(
                    "passwordLogin"
                );


            const errorCorreo =
                document.getElementById(
                    "errorCorreoLogin"
                );


            const errorPassword =
                document.getElementById(
                    "errorPasswordLogin"
                );


            const exito =
                document.getElementById(
                    "loginExito"
                );


            errorCorreo.textContent = "";

            errorPassword.textContent = "";

            exito.textContent = "";


            let correcto = true;



            if (correo.value.trim() === "") {

                errorCorreo.textContent =
                    "El correo es obligatorio.";

                correcto = false;

            }

            else if (
                !correoPermitido(
                    correo.value
                )
            ) {

                errorCorreo.textContent =
                    "Correo no permitido.";

                correcto = false;

            }



            if (
                password.value.length < 4 ||
                password.value.length > 10
            ) {

                errorPassword.textContent =
                    "La contraseña debe tener entre 4 y 10 caracteres.";

                correcto = false;

            }



            if (correcto) {

                exito.textContent =
                    "Inicio de sesión correcto.";

                loginForm.reset();

            }

        }
    );

}

const regiones = {

    "Región Metropolitana": [

        "Santiago",

        "Maipú",

        "Puente Alto"

    ],


    "Valparaíso": [

        "Valparaíso",

        "Viña del Mar",

        "Quilpué"

    ],


    "Biobío": [

        "Concepción",

        "Talcahuano",

        "Los Ángeles"

    ],


    "Los Lagos": [

        "Puerto Montt",

        "Puerto Varas",

        "Osorno"

    ]

};

const region =
    document.getElementById("region");


const comuna =
    document.getElementById("comuna");



if (region && comuna) {


    Object.keys(regiones).forEach(
        function(nombreRegion) {


            const opcion =
                document.createElement(
                    "option"
                );


            opcion.value =
                nombreRegion;


            opcion.textContent =
                nombreRegion;


            region.appendChild(
                opcion
            );

        }
    );



    region.addEventListener(
        "change",
        function() {


            comuna.innerHTML = `

                <option value="">

                    Seleccione comuna

                </option>

            `;


            const comunas =
                regiones[region.value];


            if (comunas) {


                comunas.forEach(
                    function(nombreComuna) {


                        const opcion =
                            document.createElement(
                                "option"
                            );


                        opcion.value =
                            nombreComuna;


                        opcion.textContent =
                            nombreComuna;


                        comuna.appendChild(
                            opcion
                        );

                    }
                );

            }

        }
    );

}

const registroForm =
    document.getElementById(
        "registroForm"
    );


if (registroForm) {

    registroForm.addEventListener(
        "submit",
        function(evento) {


            evento.preventDefault();


            const run =
                document.getElementById("run");


            const nombre =
                document.getElementById(
                    "nombreRegistro"
                );


            const apellidos =
                document.getElementById(
                    "apellidosRegistro"
                );


            const correo =
                document.getElementById(
                    "correoRegistro"
                );


            const password =
                document.getElementById(
                    "passwordRegistro"
                );


            const direccion =
                document.getElementById(
                    "direccion"
                );


            let correcto = true;



            document.getElementById(
                "errorRun"
            ).textContent = "";


            document.getElementById(
                "errorNombreRegistro"
            ).textContent = "";


            document.getElementById(
                "errorApellidosRegistro"
            ).textContent = "";


            document.getElementById(
                "errorCorreoRegistro"
            ).textContent = "";


            document.getElementById(
                "errorPasswordRegistro"
            ).textContent = "";


            document.getElementById(
                "errorRegion"
            ).textContent = "";


            document.getElementById(
                "errorComuna"
            ).textContent = "";


            document.getElementById(
                "errorDireccion"
            ).textContent = "";



            if (
                run.value.length < 7 ||
                run.value.length > 9
            ) {

                document.getElementById(
                    "errorRun"
                ).textContent =
                    "RUN inválido.";

                correcto = false;

            }



            if (
                nombre.value.trim() === ""
            ) {

                document.getElementById(
                    "errorNombreRegistro"
                ).textContent =
                    "Nombre obligatorio.";

                correcto = false;

            }



            if (
                apellidos.value.trim() === ""
            ) {

                document.getElementById(
                    "errorApellidosRegistro"
                ).textContent =
                    "Apellidos obligatorios.";

                correcto = false;

            }



            if (
                correo.value.trim() === "" ||
                !correoPermitido(
                    correo.value
                )
            ) {

                document.getElementById(
                    "errorCorreoRegistro"
                ).textContent =
                    "Correo no permitido.";

                correcto = false;

            }



            if (
                password.value.length < 4 ||
                password.value.length > 10
            ) {

                document.getElementById(
                    "errorPasswordRegistro"
                ).textContent =
                    "Debe tener entre 4 y 10 caracteres.";

                correcto = false;

            }



            if (
                region.value === ""
            ) {

                document.getElementById(
                    "errorRegion"
                ).textContent =
                    "Seleccione región.";

                correcto = false;

            }



            if (
                comuna.value === ""
            ) {

                document.getElementById(
                    "errorComuna"
                ).textContent =
                    "Seleccione comuna.";

                correcto = false;

            }



            if (
                direccion.value.trim() === ""
            ) {

                document.getElementById(
                    "errorDireccion"
                ).textContent =
                    "Dirección obligatoria.";

                correcto = false;

            }



            if (correcto) {

                document.getElementById(
                    "registroExito"
                ).textContent =
                    "Usuario registrado correctamente.";

                registroForm.reset();

            }

        }
    );

}