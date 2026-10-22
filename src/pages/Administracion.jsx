import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../Tienda";
import { storage } from "../almacenamiento";
import { money } from "../carrito";

const emptyProduct = {
  codigo: "", nombre: "", categoria: "frutas", precio: "", stock: "",
  descuento: "0", descripcion: "", imagen: "",
};
const defaultImage = "img/manzanas.jpg";
const categoryNames = {
  frutas: "Frutas Frescas",
  verduras: "Verduras Orgánicas",
  organicos: "Productos Orgánicos",
};

export default function Admin() {
  const { user, products, setProducts, items, setItems } = useStore();
  const [draft, setDraft] = useState({ ...emptyProduct });
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState("productos");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [users, setUsers] = useState(() => storage.read("users", []));

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") {
    return (
      <section className="container section">
        <h1>Acceso restringido</h1>
        <p>Esta sección requiere una cuenta administradora.</p>
      </section>
    );
  }

  function resetForm() {
    setDraft({ ...emptyProduct });
    setEditing(false);
    setError("");
  }

  function selectImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("La imagen debe ser JPG, PNG o WebP.");
      event.target.value = "";
      return;
    }
    if (file.size > 350 * 1024) {
      setError("La imagen debe pesar 350 KB o menos.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDraft(previous => ({ ...previous, imagen: String(reader.result) }));
      setError("");
    };
    reader.onerror = () => setError("No se pudo leer la imagen.");
    reader.readAsDataURL(file);
  }

  function save(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const p = {
      ...draft,
      codigo: String(draft.codigo).trim().toUpperCase(),
      nombre: String(draft.nombre).trim(),
      descripcion: String(draft.descripcion).trim(),
      precio: Number(draft.precio),
      stock: Number(draft.stock),
      descuento: Number(draft.descuento || 0),
      categoriaNombre: categoryNames[draft.categoria],
      imagen: draft.imagen || defaultImage,
    };
    if (
      !/^[A-Z0-9]{3,12}$/.test(p.codigo) || !p.nombre || !p.descripcion ||
      draft.precio === "" || !Number.isFinite(p.precio) || p.precio <= 0 ||
      draft.stock === "" || !Number.isInteger(p.stock) || p.stock < 0 ||
      !Number.isInteger(p.descuento) || p.descuento < 0 || p.descuento > 90 ||
      !categoryNames[p.categoria]
    ) {
      setError("Completa código, nombre, descripción, precio mayor que 0, stock entero y descuento entre 0 y 90.");
      return;
    }
    if (!editing && products.some(x => x.codigo === p.codigo)) {
      setError("Ya existe un producto con ese código.");
      return;
    }
    const nextProducts = editing
      ? products.map(x => x.codigo === p.codigo ? p : x)
      : [...products, p];
    if (!storage.write("products", nextProducts)) {
      setError("No se pudo guardar. Prueba con una imagen más pequeña o libera espacio del navegador.");
      return;
    }
    setProducts(nextProducts);
    setItems(current => current
      .filter(i => i.codigo !== p.codigo || p.stock > 0)
      .map(i => i.codigo === p.codigo
        ? { ...p, cantidad: Math.min(i.cantidad, p.stock) }
        : i));
    setDraft({ ...emptyProduct });
    setEditing(false);
    setSuccess(editing ? "Producto actualizado correctamente." : "Producto agregado correctamente.");
  }

  function remove(code) {
    if (!window.confirm("¿Eliminar este producto?")) return;
    const nextProducts = products.filter(p => p.codigo !== code);
    if (!storage.write("products", nextProducts)) {
      setError("No se pudo eliminar el producto.");
      return;
    }
    setProducts(nextProducts);
    setItems(current => current.filter(i => i.codigo !== code));
    setSuccess("Producto eliminado.");
    setError("");
    if (editing && draft.codigo === code) resetForm();
  }

  function changeRole(email, role) {
    const next = users.map(u => u.correo === email ? { ...u, role } : u);
    if (storage.write("users", next)) {
      setUsers(next);
      setError("");
      setSuccess("Rol actualizado.");
    } else setError("No se pudieron guardar los usuarios.");
  }

  function removeUser(email) {
    if (!window.confirm("¿Eliminar esta cuenta?")) return;
    const next = users.filter(u => u.correo !== email);
    if (storage.write("users", next)) {
      setUsers(next);
      setSuccess("Usuario eliminado.");
      setError("");
    } else setError("No se pudo eliminar el usuario.");
  }

  return (
    <section className="container section">
      <p className="eyebrow">PANEL DE DEMOSTRACIÓN</p>
      <h1>Administración</h1>
      <p className="text-secondary">Los cambios se guardan solo en este navegador.</p>

      <div className="d-flex flex-wrap gap-2 my-4">
        {["productos", "pedidos", "usuarios"].map(name => (
          <button key={name} type="button"
            className={"btn " + (tab === name ? "btn-success" : "btn-outline-success")}
            onClick={() => { setTab(name); setError(""); setSuccess(""); }}>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="alert alert-danger">{error}</p>}
      {success && <p role="status" className="alert alert-success">{success}</p>}

      {tab === "productos" && (
        <div className="row g-4">
          <div className="col-lg-7">
            <h2 className="h4">Productos registrados</h2>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead><tr><th>Producto</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.codigo}>
                      <td>{p.codigo}<br />{p.nombre}</td>
                      <td>{money(p.precio)}</td>
                      <td>{p.stock}</td>
                      <td>
                        <button type="button" className="btn btn-sm btn-outline-success me-2 mb-1"
                          onClick={() => { setDraft({ ...p }); setEditing(true); setError(""); setSuccess(""); }}>
                          Editar {p.codigo}
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-danger mb-1"
                          onClick={() => remove(p.codigo)}>
                          Eliminar {p.codigo}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-5">
            <form className="summary" onSubmit={save}>
              <h2 className="h4 mb-3">{editing ? "Editar producto" : "Agregar nuevo producto"}</h2>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label htmlFor="admin-codigo" className="form-label">Código *</label>
                  <input id="admin-codigo" className="form-control" value={draft.codigo}
                    disabled={editing} maxLength={12} required
                    onChange={e => setDraft({ ...draft, codigo: e.target.value.toUpperCase() })} />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="admin-nombre" className="form-label">Nombre *</label>
                  <input id="admin-nombre" className="form-control" value={draft.nombre} required
                    onChange={e => setDraft({ ...draft, nombre: e.target.value })} />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="admin-precio" className="form-label">Precio (CLP) *</label>
                  <input id="admin-precio" type="number" min="1" className="form-control"
                    value={draft.precio} required
                    onChange={e => setDraft({ ...draft, precio: e.target.value })} />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="admin-stock" className="form-label">Stock *</label>
                  <input id="admin-stock" type="number" min="0" step="1" className="form-control"
                    value={draft.stock} required
                    onChange={e => setDraft({ ...draft, stock: e.target.value })} />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="admin-descuento" className="form-label">Descuento (%)</label>
                  <input id="admin-descuento" type="number" min="0" max="90" step="1"
                    className="form-control" value={draft.descuento}
                    onChange={e => setDraft({ ...draft, descuento: e.target.value })} />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="admin-categoria" className="form-label">Categoría *</label>
                  <select id="admin-categoria" className="form-select" value={draft.categoria}
                    onChange={e => setDraft({ ...draft, categoria: e.target.value })}>
                    {Object.entries(categoryNames).map(([code, name]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label htmlFor="admin-descripcion" className="form-label">Descripción *</label>
                  <textarea id="admin-descripcion" className="form-control" rows="3" required
                    value={draft.descripcion}
                    onChange={e => setDraft({ ...draft, descripcion: e.target.value })} />
                </div>
                <div className="col-12">
                  <label htmlFor="admin-imagen" className="form-label">Imagen (opcional)</label>
                  <input id="admin-imagen" type="file" accept="image/jpeg,image/png,image/webp"
                    className="form-control" onChange={selectImage} />
                  <p className="small text-secondary mt-1">JPG, PNG o WebP, máximo 350 KB. Si no eliges ninguna, se usa una imagen predeterminada.</p>
                  <img src={draft.imagen || defaultImage} alt="Vista previa del producto"
                    className="img-fluid rounded border" style={{ maxHeight: 180, objectFit: "contain" }} />
                  {draft.imagen && (
                    <button type="button" className="btn btn-link d-block px-0"
                      onClick={() => setDraft({ ...draft, imagen: "" })}>Usar imagen predeterminada</button>
                  )}
                </div>
              </div>
              <div className="d-flex flex-wrap gap-2 mt-4">
                <button type="submit" className="btn btn-success">
                  {editing ? "Guardar cambios" : "Agregar producto"}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {tab === "pedidos" && (
        <div className="table-responsive">
          <h2 className="h4">Historial de pedidos simulados</h2>
          <table className="table">
            <thead><tr><th>Pedido</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th></tr></thead>
            <tbody>
              {(storage.read("orders", []) || []).map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td><td>{o.cliente?.correo}</td>
                  <td>{new Date(o.fecha).toLocaleString("es-CL")}</td>
                  <td>{money(o.total)}</td><td>{o.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "usuarios" && (
        <div className="table-responsive">
          <h2 className="h4">Usuarios registrados</h2>
          <p>Crea cuentas desde Registro. Aquí puedes cambiar sus roles o eliminarlas.</p>
          <table className="table">
            <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acción</th></tr></thead>
            <tbody>
              {(Array.isArray(users) ? users : []).map(u => (
                <tr key={u.correo}>
                  <td>{u.nombre}</td><td>{u.correo}</td>
                  <td>
                    <select aria-label={"Rol de " + u.nombre} className="form-select"
                      value={u.role || "cliente"} onChange={e => changeRole(u.correo, e.target.value)}>
                      <option value="cliente">Cliente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </td>
                  <td>
                    <button type="button" className="btn btn-outline-danger"
                      onClick={() => removeUser(u.correo)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
