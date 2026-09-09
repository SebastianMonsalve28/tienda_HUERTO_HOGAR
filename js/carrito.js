function obtenerCarrito() {

    let carrito =
        localStorage.getItem("carrito");


    if (carrito) {

        return JSON.parse(carrito);

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

function agregarAlCarrito(codigo) {

    const producto =
        productos.find(function(p) {

            return p.codigo === codigo;

        });


    if (!producto) {

        return;

    }


    let carrito =
        obtenerCarrito();


    let productoExistente =
        carrito.find(function(p) {

            return p.codigo === codigo;

        });


    if (productoExistente) {

        productoExistente.cantidad++;

    }

    else {

        carrito.push({

            codigo: producto.codigo,

            nombre: producto.nombre,

            precio: producto.precio,

            imagen: producto.imagen,

            cantidad: 1

        });

    }


    guardarCarrito(carrito);


    alert(
        producto.nombre +
        " agregado al carrito"
    );

}

function actualizarContador() {

    let contador =
        document.getElementById(
            "contadorCarrito"
        );


    if (!contador) {

        return;

    }


    let carrito =
        obtenerCarrito();


    let cantidad = 0;


    carrito.forEach(function(producto) {

        cantidad +=
            producto.cantidad;

    });


    contador.textContent =
        cantidad;

}

function mostrarCarrito() {

    const contenedor =
        document.getElementById(
            "carritoContenido"
        );


    if (!contenedor) {

        return;

    }

    let carrito =
        obtenerCarrito();


    contenedor.innerHTML = "";


    if (carrito.length === 0) {

        contenedor.innerHTML =
            "<p>El carrito está vacío.</p>";


        document.getElementById(
            "totalCarrito"
        ).textContent = "$0";


        return;

    }


    let total = 0;

    carrito.forEach(function(producto) {


        total +=
            producto.precio *
            producto.cantidad;


        contenedor.innerHTML += `

            <article class="item-carrito">

                <div>

                    <h3>
                        ${producto.nombre}
                    </h3>

                    <p>
                        Cantidad:
                        ${producto.cantidad}
                    </p>

                    <p>
                        Precio:
                        $${producto.precio.toLocaleString("es-CL")}
                    </p>

                </div>


                <button
                    class="boton secundario"
                    onclick="eliminarProducto('${producto.codigo}')">

                    Eliminar

                </button>

            </article>

        `;

    });


    document.getElementById(
        "totalCarrito"
    ).textContent =
        "$" +
        total.toLocaleString("es-CL");

}

function eliminarProducto(codigo) {

    let carrito =
        obtenerCarrito();


    carrito =
        carrito.filter(function(producto) {

            return producto.codigo !== codigo;

        });


    guardarCarrito(carrito);

    mostrarCarrito();

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

                    localStorage.removeItem(
                        "carrito"
                    );

                    actualizarContador();

                    mostrarCarrito();

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

                    let carrito =
                        obtenerCarrito();


                    if (carrito.length === 0) {

                        alert(
                            "El carrito está vacío"
                        );

                    }

                    else {

                        alert(
                            "Compra realizada correctamente"
                        );

                        localStorage.removeItem(
                            "carrito"
                        );

                        actualizarContador();

                        mostrarCarrito();

                    }

                }
            );

        }

    }
);