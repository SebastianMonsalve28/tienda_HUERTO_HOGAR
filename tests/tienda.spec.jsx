import "./preparacion";
import App from "../src/Aplicacion";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { StoreProvider, useStore } from "../src/Tienda";
import { initialProducts } from "../src/productos";
import { storage } from "../src/almacenamiento";
import {
  addItem,
  changeQuantity,
  totalCart,
  money,
} from "../src/carrito";
import { validate, validRun, validEmail } from "../src/validaciones";
import ProductCard from "../src/components/TarjetaProducto";
import Layout from "../src/components/Estructura";
import AccountForm from "../src/components/FormularioCuenta";
import Catalog from "../src/pages/Catalogo";
import Cart from "../src/pages/Carrito";
import Detail from "../src/pages/Detalle";
import Admin from "../src/pages/Administracion";
import Home from "../src/pages/Inicio";
import { About, Blog, NotFound } from "../src/pages/Contenido";
const product = initialProducts[0];
function mount(ui, path = "/") {
  return render(
    <StoreProvider>
      <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>
    </StoreProvider>,
  );
}
function input(id, value) {
  fireEvent.change(document.getElementById(id), { target: { value } });
}
function submit() {
  fireEvent.submit(document.querySelector("form"));
}
const registered = {
  nombre: "Lucas Parra",
  correo: "lucas@gmail.com",
  password: "Lucas123",
  run: "123456785",
  region: "Región Metropolitana",
  comuna: "Maipú",
  direccion: "Calle Uno 123",
  role: "cliente",
};
function fillRegister() {
  for (const key of [
    "nombre",
    "run",
    "correo",
    "password",
    "region",
    "comuna",
    "direccion",
  ])
    input(key, registered[key]);
}
function Probe() {
  const { add, items, update, setItems, notice, setNotice, setUser, user } =
    useStore();
  return (
    <>
      <button onClick={() => add(product)}>add</button>
      <button onClick={() => add(product, 999)}>over</button>
      <button onClick={() => update(product.codigo, 2)}>update</button>
      <button onClick={() => update(product.codigo, 999)}>invalid</button>
      <button onClick={() => setItems([])}>clear</button>
      <button onClick={() => setUser(registered)}>login</button>
      <button onClick={() => setNotice("")}>dismiss</button>
      <output>{JSON.stringify({ items, notice, user })}</output>
    </>
  );
}
describe("01 · Lógica de carrito", () => {
  it("agrega sin mutar y acumula cantidades", () => {
    const old = [];
    const one = addItem(old, product);
    expect(old.length).toBe(0);
    expect(addItem(one, product, 2)[0].cantidad).toBe(3);
  });
  it("rechaza cantidades inválidas, decimales y exceso de stock", () => {
    for (const n of [0, -1, 1.5, 151, NaN])
      expect(() => addItem([], product, n)).toThrowError();
    expect(() => addItem([], null)).toThrowError();
  });
  it("actualiza cantidades preservando otros productos", () => {
    const cart = addItem(addItem([], product), initialProducts[1]);
    expect(changeQuantity(cart, product.codigo, 5)[0].cantidad).toBe(5);
    expect(changeQuantity(cart, product.codigo, 5)[1].cantidad).toBe(1);
    expect(cart[0].cantidad).toBe(1);
  });
  it("rechaza cambios inválidos y producto inexistente", () => {
    expect(() => changeQuantity([], product.codigo, 1)).toThrowError();
    for (const n of [0, -1, 151, 1.1])
      expect(() =>
        changeQuantity(addItem([], product), product.codigo, n),
      ).toThrowError();
  });
  it("calcula total vacío y subtotal en pesos chilenos", () => {
    expect(totalCart([])).toBe(0);
    expect(totalCart(addItem([], product, 2))).toBe(2400);
    expect(money(1200)).toContain("1.200");
  });
});
describe("02 · Tarjeta de producto: props y DOM", () => {
  it("renderiza los datos recibidos por propiedades", () => {
    mount(<ProductCard product={product} onAdd={() => {}} />);
    expect(screen.getByRole("img").alt).toBe("Manzanas Fuji");
    expect(screen.getByRole("heading").textContent).toContain("Manzanas");
    expect(screen.getByText("Stock: 150 unidades")).toBeTruthy();
  });
  it("comunica el clic mediante un callback mock", () => {
    const onAdd = jasmine.createSpy("onAdd");
    mount(<ProductCard product={product} onAdd={onAdd} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onAdd).toHaveBeenCalledOnceWith(product);
  });
  it("deshabilita la compra cuando no hay stock", () => {
    const onAdd = jasmine.createSpy();
    mount(<ProductCard product={{ ...product, stock: 0 }} onAdd={onAdd} />);
    fireEvent.click(screen.getByText("Agotado"));
    expect(onAdd).not.toHaveBeenCalled();
  });
});
describe("03 · Catálogo y filtros", () => {
  it("muestra siete productos y filtra frutas con estado React", () => {
    mount(<Catalog />);
    expect(screen.getAllByRole("article").length).toBe(7);
    fireEvent.click(
      screen.getByRole("button", { name: "Frutas", exact: true }),
    );
    expect(screen.getAllByRole("article").length).toBe(3);
    expect(
      screen
        .getByRole("button", { name: "Frutas", exact: true })
        .getAttribute("aria-pressed"),
    ).toBe("true");
  });
  it("busca por nombre y muestra estado sin resultados", () => {
    mount(<Catalog />);
    input("search", "miel");
    expect(screen.getAllByRole("article").length).toBe(1);
    input("search", "inexistente");
    expect(screen.queryAllByRole("article").length).toBe(0);
    expect(screen.getByText(/No encontramos productos/)).toBeTruthy();
  });
  it("agrega desde el catálogo y persiste", () => {
    mount(<Catalog />);
    fireEvent.click(
      screen.getAllByRole("button", { name: "Agregar", exact: true })[0],
    );
    expect(storage.read("cart", [])[0].cantidad).toBe(1);
  });
});
describe("04 · Detalle y rutas", () => {
  it("muestra el producto según parámetro y agrega cantidad", () => {
    mount(
      <Routes>
        <Route path="/productos/:code" element={<Detail />} />
      </Routes>,
      "/productos/FR001",
    );
    input("quantity", "3");
    fireEvent.click(screen.getByText("Agregar al carrito"));
    expect(storage.read("cart", [])[0].cantidad).toBe(3);
  });
  it("resuelve producto inexistente", () => {
    mount(
      <Routes>
        <Route path="/productos/:code" element={<Detail />} />
      </Routes>,
      "/productos/XX",
    );
    expect(screen.getByText("Producto no encontrado")).toBeTruthy();
  });
});
describe("05 · Carrito: interacción DOM", () => {
  it("presenta estado vacío", () => {
    mount(<Cart />);
    expect(screen.getByText("Tu carrito está vacío")).toBeTruthy();
  });
  it("actualiza subtotal y elimina un producto", () => {
    storage.write("cart", addItem([], product));
    mount(<Cart />);
    input("qty-FR001", "3");
    expect(screen.getByTestId("total").textContent).toContain("3.600");
    fireEvent.click(screen.getByText("Eliminar Manzanas Fuji"));
    expect(screen.getByText("Tu carrito está vacío")).toBeTruthy();
  });
  it("vacía todo el carrito", () => {
    storage.write("cart", addItem([], product));
    mount(<Cart />);
    fireEvent.click(screen.getByText("Vaciar carrito"));
    expect(storage.read("cart", [])).toEqual([]);
  });
  it("confirma solo un pedido simulado", () => {
    storage.write("cart", addItem([], product));
    mount(<Cart />);
    fireEvent.click(screen.getByText("Confirmar pedido de prueba"));
    expect(screen.getByRole("status").textContent).toContain(
      "No se realizó ningún cobro",
    );
    expect(storage.read("cart", [])).toEqual([]);
  });
});
describe("06 · Validación de formularios", () => {
  it("acepta dominios permitidos y rechaza otros formatos", () => {
    for (const mail of ["a@gmail.com", "a@duoc.cl", " A@PROFESOR.DUOC.CL "])
      expect(validEmail(mail)).toBeTrue();
    for (const mail of ["a@otro.cl", "@gmail.com", "a@gmail.com.evil", ""])
      expect(validEmail(mail)).toBeFalse();
  });
  it("valida RUN con módulo once", () => {
    expect(validRun("12.345.678-5")).toBeTrue();
    expect(validRun("123456784")).toBeFalse();
    expect(validRun("abc")).toBeFalse();
    expect(validRun("1000005K")).toBeTrue();
    expect(validRun("10000104")).toBeFalse();
  });
  it("valida campos obligatorios, comuna y largos", () => {
    expect(Object.keys(validate({}, "register")).length).toBe(6);
    expect(validate(registered, "register")).toEqual({});
    expect(
      validate({ ...registered, comuna: "Otra" }, "register").comuna,
    ).toBeTruthy();
    expect(
      validate({ ...registered, password: "12345678901" }, "login").password,
    ).toBeTruthy();
    expect(
      validate({ ...registered, comentario: "x".repeat(501) }, "contact")
        .comentario,
    ).toBeTruthy();
  });
});
describe("07 · Registro", () => {
  it("muestra errores sin guardar datos inválidos", () => {
    mount(<AccountForm mode="register" />);
    submit();
    expect(screen.getAllByRole("alert").length).toBeGreaterThan(3);
    expect(storage.read("users", [])).toEqual([]);
  });
  it("guarda cuenta válida e inicia sesión sin conservar contraseña en sesión", () => {
    mount(<AccountForm mode="register" />);
    fillRegister();
    submit();
    expect(storage.read("users", [])[0].correo).toBe("lucas@gmail.com");
    expect(storage.read("session", null).nombre).toBe("Lucas Parra");
    expect(storage.read("session", null).password).toBeUndefined();
  });
  it("rechaza cuentas duplicadas", () => {
    storage.write("users", [registered]);
    mount(<AccountForm mode="register" />);
    fillRegister();
    submit();
    expect(
      screen.getByText("Ya existe una cuenta con ese correo."),
    ).toBeTruthy();
    expect(storage.read("users", []).length).toBe(1);
  });
  it("informa fallo de persistencia con mock", () => {
    spyOn(storage, "write").and.returnValue(false);
    mount(<AccountForm mode="register" />);
    fillRegister();
    submit();
    expect(screen.getByText("No se pudo guardar la cuenta.")).toBeTruthy();
  });
});
describe("08 · Inicio de sesión y mocks", () => {
  it("rechaza credenciales incorrectas", () => {
    mount(<AccountForm mode="login" />);
    input("correo", "lucas@gmail.com");
    input("password", "error");
    submit();
    expect(screen.getByRole("alert").textContent).toContain("incorrectos");
  });
  it("inicia sesión de cliente usando repositorio simulado", () => {
    spyOn(storage, "read").and.callFake((key, fallback) =>
      key === "users" ? [registered] : fallback,
    );
    mount(<AccountForm mode="login" />);
    input("correo", "LUCAS@gmail.com");
    input("password", "Lucas123");
    submit();
    expect(storage.read).toHaveBeenCalledWith("users", []);
    expect(localStorage.getItem("hh:session")).toContain("Lucas Parra");
  });
  it("acepta administrador de demostración", () => {
    mount(<AccountForm mode="login" />);
    input("correo", "admin@duoc.cl");
    input("password", "Admin123");
    submit();
    expect(storage.read("session", {}).role).toBe("admin");
  });
});
describe("09 · Contacto", () => {
  it("valida campos y no registra mensajes vacíos", () => {
    mount(<AccountForm mode="contact" />);
    submit();
    expect(screen.getAllByRole("alert").length).toBe(3);
    expect(storage.read("messages", [])).toEqual([]);
  });
  it("guarda mensaje local y limpia el comentario", () => {
    mount(<AccountForm mode="contact" />);
    input("nombre", "Lucas Parra");
    input("correo", "lucas@gmail.com");
    input("comentario", "Consulta de prueba");
    submit();
    expect(storage.read("messages", [])[0].comentario).toBe(
      "Consulta de prueba",
    );
    expect(document.getElementById("comentario").value).toBe("");
    expect(screen.getByRole("status").textContent).toContain(
      "No se envió un correo",
    );
  });
  it("reporta fallo de almacenamiento", () => {
    spyOn(storage, "write").and.returnValue(false);
    mount(<AccountForm mode="contact" />);
    input("nombre", "Lucas");
    input("correo", "lucas@gmail.com");
    input("comentario", "Hola");
    submit();
    expect(screen.getByRole("alert").textContent).toContain(
      "No se pudo guardar",
    );
  });
});
describe("10 · Navegación, estado global y persistencia", () => {
  it("abre/cierra menú accesible y muestra contador", () => {
    storage.write("cart", addItem([], product, 2));
    mount(<Layout />);
    expect(screen.getByText("Carrito (2)")).toBeTruthy();
    const button = screen.getByRole("button", { name: "Abrir menú" });
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(screen.getByText("Productos"));
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });
  it("cierra sesión y aviso desde la interfaz", () => {
    storage.write("session", {
      nombre: "Admin",
      correo: "admin@duoc.cl",
      role: "admin",
    });
    mount(
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Catalog />} />
        </Route>
      </Routes>,
    );
    expect(screen.getByText("Administrar")).toBeTruthy();
    fireEvent.click(
      screen.getAllByRole("button", { name: "Agregar", exact: true })[0],
    );
    expect(screen.getByText("Manzanas Fuji agregado al carrito.")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Cerrar aviso"));
    fireEvent.click(screen.getByText("Salir"));
    expect(storage.read("session", 1)).toBeNull();
  });
  it("ejerce estado, errores de stock y persistencia sin mutaciones", () => {
    mount(<Probe />);
    for (const label of [
      "add",
      "add",
      "update",
      "invalid",
      "over",
      "dismiss",
      "login",
    ])
      fireEvent.click(screen.getByText(label, { selector: "button" }));
    expect(storage.read("cart", [])[0].cantidad).toBe(2);
    expect(storage.read("session", {}).nombre).toBe("Lucas Parra");
    fireEvent.click(screen.getByText("clear"));
    expect(storage.read("cart", [])).toEqual([]);
  });
  it("recupera datos corruptos y bloquea almacenamiento sin lanzar errores", () => {
    localStorage.setItem("hh:cart", "invalid");
    expect(storage.read("cart", [])).toEqual([]);
    spyOn(Storage.prototype, "setItem").and.throwError("Quota");
    expect(storage.write("test", {})).toBeFalse();
  });
  it("descarta un carrito con estructura inválida", () => {
    storage.write("cart", [{ codigo: "x", cantidad: -1 }]);
    storage.write("products", {});
    mount(<Probe />);
    expect(storage.read("cart", [])).toEqual([]);
    expect(storage.read("products", []).length).toBe(7);
  });
});
describe("11 · Administración y protección de rutas", () => {
  function admin() {
    storage.write("session", {
      nombre: "Admin",
      correo: "admin@duoc.cl",
      role: "admin",
    });
    mount(<Admin />);
  }
  it("redirige al login sin sesión", () => {
    mount(
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<p>Login requerido</p>} />
      </Routes>,
      "/admin",
    );
    expect(screen.getByText("Login requerido")).toBeTruthy();
  });
  it("restringe el acceso de clientes", () => {
    storage.write("session", registered);
    mount(<Admin />);
    expect(screen.getByText("Acceso restringido")).toBeTruthy();
  });
  it("valida, crea, edita y elimina productos", () => {
    admin();
    submit();
    expect(screen.getByRole("alert").textContent).toContain("Revisa código");
    for (const [key, value] of Object.entries({
      codigo: "FR099",
      nombre: "Pera",
      precio: "1300",
      stock: "15",
      descripcion: "Pera local",
    }))
      input("admin-" + key, value);
    submit();
    expect(storage.read("products", []).length).toBe(8);
    fireEvent.click(screen.getByText("Editar FR099"));
    input("admin-precio", "1400");
    submit();
    expect(
      storage.read("products", []).find((p) => p.codigo === "FR099").precio,
    ).toBe(1400);
    fireEvent.click(screen.getByText("Eliminar FR099"));
    expect(storage.read("products", []).length).toBe(7);
  });
  it("rechaza códigos duplicados y permite cancelar edición", () => {
    admin();
    for (const [key, value] of Object.entries({
      codigo: "FR001",
      nombre: "Pera",
      precio: "1300",
      stock: "15",
      descripcion: "Pera local",
    }))
      input("admin-" + key, value);
    submit();
    expect(screen.getByText("El código ya existe.")).toBeTruthy();
    fireEvent.click(screen.getByText("Editar FR001"));
    fireEvent.click(screen.getByText("Cancelar"));
    expect(document.getElementById("admin-codigo").disabled).toBeFalse();
  });
  it("actualiza o quita del carrito al modificar stock", () => {
    storage.write("cart", addItem([], product, 3));
    admin();
    fireEvent.click(screen.getByText("Editar FR001"));
    input("admin-stock", "1");
    submit();
    expect(storage.read("cart", [])[0].cantidad).toBe(1);
    fireEvent.click(screen.getByText("Editar FR001"));
    input("admin-stock", "0");
    submit();
    expect(storage.read("cart", [])).toEqual([]);
  });
  it("cambia rol y elimina usuario local", () => {
    storage.write("users", [registered]);
    admin();
    fireEvent.click(screen.getByText("Usuarios", { selector: "button" }));
    fireEvent.change(screen.getByLabelText("Rol de Lucas Parra"), {
      target: { value: "admin" },
    });
    expect(storage.read("users", [])[0].role).toBe("admin");
    fireEvent.click(screen.getByText("Eliminar", { selector: "button" }));
    expect(storage.read("users", [])).toEqual([]);
  });
});
describe("12 · Páginas informativas", () => {
  it("renderiza inicio con destacados y video", () => {
    mount(<Home />);
    expect(screen.getAllByRole("article").length).toBe(3);
    expect(document.querySelector("video source").getAttribute("src")).toBe(
      "video/video.mp4",
    );
  });
  it("renderiza misión y equipo", () => {
    mount(<About />);
    expect(screen.getByText("Nuestra misión")).toBeTruthy();
  });
  it("navega entre blog y detalle", () => {
    mount(
      <Routes>
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<Blog />} />
      </Routes>,
      "/blog",
    );
    fireEvent.click(screen.getAllByText("Leer artículo →")[0]);
    expect(screen.getByText(/Incorpora frutas y verduras/)).toBeTruthy();
    fireEvent.click(screen.getByText("← Volver al blog"));
    expect(screen.getAllByText("Leer artículo →").length).toBe(2);
  });
  it("maneja artículo y ruta inexistentes", () => {
    mount(
      <Routes>
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="*" element={<NotFound />} />
      </Routes>,
      "/blog/no",
    );
    expect(screen.getByText("Página no encontrada")).toBeTruthy();
  });
});

describe("13 · Aplicación completa", () => {
  it("integra proveedor, rutas y formularios sin recargar", () => {
    window.history.replaceState(null, "", window.location.pathname + "#/");
    render(<App />);
    fireEvent.click(screen.getByText("Ingresar"));
    expect(
      screen.getByRole("heading", { name: "Bienvenido de nuevo" }),
    ).toBeTruthy();
    fireEvent.click(screen.getByText("Regístrate"));
    expect(
      screen.getByRole("heading", { name: "Crea tu cuenta" }),
    ).toBeTruthy();
    fireEvent.click(screen.getByText("Contacto", { selector: "a" }));
    expect(screen.getByRole("heading", { name: "Conversemos" })).toBeTruthy();
  });
});
