const productos = [

    {
        codigo: "FR001",
        nombre: "Manzanas Fuji",
        categoria: "frutas",
        categoriaNombre: "Frutas Frescas",
        precio: 1200,
        stock: 150,
        descripcion: "Manzanas Fuji crujientes y dulces cultivadas en el Valle del Maule.",
        imagen: "img/manzanas.jpg"
    },

    {
        codigo: "FR002",
        nombre: "Naranjas",
        categoria: "frutas",
        categoriaNombre: "Frutas Frescas",
        precio: 1000,
        stock: 200,
        descripcion: "Naranjas jugosas y ricas en vitamina C.",
        imagen: "img/naranjas.jpg"
    },

    {
        codigo: "FR003",
        nombre: "Plátanos",
        categoria: "frutas",
        categoriaNombre: "Frutas Frescas",
        precio: 800,
        stock: 250,
        descripcion: "Plátanos maduros y dulces ideales para desayuno.",
        imagen: "img/platanos.jpg"
    },

    {
        codigo: "VR001",
        nombre: "Zanahorias",
        categoria: "verduras",
        categoriaNombre: "Verduras Orgánicas",
        precio: 900,
        stock: 100,
        descripcion: "Zanahorias cultivadas sin pesticidas.",
        imagen: "img/zanahorias.jpg"
    },

    {
        codigo: "VR002",
        nombre: "Espinacas",
        categoria: "verduras",
        categoriaNombre: "Verduras Orgánicas",
        precio: 700,
        stock: 80,
        descripcion: "Espinacas frescas ideales para ensaladas.",
        imagen: "img/espinacas.jpg"
    },

    {
        codigo: "VR003",
        nombre: "Pimientos Tricolores",
        categoria: "verduras",
        categoriaNombre: "Verduras Orgánicas",
        precio: 1500,
        stock: 120,
        descripcion: "Pimientos rojos, amarillos y verdes.",
        imagen: "img/pimientos.jpg"
    },

    {
        codigo: "PO001",
        nombre: "Miel",
        categoria: "organicos",
        categoriaNombre: "Productos Orgánicos",
        precio: 5000,
        stock: 50,
        descripcion: "Miel pura producida por apicultores locales.",
        imagen: "img/miel.jpg"
    }

];


function formatoPrecio(precio) {

    return "$" +
        precio.toLocaleString("es-CL");

}


function mostrarProductos(lista = productos) {

    const contenedor =
        document.getElementById(
            "listaProductos"
        );


    if (!contenedor) {

        return;

    }


    contenedor.innerHTML = "";


    lista.forEach(function(producto) {


        contenedor.innerHTML += `

            <article class="producto">


                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}">


                <p class="stock-producto">

                    ${producto.categoriaNombre}

                </p>


                <h3>

                    ${producto.nombre}

                </h3>


                <p class="descripcion-producto">

                    ${producto.descripcion}

                </p>


                <p class="precio-producto">

                    ${formatoPrecio(producto.precio)}

                </p>

                <div class="acciones-producto">


                    <a
                        class="boton secundario"
                        href="detalle-producto.html?id=${producto.codigo}">

                        Ver detalle

                    </a>


                    <button
                        class="boton"
                        type="button"
                        onclick="agregarAlCarrito('${producto.codigo}')">

                        Agregar

                    </button>


                </div>


            </article>

        `;

    });

}



function mostrarDetalle() {

    const contenedor =
        document.getElementById(
            "detalleProducto"
        );


    if (!contenedor) {

        return;

    }


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    let codigo =
        parametros.get("id");


    if (!codigo) {

        codigo = "FR001";

    }


    const producto =
        productos.find(function(p) {

            return p.codigo === codigo;

        });


    if (!producto) {

        contenedor.innerHTML =
            "<p>Producto no encontrado.</p>";

        return;

    }


    contenedor.className =
        "detalle-producto";

    contenedor.innerHTML = `

        <img
            src="${producto.imagen}"
            alt="${producto.nombre}">


        <article class="detalle-info">


            <p>

                ${producto.categoriaNombre}

            </p>


            <h1>

                ${producto.nombre}

            </h1>


            <p class="precio-detalle">

                ${formatoPrecio(producto.precio)}

            </p>


            <p>

                ${producto.descripcion}

            </p>


            <p>

                <strong>
                    Código:
                </strong>

                ${producto.codigo}

            </p>

            <div class="selector-cantidad">


                <label for="cantidadDetalle">

                    Cantidad:

                </label>


                <input
                    id="cantidadDetalle"
                    type="number"
                    min="1"
                    value="1">


            </div>


            <button
                class="boton"
                type="button"
                onclick="agregarDetalleAlCarrito('${producto.codigo}')">

                Agregar al carrito

            </button>


        </article>

    `;

}

function agregarDetalleAlCarrito(codigo) {

    const entrada =
        document.getElementById(
            "cantidadDetalle"
        );


    let cantidad = 1;


    if (entrada) {

        cantidad =
            parseInt(entrada.value);


        if (
            isNaN(cantidad) ||
            cantidad < 1
        ) {

            cantidad = 1;

        }

    }


    agregarAlCarrito(
        codigo,
        cantidad
    );

}

function configurarFiltros() {

    const botones =
        document.querySelectorAll(
            ".filtro-btn"
        );


    botones.forEach(
        function(boton) {


            boton.addEventListener(
                "click",
                function() {


                    botones.forEach(
                        function(otroBoton) {

                            otroBoton.classList.remove(
                                "activo"
                            );

                        }
                    );


                    boton.classList.add(
                        "activo"
                    );


                    const categoria =
                        boton.dataset.categoria;


                    if (
                        categoria === "todos"
                    ) {

                        mostrarProductos(
                            productos
                        );

                    }

                    else {

                        const filtrados =
                            productos.filter(
                                function(producto) {

                                    return producto.categoria === categoria;

                                }
                            );


                        mostrarProductos(
                            filtrados
                        );

                    }

                }
            );

        }
    );

}



document.addEventListener(
    "DOMContentLoaded",
    function() {

        mostrarProductos();

        mostrarDetalle();

        configurarFiltros();

    }
);