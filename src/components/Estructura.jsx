import React, { useState } from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import { useStore } from "../Tienda";
export default function Layout() {
  const { items, user, setUser, notice, setNotice } = useStore();
  const [open, setOpen] = useState(false);
  return (
    <>
      <a className="visually-hidden-focusable" href="#contenido">
        Saltar al contenido
      </a>
      <div className="topline">Cultivado cerca. Elegido para ti.</div>
      <header className="bg-white border-bottom">
        <nav
          className="navbar navbar-expand-lg container py-3"
          aria-label="Navegación principal"
        >
          <Link className="navbar-brand brand" to="/">
            Huerto<span>Hogar</span>
            <small>DEL CAMPO A TU MESA</small>
          </Link>
          <button
            className="navbar-toggler"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className={"navbar-collapse " + (open ? "" : "collapse")}>
            <div
              className="navbar-nav ms-auto gap-lg-2"
              onClick={() => setOpen(false)}
            >
              {[
                ["/", "Inicio"],
                ["/productos", "Productos"],
                ["/nosotros", "Nosotros"],
                ["/blog", "Blog"],
                ["/contacto", "Contacto"],
              ].map(([to, label]) => (
                <NavLink end={to === "/"} key={to} className="nav-link" to={to}>
                  {label}
                </NavLink>
              ))}
              {user ? (
                <>
                  <span className="nav-link">Hola, {user.nombre}</span>
                  {user.role === "admin" && (
                    <NavLink className="nav-link" to="/admin">
                      Administrar
                    </NavLink>
                  )}
                  <button
                    className="btn btn-link nav-link"
                    onClick={() => setUser(null)}
                  >
                    Salir
                  </button>
                </>
              ) : (
                <NavLink className="nav-link" to="/login">
                  Ingresar
                </NavLink>
              )}
              <NavLink className="btn btn-success ms-lg-2" to="/carrito">
                Carrito ({items.reduce((n, i) => n + i.cantidad, 0)})
              </NavLink>
            </div>
          </div>
        </nav>
      </header>
      {notice && (
        <div className="container mt-3">
          <div
            role="status"
            className="alert alert-success d-flex justify-content-between"
          >
            {notice}
            <button
              className="btn-close"
              aria-label="Cerrar aviso"
              onClick={() => setNotice("")}
            />
          </div>
        </div>
      )}
      <main id="contenido" tabIndex="-1">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container d-flex flex-wrap justify-content-between gap-3">
          <div>
            <strong>HuertoHogar</strong>
            <p className="mb-0">Productos locales, una mejor forma de comer.</p>
          </div>
          <p className="mb-0">
            Sebastian Monsalve · Lucas Parra
            <br />
            Desarrollo Fullstack II · 2026
          </p>
        </div>
      </footer>
    </>
  );
}
