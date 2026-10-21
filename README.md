# HuertoHogar — Evaluación Parcial N.º 2

**Asignatura:** Desarrollo Fullstack II  
**Sigla:** DSY1104

## Integrantes

- Sebastian Monsalve
- Lucas Parra

## Descripción del proyecto

HuertoHogar es una tienda online de frutas, verduras y productos orgánicos, orientada a acercar productos frescos y naturales a los hogares chilenos y promover el consumo local.

En esta evaluación se actualizó el proyecto original de HTML, CSS y JavaScript a una aplicación frontend desarrollada con React. Se conservaron los siete productos, las imágenes y el video de la tienda y se incorporaron componentes reutilizables, navegación, formularios controlados, diseño responsivo y pruebas automatizadas con Jasmine y Karma.

## Tecnologías utilizadas

| Tecnología | Aplicación en el proyecto |
| --- | --- |
| React y JSX | Construcción de la interfaz mediante componentes funcionales |
| React Router | Navegación entre páginas sin recargar toda la aplicación |
| Bootstrap y CSS3 | Diseño responsivo, grillas, formularios, botones y tablas |
| JavaScript | Reglas de negocio, validaciones y lógica de interacción |
| Vite | Entorno de desarrollo y compilación de producción |
| localStorage | Persistencia local del carrito, catálogo, cuentas, sesión y mensajes |
| Jasmine | Casos de prueba, aserciones, mocks y espías |
| Karma y Chrome Headless | Ejecución de las pruebas en un navegador real |
| React Testing Library | Renderizado de componentes e interacción con el DOM durante las pruebas |
| Webpack y Babel | Procesamiento de JavaScript y JSX en el entorno de pruebas |
| Istanbul y karma-coverage | Instrumentación y generación de reportes de cobertura |

## Implementación del frontend con React

La aplicación se organizó en componentes, páginas y archivos de lógica compartida. Esta separación permite reutilizar elementos de interfaz y mantener las reglas de negocio independientes de su presentación.

`Aplicacion.jsx` contiene el mapa de rutas y el proveedor de estado compartido. La navegación utiliza `HashRouter`, lo que permite trabajar con alojamiento estático. `Layout` reúne el encabezado, el menú, el contador del carrito, los avisos y el pie de página.

### Componentes, propiedades y estados

| Componente | Propiedades y estados utilizados | Función |
| --- | --- | --- |
| ProductCard | Props `product` y `onAdd` | Presenta un producto y comunica la acción de agregarlo al carrito |
| AccountForm | Prop `mode`; estados de valores, errores y confirmación | Adapta los campos y las validaciones para registro, inicio de sesión y contacto |
| Catalog | Estados de categoría y búsqueda | Actualiza los productos visibles según los filtros seleccionados |
| Detail | Parámetro de ruta y estado de cantidad | Muestra el producto seleccionado y permite elegir la cantidad |
| Layout | Estado de apertura del menú; datos compartidos de sesión y carrito | Controla la navegación móvil y muestra información actualizada |
| StoreProvider | Estados de productos, carrito, usuario y avisos | Comparte información y acciones entre las distintas páginas |
| Admin | Estados del formulario, edición, errores, sección y usuarios | Gestiona los productos y usuarios de demostración |

Se utilizó `useState` para gestionar los datos que cambian durante la interacción. Los formularios se implementaron como componentes controlados mediante `value` y `onChange`. Context permite compartir el carrito, el catálogo y la sesión sin pasar esas propiedades por todos los niveles de la interfaz.

La persistencia del carrito, catálogo y sesión se sincronizó mediante `useEffect`. Las operaciones emplean nuevos arreglos y objetos con `map`, `filter` y el operador spread, evitando modificar directamente el estado.

## Diseño responsivo con Bootstrap

El diseño se implementó con la grilla y las utilidades de Bootstrap, complementadas con una hoja de estilos propia para mantener la identidad visual de HuertoHogar.

- Las tarjetas del catálogo utilizan `col-12`, `col-sm-6` y `col-lg-4`: una columna en celulares pequeños, dos desde el punto de quiebre pequeño y tres desde el punto de quiebre grande.
- El encabezado utiliza `navbar-expand-lg` y un menú controlado con estado React para adaptar la navegación a pantallas pequeñas.
- Los formularios utilizan `form-control`, `form-select` y estilos de validación para presentar campos y errores de manera consistente.
- Las tablas de administración se incluyen en contenedores `table-responsive` para permitir su consulta en espacios reducidos.

Se revisaron ocho pantallas en anchos de 390, 768 y 1440 píxeles. Se corrigieron los márgenes de las grillas que generaban desbordes horizontales en celular. La comprobación final no registró desbordes en las rutas revisadas.

## Funcionalidades implementadas

- Inicio con productos destacados y video.
- Catálogo con filtros por categoría y búsqueda por nombre.
- Detalle de productos con imagen, descripción, precio y stock.
- Carrito con incorporación de productos, actualización de cantidades, eliminación y vaciado.
- Validación de cantidades enteras positivas y control del stock disponible.
- Cálculo del total en pesos chilenos y confirmación de pedidos de demostración.
- Registro con validación de nombre, RUN, correo, contraseña, región, comuna y dirección.
- Inicio y cierre de sesión, rechazo de credenciales incorrectas y control de correos duplicados.
- Contacto con validación y almacenamiento local de mensajes.
- Secciones Nosotros y Blog, con dos publicaciones.
- Administración local para crear, editar y eliminar productos, consultar usuarios registrados, modificar sus roles y eliminarlos.

## Pruebas con Jasmine y Karma

Se implementaron **46 pruebas automatizadas**, organizadas en 13 grupos. La suite finalizó con **46 pruebas aprobadas y 0 fallidas** en Chrome Headless.

Las pruebas abarcan unidades de lógica y componentes aislados, además de comprobaciones de integración entre páginas, rutas y estado compartido. Se verificaron tanto los resultados de las funciones como el comportamiento de la interfaz y la manipulación del DOM.

| Área evaluada | Casos | Aspectos comprobados |
| --- | --- | --- |
| Lógica del carrito | 5 | Acumulación, inmutabilidad, cantidades inválidas, stock y total |
| ProductCard | 3 | Datos recibidos por props, callback y producto agotado |
| Catálogo | 3 | Filtros, búsqueda, ausencia de resultados y acción de agregar |
| Detalle | 2 | Producto según la ruta, cantidad y producto inexistente |
| Interfaz del carrito | 4 | Estado vacío, subtotal, eliminación, vaciado y confirmación simulada |
| Validaciones | 3 | Dominios de correo, RUN, campos obligatorios y límites |
| Registro | 4 | Datos inválidos, registro válido, duplicados y error de almacenamiento |
| Inicio de sesión | 3 | Credenciales incorrectas, cliente y administrador |
| Contacto | 3 | Validación, guardado local y fallo de persistencia |
| Estado compartido y navegación | 5 | Menú, contador, cierre de sesión, avisos y recuperación de datos |
| Administración | 6 | Acceso, gestión de productos, códigos duplicados, stock y usuarios |
| Contenido informativo | 4 | Inicio, video, Nosotros, blog y rutas inexistentes |
| Aplicación integrada | 1 | Proveedor y navegación entre formularios |
| **Total** | **46** | **Pruebas aprobadas** |

### Configuración y proceso de testeo

El entorno se configuró en `karma.conf.cjs`. Karma carga los archivos de prueba, Webpack y Babel procesan JSX y Jasmine organiza los casos mediante `describe`, `it` y `expect`. La ejecución se realiza en Chrome Headless y la cobertura se obtiene mediante Istanbul y karma-coverage.

Los casos siguen la estructura de preparación, acción y verificación: se definen datos de entrada, se renderiza el componente cuando corresponde, se ejecuta la interacción y se comprueba el resultado esperado. React Testing Library permite simular clics, cambios en campos y envío de formularios, verificando sus efectos en el DOM.

Se implementó limpieza del DOM y de localStorage después de cada caso para evitar que los datos de una prueba afecten a las siguientes. Se analizaron los fallos y se corrigieron las comprobaciones antes de completar la ejecución final. También se verificó la compilación de producción.

### Uso de mocks y espías

- `jasmine.createSpy` permitió comprobar que el botón de ProductCard invoca `onAdd` con el producto correcto y que el botón de un producto agotado no ejecuta el callback.
- `spyOn(storage, 'read').and.callFake` permitió proporcionar una cuenta conocida para probar el inicio de sesión sin depender de datos previos del navegador.
- `spyOn(storage, 'write').and.returnValue(false)` simuló errores de persistencia y permitió comprobar los mensajes de error de Registro y Contacto.
- Un espía sobre `Storage.prototype.setItem` simuló un error de almacenamiento para verificar su manejo en el adaptador.

### Resultados de cobertura

| Métrica | Elementos cubiertos / total | Cobertura |
| --- | --- | --- |
| Sentencias | 248 / 253 | 98,02 % |
| Ramas | 225 / 235 | 95,74 % |
| Funciones | 94 / 98 | 95,91 % |
| Líneas ejecutables | 227 / 231 | 98,26 % |

Se configuraron umbrales mínimos de 90 % para sentencias y líneas, y de 85 % para ramas y funciones. La ejecución final superó esos umbrales.

La medición incluye los módulos de aplicación importados por las pruebas. Se excluyen el archivo de arranque `src/principal.jsx`, los datos estáticos, CSS, recursos multimedia, dependencias y configuración. Los reportes generados incluyen HTML, JSON y LCOV. Las rutas auxiliares no recorridas, principalmente del panel administrativo, se detallan en el informe de cobertura; estos porcentajes no representan una verificación completa de todos los escenarios posibles.

## Documentación del proyecto

- **ERS:** `docs/ERS_HuertoHogar.pdf`. Describe la propuesta, el alcance, los actores, los requisitos funcionales y no funcionales, las reglas de negocio y los criterios de aceptación.
- **Documento de cobertura de testing:** `docs/Cobertura_testing.pdf`. Presenta el alcance, la matriz de casos, la configuración, los mocks, los resultados, las exclusiones y el análisis de cobertura.
Los reportes de cobertura HTML, JSON y LCOV se generan al ejecutar la suite y no se incluyen como carpetas duplicadas en el proyecto entregado.

## Alcance

HuertoHogar es un prototipo académico frontend. La información se conserva en el navegador mediante localStorage y el panel administrativo utiliza roles locales de demostración. La confirmación de pedidos es una simulación; no se procesan pagos, despachos ni correos reales y no se incluye un backend.

## Estructura del proyecto

- `src/components/`: componentes reutilizables.
- `src/pages/`: páginas de la tienda.
- `src/`: aplicación, estado compartido, validaciones, carrito, almacenamiento y productos.
- `public/`: imágenes y video originales.
- `tests/`: pruebas automatizadas.
- `docs/`: ERS e informe de cobertura en PDF.

La entrega contiene el código fuente y la configuración necesaria de desarrollo y pruebas. Las dependencias instaladas, la compilación y los reportes regenerables no forman parte del ZIP.


## Mejoras adicionales de la EP2

La aplicación React ahora incorpora una vista de ofertas, checkout de demostración, resultados de compra exitosa y fallida, descuentos configurables desde administración, listado de pedidos y validación de correo y RUN duplicado. 

**Importante:** los pagos, envíos y usuarios son simulados y locales al navegador.
