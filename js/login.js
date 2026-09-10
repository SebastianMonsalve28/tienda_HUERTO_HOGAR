/* =========================================
   CORREOS PERMITIDOS
========================================= */

const dominiosPermitidos = [
    "duoc.cl",
    "profesor.duoc.cl",
    "gmail.com"
];


/* =========================================
   VALIDAR CORREO
========================================= */

function correoPermitido(correo) {

    correo = correo.trim().toLowerCase();

    const formatoCorreo =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!formatoCorreo.test(correo)) {

        return false;

    }


    const partes =
        correo.split("@");


    const dominio =
        partes[1];


    return dominiosPermitidos.includes(
        dominio
    );

}


/* =========================================
   VALIDAR NOMBRE Y APELLIDOS
========================================= */

function nombreValido(texto) {

    const expresion =
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;


    return expresion.test(
        texto.trim()
    );

}


/* =========================================
   VALIDAR RUN CHILENO
========================================= */

function validarRun(run) {

    run =
        run
            .trim()
            .toUpperCase();


    /*
        Debe venir sin puntos ni guion.

        Ejemplo de formato:
        190110222
    */

    if (
        !/^[0-9]{6,8}[0-9K]$/.test(run)
    ) {

        return false;

    }


    const cuerpo =
        run.slice(0, -1);


    const digitoIngresado =
        run.slice(-1);


    let suma = 0;

    let multiplicador = 2;


    for (
        let i = cuerpo.length - 1;
        i >= 0;
        i--
    ) {

        suma =
            suma +
            Number(cuerpo[i]) *
            multiplicador;


        multiplicador++;


        if (
            multiplicador === 8
        ) {

            multiplicador = 2;

        }

    }


    const resultado =
        11 - (suma % 11);


    let digitoCorrecto;


    if (
        resultado === 11
    ) {

        digitoCorrecto = "0";

    }

    else if (
        resultado === 10
    ) {

        digitoCorrecto = "K";

    }

    else {

        digitoCorrecto =
            resultado.toString();

    }


    return (
        digitoIngresado ===
        digitoCorrecto
    );

}


/* =========================================
   LOGIN
========================================= */

const loginForm =
    document.getElementById(
        "loginForm"
    );


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


            /* LIMPIAR ERRORES */

            errorCorreo.textContent = "";

            errorPassword.textContent = "";

            exito.textContent = "";


            let correcto = true;


            /* =============================
               VALIDAR CORREO LOGIN
            ============================= */

            if (
                correo.value.trim() === ""
            ) {

                errorCorreo.textContent =
                    "El correo es obligatorio.";

                correcto = false;

            }

            else if (
                correo.value.trim().length > 100
            ) {

                errorCorreo.textContent =
                    "El correo no puede superar los 100 caracteres.";

                correcto = false;

            }

            else if (
                !correoPermitido(
                    correo.value
                )
            ) {

                errorCorreo.textContent =
                    "Use un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";

                correcto = false;

            }


            /* =============================
               VALIDAR CONTRASEÑA LOGIN
            ============================= */

            if (
                password.value === ""
            ) {

                errorPassword.textContent =
                    "La contraseña es obligatoria.";

                correcto = false;

            }

            else if (
                password.value.length < 4 ||
                password.value.length > 10
            ) {

                errorPassword.textContent =
                    "La contraseña debe tener entre 4 y 10 caracteres.";

                correcto = false;

            }


            /* =============================
               LOGIN CORRECTO
            ============================= */

            if (correcto) {


                /*
                    Guardamos el correo para indicar
                    que existe una sesión iniciada.
                */

                localStorage.setItem(
                    "sesionHuertoHogar",
                    correo.value
                        .trim()
                        .toLowerCase()
                );


                exito.textContent =
                    "Inicio de sesión correcto.";


                /*
                    Después de un momento
                    vuelve al inicio.
                */

                setTimeout(
                    function() {

                        window.location.href =
                            "index.html";

                    },
                    700
                );

            }

        }
    );


}


/* =========================================
   REGIONES Y COMUNAS
========================================= */

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
    document.getElementById(
        "region"
    );


const comuna =
    document.getElementById(
        "comuna"
    );


if (
    region &&
    comuna
) {


    Object.keys(
        regiones
    ).forEach(
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


    /* CAMBIAR COMUNAS */

    region.addEventListener(
        "change",
        function() {


            comuna.innerHTML = `

                <option value="">

                    Seleccione comuna

                </option>

            `;


            const comunas =
                regiones[
                    region.value
                ];


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


/* =========================================
   REGISTRO
========================================= */

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
                document.getElementById(
                    "run"
                );


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


            const mensajeExito =
                document.getElementById(
                    "registroExito"
                );


            let correcto = true;


            /* =================================
               LIMPIAR MENSAJES
            ================================= */

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


            mensajeExito.textContent = "";


            /* =================================
               VALIDAR RUN
            ================================= */

            if (
                run.value.trim() === ""
            ) {

                document.getElementById(
                    "errorRun"
                ).textContent =
                    "El RUN es obligatorio.";

                correcto = false;

            }

            else if (
                run.value.trim().length < 7 ||
                run.value.trim().length > 9
            ) {

                document.getElementById(
                    "errorRun"
                ).textContent =
                    "El RUN debe tener entre 7 y 9 caracteres.";

                correcto = false;

            }

            else if (
                !validarRun(
                    run.value
                )
            ) {

                document.getElementById(
                    "errorRun"
                ).textContent =
                    "Ingrese un RUN válido, sin puntos ni guion.";

                correcto = false;

            }


            /* =================================
               VALIDAR NOMBRE
            ================================= */

            if (
                nombre.value.trim() === ""
            ) {

                document.getElementById(
                    "errorNombreRegistro"
                ).textContent =
                    "El nombre es obligatorio.";

                correcto = false;

            }

            else if (
                nombre.value.trim().length > 50
            ) {

                document.getElementById(
                    "errorNombreRegistro"
                ).textContent =
                    "El nombre no puede superar los 50 caracteres.";

                correcto = false;

            }

            else if (
                !nombreValido(
                    nombre.value
                )
            ) {

                document.getElementById(
                    "errorNombreRegistro"
                ).textContent =
                    "El nombre solo puede contener letras.";

                correcto = false;

            }


            /* =================================
               VALIDAR APELLIDOS
            ================================= */

            if (
                apellidos.value.trim() === ""
            ) {

                document.getElementById(
                    "errorApellidosRegistro"
                ).textContent =
                    "Los apellidos son obligatorios.";

                correcto = false;

            }

            else if (
                apellidos.value.trim().length > 100
            ) {

                document.getElementById(
                    "errorApellidosRegistro"
                ).textContent =
                    "Los apellidos no pueden superar los 100 caracteres.";

                correcto = false;

            }

            else if (
                !nombreValido(
                    apellidos.value
                )
            ) {

                document.getElementById(
                    "errorApellidosRegistro"
                ).textContent =
                    "Los apellidos solo pueden contener letras.";

                correcto = false;

            }


            /* =================================
               VALIDAR CORREO
            ================================= */

            if (
                correo.value.trim() === ""
            ) {

                document.getElementById(
                    "errorCorreoRegistro"
                ).textContent =
                    "El correo es obligatorio.";

                correcto = false;

            }

            else if (
                correo.value.trim().length > 100
            ) {

                document.getElementById(
                    "errorCorreoRegistro"
                ).textContent =
                    "El correo no puede superar los 100 caracteres.";

                correcto = false;

            }

            else if (
                !correoPermitido(
                    correo.value
                )
            ) {

                document.getElementById(
                    "errorCorreoRegistro"
                ).textContent =
                    "Use un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";

                correcto = false;

            }


            /* =================================
               VALIDAR CONTRASEÑA
            ================================= */

            if (
                password.value === ""
            ) {

                document.getElementById(
                    "errorPasswordRegistro"
                ).textContent =
                    "La contraseña es obligatoria.";

                correcto = false;

            }

            else if (
                password.value.length < 4 ||
                password.value.length > 10
            ) {

                document.getElementById(
                    "errorPasswordRegistro"
                ).textContent =
                    "La contraseña debe tener entre 4 y 10 caracteres.";

                correcto = false;

            }


            /* =================================
               VALIDAR REGIÓN
            ================================= */

            if (
                region.value === ""
            ) {

                document.getElementById(
                    "errorRegion"
                ).textContent =
                    "Seleccione una región.";

                correcto = false;

            }


            /* =================================
               VALIDAR COMUNA
            ================================= */

            if (
                comuna.value === ""
            ) {

                document.getElementById(
                    "errorComuna"
                ).textContent =
                    "Seleccione una comuna.";

                correcto = false;

            }


            /* =================================
               VALIDAR DIRECCIÓN
            ================================= */

            if (
                direccion.value.trim() === ""
            ) {

                document.getElementById(
                    "errorDireccion"
                ).textContent =
                    "La dirección es obligatoria.";

                correcto = false;

            }

            else if (
                direccion.value.trim().length > 300
            ) {

                document.getElementById(
                    "errorDireccion"
                ).textContent =
                    "La dirección no puede superar los 300 caracteres.";

                correcto = false;

            }


            /* =================================
               REGISTRO CORRECTO
            ================================= */

            if (correcto) {


                mensajeExito.textContent =
                    "Usuario registrado correctamente.";


                registroForm.reset();


                comuna.innerHTML = `

                    <option value="">

                        Seleccione comuna

                    </option>

                `;

            }

        }
    );

}