const productos = [

    {
        codigo: "FR001",
        nombre: "Manzanas Fuji",
        precio: 1200,
        stock: 150,
        descripcion: "Manzanas Fuji crujientes y dulces cultivadas en el Valle del Maule.",
        imagen: "img/manzanas.jpg"
    },

    {
        codigo: "FR002",
        nombre: "Naranjas",
        precio: 1000,
        stock: 200,
        descripcion: "Naranjas jugosas y ricas en vitamina C.",
        imagen: "img/naranjas.jpg"
    },

    {
        codigo: "FR003",
        nombre: "Plátanos",
        precio: 800,
        stock: 250,
        descripcion: "Plátanos maduros y dulces ideales para desayuno.",
        imagen: "img/platanos.jpg"
    },

    {
        codigo: "VR001",
        nombre: "Zanahorias",
        precio: 900,
        stock: 100,
        descripcion: "Zanahorias cultivadas sin pesticidas.",
        imagen: "img/zanahorias.jpg"
    },

    {
        codigo: "VR002",
        nombre: "Espinacas Frescas",
        precio: 700,
        stock: 80,
        descripcion: "Espinacas frescas ideales para ensaladas.",
        imagen: "img/espinacas.jpg"
    },

    {
        codigo: "VR003",
        nombre: "Pimientos Tricolores",
        precio: 1500,
        stock: 120,
        descripcion: "Pimientos rojos, amarillos y verdes.",
        imagen: "img/pimientos.jpg"
    },

    {
        codigo: "PO001",
        nombre: "Miel",
        precio: 5000,
        stock: 50,
        descripcion: "Miel pura producida por apicultores locales.",
        imagen: "img/miel.jpg"
    }

];

function mostrarProductos() {

    const contenedor =
        document.getElementById("listaProductos");


    if (!contenedor) {

        return;

    }

    productos.forEach(function(producto) {

        contenedor.innerHTML += `

            <article class="producto">

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}">

                <h3>
                    ${producto.nombre}
                </h3>

                <p>
                    Precio:
                    $${producto.precio.toLocaleString("es-CL")}
                </p>

                <p>
                    Stock:
                    ${producto.stock}
                </p>


                <a
                    class="boton secundario"
                    href="detalle-producto.html?id=${producto.codigo}">

                    Ver detalle

                </a>


                <button
                    class="boton"
                    onclick="agregarAlCarrito('${producto.codigo}')">

                    Agregar

                </button>

            </article>

        `;

    });

}

function mostrarDetalle() {

    const contenedor =
        document.getElementById("detalleProducto");


    if (!contenedor) {

        return;

    }

    const parametros =
        new URLSearchParams(window.location.search);


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


        <article>

            <h2>
                ${producto.nombre}
            </h2>


            <p>
                ${producto.descripcion}
            </p>


            <p>
                <strong>Código:</strong>
                ${producto.codigo}
            </p>


            <p>
                <strong>Precio:</strong>
                $${producto.precio.toLocaleString("es-CL")}
            </p>


            <p>
                <strong>Stock:</strong>
                ${producto.stock}
            </p>


            <button
                class="boton"
                onclick="agregarAlCarrito('${producto.codigo}')">

                Agregar al carrito

            </button>

        </article>

    `;

}
mostrarProductos();
mostrarDetalle();