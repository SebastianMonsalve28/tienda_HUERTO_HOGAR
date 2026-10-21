import React, { useState } from "react";
import { useStore } from "../Tienda";
import ProductCard from "../components/TarjetaProducto";
export default function Catalog() {
  const { products, add } = useStore();
  const [category, setCategory] = useState("todos"),
    [search, setSearch] = useState("");
  const filtered = products.filter(
    (p) =>
      (category === "todos" || p.categoria === category) &&
      p.nombre.toLocaleLowerCase("es").includes(search.toLocaleLowerCase("es")),
  );
  return (
    <section className="container section">
      <p className="eyebrow">FRESCURA QUE SE NOTA</p>
      <h1>Nuestros productos</h1>
      <p className="text-secondary">
        Elige tus favoritos y lleva lo mejor del campo a casa.
      </p>
      <div className="row align-items-center g-3 my-3">
        <div
          className="col-lg-8 d-flex flex-wrap gap-2"
          role="group"
          aria-label="Categorías"
        >
          {[
            ["todos", "Todos"],
            ["frutas", "Frutas"],
            ["verduras", "Verduras"],
            ["organicos", "Orgánicos"],
          ].map(([id, name]) => (
            <button
              className={
                "btn " +
                (category === id ? "btn-success" : "btn-outline-success")
              }
              aria-pressed={category === id}
              key={id}
              onClick={() => setCategory(id)}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="col-lg-4">
          <label htmlFor="search" className="visually-hidden">
            Buscar productos
          </label>
          <input
            id="search"
            className="form-control"
            placeholder="Buscar un producto…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <p role="status" className="small text-secondary">
        {filtered.length} productos encontrados
      </p>
      <div className="row g-4">
        {filtered.map((p) => (
          <div className="col-12 col-sm-6 col-lg-4" key={p.codigo}>
            <ProductCard product={p} onAdd={add} />
          </div>
        ))}
      </div>
      {!filtered.length && (
        <p className="alert alert-light">
          No encontramos productos. Prueba otra búsqueda.
        </p>
      )}
    </section>
  );
}
