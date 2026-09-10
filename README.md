# HuertoHogar

Proyecto desarrollado para la asignatura Desarrollo Fullstack II - DSY1104.

HuertoHogar es una tienda online orientada a la venta de productos frescos, naturales y orgánicos. El sitio permite visualizar productos, revisar sus detalles, utilizar un carrito de compras, registrarse, iniciar sesión y acceder a distintas secciones informativas.

## Integrantes

- Sebastian Monsalve
- Lucas Parra

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- GitHub
- Visual Studio Code

## Funcionalidades

El sitio cuenta con las siguientes funciones:

- Página principal.
- Catálogo de productos.
- Filtros de productos por categoría.
- Vista de detalle de productos.
- Carrito de compras.
- Agregar y eliminar productos del carrito.
- Modificar cantidades del carrito.
- Cálculo del total de la compra.
- Inicio de sesión.
- Mantención de sesión mediante LocalStorage.
- Registro de usuarios.
- Formulario de contacto.
- Validaciones de formularios.
- Sección Nosotros.
- Blog con dos publicaciones.
- Video incorporado en la página principal.
- Panel de administración.
- Gestión visual de productos.
- Gestión visual de usuarios.

## Estructura del proyecto

```text
tienda_HUERTO_HOGAR/
│
├── admin/
│ ├── index.html
│ ├── productos.html
│ ├── nuevo-producto.html
│ ├── editar-producto.html
│ ├── usuarios.html
│ ├── nuevo-usuario.html
│ └── editar-usuario.html
│
├── css/
│ └── estilos.css
│
├── img/
│ └── imágenes utilizadas en el sitio
│
├── js/
│ ├── carrito.js
│ ├── contacto.js
│ ├── login.js
│ ├── notificaciones.js
│ ├── productos.js
│ └── sesion.js
│
├── video/
│ └── video.mp4
│
├── index.html
├── productos.html
├── detalle-producto.html
├── carrito.html
├── nosotros.html
├── blog.html
├── blog1.html
├── blog2.html
├── contacto.html
├── login.html
├── registro.html
└── README.md
```

## Páginas principales

### Inicio

`index.html`

Es la página principal de HuertoHogar. Contiene información de la tienda, productos destacados, navegación hacia las demás páginas y un video.

### Productos

`productos.html`

Muestra el catálogo de productos. Los productos son cargados mediante JavaScript y pueden filtrarse por categoría.

### Detalle del producto

`detalle-producto.html`

Muestra información del producto seleccionado y permite elegir una cantidad para agregarla al carrito.

### Carrito

`carrito.html`

Permite revisar los productos agregados, aumentar o disminuir cantidades, eliminar productos y visualizar el total de la compra.

La información del carrito se almacena utilizando LocalStorage.

### Nosotros

`nosotros.html`

Contiene información sobre HuertoHogar, su misión, visión y los integrantes que desarrollaron el proyecto.

### Blog

`blog.html`

Muestra publicaciones relacionadas con alimentación saludable y productos locales.

Los detalles de las publicaciones se encuentran en:

```text
blog1.html
blog2.html
```

### Contacto

`contacto.html`

Contiene un formulario para que los usuarios puedan enviar un mensaje.

### Inicio de sesión

`login.html`

Permite ingresar mediante correo y contraseña.

Cuando el inicio de sesión es correcto, la sesión se guarda utilizando LocalStorage para mantenerla mientras el usuario navega por las distintas páginas.

### Registro

`registro.html`

Permite ingresar los datos de un nuevo usuario mediante un formulario.

## Validaciones

Los formularios utilizan JavaScript para comprobar los datos ingresados.

Se validan elementos como:

- Campos obligatorios.
- Nombre y apellidos.
- RUN.
- Correo electrónico.
- Dominios de correo permitidos.
- Contraseña.
- Región y comuna.
- Dirección.
- Comentarios.

Cuando existe un error se muestra un mensaje indicando qué dato debe corregirse.

## Productos

La información de los productos se encuentra en:

```text
js/productos.js
```

Cada producto contiene información como:

- Código.
- Nombre.
- Categoría.
- Precio.
- Descripción.
- Imagen.

## Carrito de compras

La lógica del carrito se encuentra en:

```text
js/carrito.js
```

El carrito utiliza LocalStorage para conservar los productos mientras el usuario navega por el sitio.

También permite:

- Agregar productos.
- Eliminar productos.
- Cambiar cantidades.
- Vaciar el carrito.
- Calcular el total.

## Panel de administración

La sección administrativa se encuentra dentro de la carpeta:

```text
admin/
```

Desde esta sección se puede acceder a las vistas de:

- Productos.
- Nuevo producto.
- Editar producto.
- Usuarios.
- Nuevo usuario.
- Editar usuario.

Actualmente estas vistas corresponden a la parte visual del proyecto y no están conectadas a una base de datos.

## Diseño

Los estilos del sitio se encuentran en:

```text
css/estilos.css
```

Todas las páginas utilizan una hoja de estilos CSS externa para mantener un diseño consistente.

Los colores principales utilizados son:

- Verde Esmeralda: `#2E8B57`
- Amarillo Mostaza: `#FFD700`
- Marrón: `#8B4513`
- Fondo: `#F7F7F7`
- Texto principal: `#333333`

Las tipografías utilizadas son Montserrat y Playfair Display.

## Ejecución del proyecto

Para ejecutar el proyecto:

1. Abrir la carpeta del proyecto en Visual Studio Code.
2. Abrir `index.html`.
3. Ejecutar la extensión Live Server.
4. Presionar `Go Live`.

El proyecto se abrirá en el navegador.

## Git y GitHub

El proyecto utiliza Git y GitHub para el control de versiones y el trabajo colaborativo.

Se trabajó utilizando las siguientes ramas:

```text
main
sebastian
lucas
```

Cada integrante realiza sus cambios en su propia rama y posteriormente los cambios se integran a `main` mediante Pull Requests.

## Estado del proyecto

Actualmente HuertoHogar corresponde a una aplicación frontend desarrollada con HTML, CSS y JavaScript.

El proyecto servirá como base para continuar agregando nuevas funcionalidades en las siguientes evaluaciones.
