import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../Tienda";
import { storage } from "../almacenamiento";
import { money } from "../carrito";
const blank = {
  codigo: "",
  nombre: "",
  categoria: "frutas",
  precio: 0,
  stock: 0,
  descripcion: "",
  imagen: "img/manzanas.jpg",
  descuento: 0,
};
export default function Admin() {
  const { user, products, setProducts, items, setItems } = useStore(),
    [draft, setDraft] = useState(blank),
    [editing, setEditing] = useState(false),
    [error, setError] = useState(""),
    [tab, setTab] = useState("productos"),
    [users, setUsers] = useState(() => storage.read("users", []));
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin")
    return (
      <section className="container section">
        <h1>Acceso restringido</h1>
        <p>Esta sección requiere una cuenta administradora.</p>
      </section>
    );
  function save(e) {
    e.preventDefault();
    setError("");
    if (
      !/^[A-Z0-9]{3,12}$/.test(draft.codigo) ||
      !draft.nombre.trim() ||
      !draft.descripcion.trim() ||
      !Number.isFinite(Number(draft.precio)) ||
      Number(draft.precio) <= 0 ||
      !Number.isInteger(Number(draft.stock)) ||
      !Number.isInteger(Number(draft.descuento || 0)) || Number(draft.descuento || 0) < 0 || Number(draft.descuento || 0) > 90 ||
      Number(draft.stock) < 0
    ) {
      setError(
        "Revisa código (3 a 12 letras mayúsculas o números), nombre, descripción, precio positivo y stock entero.",
      );
      return;
    }
    if (!editing && products.some((p) => p.codigo === draft.codigo)) {
      setError("El código ya existe.");
      return;
    }
    const p = {
      ...draft,
      precio: Number(draft.precio),
      stock: Number(draft.stock),
      descuento: Number(draft.descuento || 0),
      categoriaNombre: {
        frutas: "Frutas Frescas",
        verduras: "Verduras Orgánicas",
        organicos: "Productos Orgánicos",
      }[draft.categoria],
    };
    setProducts(
      editing
        ? products.map((x) => (x.codigo === p.codigo ? p : x))
        : [...products, p],
    );
    setItems(
      items
        .filter((i) => i.codigo !== p.codigo || p.stock > 0)
        .map((i) =>
          i.codigo === p.codigo
            ? { ...p, cantidad: Math.min(i.cantidad, p.stock) }
            : i,
        ),
    );
    setDraft(blank);
    setEditing(false);
  }
  function remove(code) {
    setProducts(products.filter((p) => p.codigo !== code));
    setItems(items.filter((i) => i.codigo !== code));
  }
  function changeRole(email, role) {
    const next = users.map((u) => (u.correo === email ? { ...u, role } : u));
    if (storage.write("users", next)) setUsers(next);
    else setError("No se pudieron guardar los usuarios.");
  }
  return (
    <section className="container section">
      <p className="eyebrow">PANEL DE DEMOSTRACIÓN</p>
      <h1>Administración</h1>
      <p className="text-secondary">
        La información se guarda únicamente en este navegador.
      </p>
      <div className="d-flex gap-2 my-4">
        <button
          className="btn btn-outline-success"
          onClick={() => setTab("productos")}
        >
          Productos
        </button>
        <button className="btn btn-outline-success" onClick={() => setTab("pedidos")}>Pedidos</button>
        <button
          className="btn btn-outline-success"
          onClick={() => setTab("usuarios")}
        >
          Usuarios
        </button>
      </div>
      {error && (
        <p role="alert" className="alert alert-danger">
          {error}
        </p>
      )}
      {tab === "pedidos" ? <div className="table-responsive"><h2>Historial de pedidos simulados</h2><table className="table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th></tr></thead><tbody>{(storage.read("orders", []) || []).map(o => <tr key={o.id}><td>{o.id}</td><td>{o.cliente?.correo}</td><td>{new Date(o.fecha).toLocaleString('es-CL')}</td><td>{money(o.total)}</td><td>{o.estado}</td></tr>)}</tbody></table></div> : tab === "productos" ? (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.codigo}>
                      <td>
                        {p.codigo}
                        <br />
                        {p.nombre}
                      </td>
                      <td>{money(p.precio)}</td>
                      <td>{p.stock}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-success me-2"
                          onClick={() => {
                            setDraft(p);
                            setEditing(true);
                          }}
                        >
                          Editar {p.codigo}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(p.codigo)}
                        >
                          Eliminar {p.codigo}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-4">
            <form className="summary" onSubmit={save}>
              <h2 className="h4">
                {editing ? "Editar producto" : "Nuevo producto"}
              </h2>
              {[
                ["codigo", "Código"],
                ["nombre", "Nombre"],
                ["precio", "Precio"],
                ["stock", "Stock"],
                ["descuento", "Descuento % (0 a 90)"],
                ["descripcion", "Descripción"],
              ].map(([key, label]) => (
                <div className="mb-3" key={key}>
                  <label htmlFor={"admin-" + key}>{label}</label>
                  <input
                    id={"admin-" + key}
                    className="form-control"
                    type={["precio", "stock"].includes(key) ? "number" : "text"}
                    step={key === "stock" ? "1" : "any"}
                    disabled={editing && key === "codigo"}
                    value={draft[key]}
                    onChange={(e) =>
                      setDraft({ ...draft, [key]: e.target.value })
                    }
                  />
                </div>
              ))}
              <label htmlFor="admin-category">Categoría</label>
              <select
                id="admin-category"
                className="form-select mb-3"
                value={draft.categoria}
                onChange={(e) =>
                  setDraft({ ...draft, categoria: e.target.value })
                }
              >
                {["frutas", "verduras", "organicos"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <label htmlFor="admin-image">Imagen</label>
              <select
                id="admin-image"
                className="form-select mb-3"
                value={draft.imagen}
                onChange={(e) => setDraft({ ...draft, imagen: e.target.value })}
              >
                {[
                  "manzanas",
                  "naranjas",
                  "platanos",
                  "zanahorias",
                  "espinacas",
                  "pimientos",
                  "miel",
                ].map((i) => (
                  <option key={i} value={"img/" + i + ".jpg"}>
                    {i}
                  </option>
                ))}
              </select>
              <button className="btn btn-success">Guardar producto</button>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  setDraft(blank);
                  setEditing(false);
                }}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          <h2 className="h4">Usuarios registrados</h2>
          <p>
            Crea cuentas desde Registro. Aquí puedes cambiar su rol o
            eliminarlas.
          </p>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(users) ? users : []).map((u) => (
                  <tr key={u.correo}>
                    <td>{u.nombre}</td>
                    <td>{u.correo}</td>
                    <td>
                      <select
                        aria-label={"Rol de " + u.nombre}
                        className="form-select"
                        value={u.role}
                        onChange={(e) => changeRole(u.correo, e.target.value)}
                      >
                        <option value="cliente">Cliente</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => {
                          const next = users.filter(
                            (x) => x.correo !== u.correo,
                          );
                          if (storage.write("users", next)) setUsers(next);
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
