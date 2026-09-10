function obtenerCarrito() {

    const guardado =
        localStorage.getItem(
            "carrito"
        );


    if (guardado) {

        return JSON.parse(
            guardado
        );

    }


    return [];

}



function guardarCarrito(carrito) {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );


    actualizarContador();

}



function notificar(
    mensaje,
    tipo = "exito"
) {

    if (
        typeof mostrarNotificacion ===
        "function"
    ) {

        mostrarNotificacion(
            mensaje,
            tipo
        );

    }

    else {

        alert(mensaje);

    }

}



function agregarAlCarrito(
    codigo,
    cantidad = 1
) {

    const producto =
        productos.find(
            function(p) {

                return p.codigo === codigo;

            }
        );


    if (!producto) {

        return;

    }


    cantidad =
        parseInt(cantidad);


    if (
        isNaN(cantidad) ||
        cantidad < 1
    ) {

        cantidad = 1;

    }


    let carrito =
        obtenerCarrito();


    const productoExistente =
        carrito.find(
            function(p) {

                return p.codigo === codigo;

            }
        );


    if (productoExistente) {

        productoExistente.cantidad +=
            cantidad;

    }

    else {

        carrito.push({

            codigo:
                producto.codigo,

            nombre:
                producto.nombre,

            precio:
                producto.precio,

            imagen:
                producto.imagen,

            cantidad:
                cantidad

        });

    }


    guardarCarrito(
        carrito
    );


    notificar(

        producto.nombre +
        " fue agregado al carrito."

    );

}



function actualizarContador() {

    const contador =
        document.getElementById(
            "contadorCarrito"
        );


    if (!contador) {

        return;

    }


    const carrito =
        obtenerCarrito();


    let cantidad = 0;


    carrito.forEach(
        function(producto) {

            cantidad +=
                producto.cantidad;

        }
    );


    contador.textContent =
        cantidad;

}



function cambiarCantidad(
    codigo,
    cambio
) {

    let carrito =
        obtenerCarrito();


    const producto =
        carrito.find(
            function(p) {

                return p.codigo === codigo;

            }
        );


    if (!producto) {

        return;

    }


    producto.cantidad +=
        cambio;


    if (
        producto.cantidad <= 0
    ) {

        carrito =
            carrito.filter(
                function(p) {

                    return p.codigo !== codigo;

                }
            );


        notificar(
            "Producto eliminado del carrito.",
            "advertencia"
        );

    }


    guardarCarrito(
        carrito
    );


    mostrarCarrito();

}



function eliminarProducto(codigo) {

    let carrito =
        obtenerCarrito();


    const producto =
        carrito.find(
            function(p) {

                return p.codigo === codigo;

            }
        );


    carrito =
        carrito.filter(
            function(p) {

                return p.codigo !== codigo;

            }
        );


    guardarCarrito(
        carrito
    );


    mostrarCarrito();


    if (producto) {

        notificar(

            producto.nombre +
            " fue eliminado del carrito.",

            "advertencia"

        );

    }

}



function mostrarCarrito() {

    const contenedor =
        document.getElementById(
            "carritoContenido"
        );


    if (!contenedor) {

        return;

    }


    const carrito =
        obtenerCarrito();


    const totalCarrito =
        document.getElementById(
            "totalCarrito"
        );


    const subtotalCarrito =
        document.getElementById(
            "subtotalCarrito"
        );


    const cantidadResumen =
        document.getElementById(
            "cantidadResumen"
        );


    if (
        carrito.length === 0
    ) {


        contenedor.innerHTML = `

            <div class="carrito-vacio">

                <h2>
                    Tu carrito está vacío
                </h2>

                <p>
                    Agrega productos del catálogo
                    para verlos aquí.
                </p>

                <a
                    href="productos.html"
                    class="boton">

                    Ver productos

                </a>

            </div>

        `;


        totalCarrito.textContent =
            "$0";


        subtotalCarrito.textContent =
            "$0";


        cantidadResumen.textContent =
            "0";


        return;

    }


    let total = 0;

    let cantidadTotal = 0;


    contenedor.innerHTML =
        "";


    carrito.forEach(
        function(producto) {


            const subtotal =
                producto.precio *
                producto.cantidad;


            total +=
                subtotal;


            cantidadTotal +=
                producto.cantidad;


            contenedor.innerHTML += `


                <article class="item-carrito">


                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}">


                    <div>

                        <h3>
                            ${producto.nombre}
                        </h3>

                        <p>
                            $${producto.precio.toLocaleString("es-CL")}
                            c/u
                        </p>

                    </div>


                    <div class="cantidad-carrito">


                        <button
                            type="button"
                            class="boton-cantidad"
                            onclick="cambiarCantidad('${producto.codigo}', -1)">

                            -

                        </button>


                        <strong>

                            ${producto.cantidad}

                        </strong>


                        <button
                            type="button"
                            class="boton-cantidad"
                            onclick="cambiarCantidad('${producto.codigo}', 1)">

                            +

                        </button>


                    </div>


                    <div class="subtotal-carrito">

                        $${subtotal.toLocaleString("es-CL")}

                    </div>


                    <button
                        class="boton-eliminar"
                        type="button"
                        onclick="eliminarProducto('${producto.codigo}')">

                        🗑

                    </button>


                </article>


            `;

        }
    );


    totalCarrito.textContent =
        "$" +
        total.toLocaleString(
            "es-CL"
        );


    subtotalCarrito.textContent =
        "$" +
        total.toLocaleString(
            "es-CL"
        );


    cantidadResumen.textContent =
        cantidadTotal;

}



document.addEventListener(
    "DOMContentLoaded",
    function() {


        actualizarContador();

        mostrarCarrito();


        const vaciar =
            document.getElementById(
                "vaciarCarrito"
            );


        if (vaciar) {


            vaciar.addEventListener(
                "click",
                function() {


                    if (
                        obtenerCarrito().length === 0
                    ) {

                        notificar(
                            "El carrito ya está vacío.",
                            "advertencia"
                        );

                        return;

                    }


                    localStorage.removeItem(
                        "carrito"
                    );


                    actualizarContador();

                    mostrarCarrito();


                    notificar(
                        "Se vació el carrito.",
                        "advertencia"
                    );

                }
            );

        }


        const pagar =
            document.getElementById(
                "pagarCarrito"
            );


        if (pagar) {


            pagar.addEventListener(
                "click",
                function() {


                    if (
                        obtenerCarrito().length === 0
                    ) {

                        notificar(

                            "Debes agregar productos antes de comprar.",

                            "advertencia"

                        );

                        return;

                    }


                    localStorage.removeItem(
                        "carrito"
                    );


                    actualizarContador();

                    mostrarCarrito();


                    notificar(

                        "Compra realizada correctamente. ¡Gracias por tu pedido!"

                    );

                }
            );

        }

    }
);