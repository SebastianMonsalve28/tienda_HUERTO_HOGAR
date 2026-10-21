import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useStore } from "../Tienda";
import { money } from "../carrito";
export default function Detail() {
  const { code } = useParams(),
    { products, add } = useStore(),
    [quantity, setQuantity] = useState(1);
  const p = products.find((p) => p.codigo === code);
  if (!p)
    return (
      <section className="container section">
        <h1>Producto no encontrado</h1>
        <Link to="/productos">Volver al catálogo</Link>
      </section>
    );
  return (
    <section className="container section">
      <Link to="/productos">← Volver a productos</Link>
      <div className="row g-5 align-items-center mt-1">
        <div className="col-md-6">
          <img className="detail-image" src={p.imagen} alt={p.nombre} />
        </div>
        <div className="col-md-6">
          <p className="eyebrow">{p.categoriaNombre}</p>
          <h1>{p.nombre}</h1>
          <p className="price fs-3">{money(p.precio)}</p>
          <p>{p.descripcion}</p>
          <p>
            Stock disponible: {p.stock} unidades · Código {p.codigo}
          </p>
          <label htmlFor="quantity" className="form-label">
            Cantidad
          </label>
          <input
            className="form-control mb-3 quantity"
            id="quantity"
            type="number"
            min="1"
            max={p.stock}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <button
            disabled={p.stock === 0}
            className="btn btn-success btn-lg"
            onClick={() => add(p, quantity)}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </section>
  );
}
