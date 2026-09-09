const productos = [

    {
        codigo: "FR001",
        nombre: "Manzanas Fuji",
        precio: 1200,
        stock: 150,
        descripcion: "Manzanas Fuji crujientes y dulces cultivadas en el Valle del Maule.",
        imagen: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=700&q=80"
    },

    {
        codigo: "FR002",
        nombre: "Naranjas Valencia",
        precio: 1000,
        stock: 200,
        descripcion: "Naranjas jugosas y ricas en vitamina C.",
        imagen: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=700&q=80"
    },

    {
        codigo: "FR003",
        nombre: "Plátanos Cavendish",
        precio: 800,
        stock: 250,
        descripcion: "Plátanos maduros y dulces ideales para desayuno.",
        imagen: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=700&q=80"
    },

    {
        codigo: "VR001",
        nombre: "Zanahorias Orgánicas",
        precio: 900,
        stock: 100,
        descripcion: "Zanahorias cultivadas sin pesticidas.",
        imagen: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=700&q=80"
    },

    {
        codigo: "VR002",
        nombre: "Espinacas Frescas",
        precio: 700,
        stock: 80,
        descripcion: "Espinacas frescas ideales para ensaladas.",
        imagen: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=80"
    },

    {
        codigo: "VR003",
        nombre: "Pimientos Tricolores",
        precio: 1500,
        stock: 120,
        descripcion: "Pimientos rojos, amarillos y verdes.",
        imagen: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=700&q=80"
    },

    {
        codigo: "PO001",
        nombre: "Miel Orgánica",
        precio: 5000,
        stock: 50,
        descripcion: "Miel pura producida por apicultores locales.",
        imagen: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=700&q=80"
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