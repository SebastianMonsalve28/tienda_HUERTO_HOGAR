import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../Tienda";
import { storage } from "../almacenamiento";
import { money } from "../carrito";

const blank = {
  codigo: "", nombre: "", categoria: "frutas", precio: "", stock: "",
  descripcion: "", imagen: "", descuento: "0",
};
const defaultImage = "img/manzanas.jpg";
const categories = { frutas: "Frutas Frescas", verduras: "Verduras Orgánicas", organicos: "Productos Orgánicos" };

export default function Admin() {
  const { user, products, setProducts, items, setItems } = useStore();
  const [draft, setDraft] = useState(blank);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tab, setTab] = useState("productos");
  const [users, setUsers] = useState(() => storage.read("users", []));

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return (
    <section className="container section">
      <h1>Acceso restringido</h1><p>Solo un administrador puede entrar a esta sección.</p>
    </section>
  );

  function resetForm() {
    setDraft(blank);
    setEditing(false);
    setError("");
  }

  function selectImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Selecciona una imagen JPG, PNG o WebP.");
      e.target.value = "";
      return;
    }
    if (file.size > 350 * 1024) {
      setError("La foto debe pesar menos de 350 KB para poder guardarla en este navegador.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDraft(prev => ({ ...prev, imagen: String(reader.result) }));
      setError("");
    };
    reader.onerror = () => setError("No se pudo leer la imagen.");
    reader.readAsDataURL(file);
  }

  function save(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    const p = {
      ...draft,
      codigo: draft.codigo.trim().toUpperCase(),
      nombre: draft.nombre.trim(),
      descripcion: draft.descripcion.trim(),
      precio: Number(draft.precio),
      stock: Number(draft.stock),
      descuento: Number(draft.descuento || 0),
      imagen: draft.imagen || defaultImage,
      categoriaNombre: categories[draft.categoria],
    };
    if (!/^[A-Z0-9]{3,12}$/.test(p.codigo) || !p.nombre || !p.descripcion ||
      draft.precio === "" || !Number.isFinite(p.precio) || p.precio <= 0 ||
      draft.stock === "" || !Number.isInteger(p.stock) || p.stock < 0 ||
      !Number.isInteger(p.descuento) || p.descuento < 0 || p.descuento > 90 ||
      !categories[p.categoria]) {
      setError("Completa código (3 a 12 letras o números), nombre, descripción, precio positivo, stock entero y descuento entre 0 y 90.");
      return;
    }
    if (!editing && products.some(x => x.codigo === p.codigo)) {
      setError("El código ya existe.");
      return;
    }
    if (editing && !products.some(x => x.codigo === p.codigo)) {
      setError("El producto que intentas editar ya no existe.");
      return;
    }
    const nextProducts = editing
      ? products.map(x => x.codigo === p.codigo ? p : x)
      : [...products, p];
    // Se valida la persistencia antes de actualizar el catálogo visible.
    if (!storage.write("products", nextProducts)) {
      setError("No se pudo guardar. El almacenamiento del navegador puede estar lleno; prueba con una foto más pequeña.");
      return;
    }
    setProducts(nextProducts);
