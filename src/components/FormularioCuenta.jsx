import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validate, locations } from "../validaciones";
import { storage } from "../almacenamiento";
import { useStore } from "../Tienda";
export default function AccountForm({ mode }) {
  const { setUser } = useStore(),
    navigate = useNavigate();
  const [values, setValues] = useState({
      nombre: "",
      correo: "",
      password: "",
      run: "",
      region: "",
      comuna: "",
      direccion: "",
      comentario: "",
    }),
    [errors, setErrors] = useState({}),
    [success, setSuccess] = useState("");
  const title =
    mode === "contact"
      ? "Conversemos"
      : mode === "login"
        ? "Bienvenido de nuevo"
        : "Crea tu cuenta";
  function change(e) {
    const { name, value } = e.target;
    setValues((v) => ({
      ...v,
      [name]: value,
      ...(name === "region" ? { comuna: "" } : {}),
    }));
    setSuccess("");
  }
  function submit(e) {
    e.preventDefault();
    const next = validate(values, mode);
    setErrors(next);
    setSuccess("");
    if (Object.keys(next).length) return;
    const email = values.correo.trim().toLowerCase();
    const savedUsers = storage.read("users", []),
      users = Array.isArray(savedUsers) ? savedUsers : [];
    if (mode === "contact") {
      const old = storage.read("messages", []);
      if (
        !storage.write("messages", [
          ...(Array.isArray(old) ? old : []),
          {
            nombre: values.nombre,
            correo: email,
            comentario: values.comentario,
            fecha: new Date().toISOString(),
          },
        ])
      ) {
        setErrors({
          general:
            "No se pudo guardar el mensaje. Revisa el almacenamiento del navegador.",
        });
        return;
      }
      setSuccess(
        "Mensaje guardado en esta demostración. No se envió un correo.",
      );
      setValues((v) => ({ ...v, comentario: "" }));
      return;
    }
    if (mode === "register") {
      if (users.some((u) => u.correo === email)) {
        setErrors({ correo: "Ya existe una cuenta con ese correo." });
        return;
      }
      const user = { ...values, correo: email, role: "cliente" };
      if (!storage.write("users", [...users, user])) {
        setErrors({ general: "No se pudo guardar la cuenta." });
        return;
      }
      setUser({ nombre: user.nombre, correo: user.correo, role: user.role });
      navigate("/");
      return;
    }
    const user =
      email === "admin@duoc.cl" && values.password === "Admin123"
        ? { nombre: "Administrador", correo: email, role: "admin" }
        : users.find(
            (u) => u.correo === email && u.password === values.password,
          );
    if (!user) {
      setErrors({ general: "Correo o contraseña incorrectos." });
      return;
    }
    setUser({ nombre: user.nombre, correo: user.correo, role: user.role });
    navigate(user.role === "admin" ? "/admin" : "/");
  }
  function field(name, label, type = "text", maxLength = 100) {
    return (
      <div className="mb-3">
        <label className="form-label" htmlFor={name}>
          {label}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          maxLength={maxLength}
          className={"form-control " + (errors[name] ? "is-invalid" : "")}
          value={values[name]}
          onChange={change}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? name + "-error" : undefined}
        />
        {errors[name] && (
          <div id={name + "-error"} className="invalid-feedback" role="alert">
            {errors[name]}
          </div>
        )}
      </div>
    );
  }
  return (
    <section className="container section">
      <div className="form-shell">
        <p className="eyebrow">HUERTOHOGAR</p>
        <h1>{title}</h1>
        <p className="text-secondary">
          {mode === "contact"
            ? "Cuéntanos cómo podemos ayudarte."
            : "Tu próxima compra comienza aquí."}
        </p>
        <form noValidate onSubmit={submit}>
          {mode !== "login" && field("nombre", "Nombre completo")}
          {mode === "register" && field("run", "RUN (con dígito verificador)")}
          {field("correo", "Correo electrónico", "email")}
          {mode !== "contact" &&
            field("password", "Contraseña", "password", 10)}
          {mode === "register" && (
            <>
              <div className="mb-3">
                <label htmlFor="region" className="form-label">
                  Región
                </label>
                <select
                  className="form-select"
                  id="region"
                  name="region"
                  value={values.region}
                  onChange={change}
                >
                  <option value="">Selecciona una región</option>
                  {Object.keys(locations).map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="comuna" className="form-label">
                  Comuna
                </label>
                <select
                  className="form-select"
                  id="comuna"
                  name="comuna"
                  value={values.comuna}
                  onChange={change}
                  aria-invalid={!!errors.comuna}
                >
                  <option value="">Selecciona una comuna</option>
                  {(locations[values.region] || []).map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
                {errors.comuna && (
                  <p className="text-danger small" role="alert">
                    {errors.comuna}
                  </p>
                )}
              </div>
              {field("direccion", "Dirección", "text", 200)}
            </>
          )}
          {mode === "contact" && (
            <div className="mb-3">
              <label className="form-label" htmlFor="comentario">
                Mensaje
              </label>
              <textarea
                id="comentario"
                name="comentario"
                rows="5"
                maxLength="500"
                className="form-control"
                value={values.comentario}
                onChange={change}
                aria-invalid={!!errors.comentario}
              />
              <small>{values.comentario.length}/500</small>
              {errors.comentario && (
                <p className="text-danger" role="alert">
                  {errors.comentario}
                </p>
              )}
            </div>
          )}
          {errors.general && (
            <p className="alert alert-danger" role="alert">
              {errors.general}
            </p>
          )}
          {success && (
            <p className="alert alert-success" role="status">
              {success}
            </p>
          )}
          <button className="btn btn-success w-100" type="submit">
            {mode === "contact"
              ? "Guardar mensaje"
              : mode === "login"
                ? "Iniciar sesión"
                : "Registrarme"}
          </button>
        </form>
        {mode === "login" && (
          <>
            <p className="mt-3">
              ¿Aún no tienes cuenta? <Link to="/registro">Regístrate</Link>
            </p>
            <p className="small text-secondary">
              Demo administrador: admin@duoc.cl / Admin123
            </p>
          </>
        )}
        {mode !== "contact" && (
          <p className="small text-secondary mt-3">
            Prototipo académico con datos locales. Utiliza datos y contraseñas
            de prueba.
          </p>
        )}
      </div>
    </section>
  );
}
