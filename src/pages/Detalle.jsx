
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useStore } from "../Tienda";
import { money } from "../carrito";

export default function Detail() {
  const { code } = useParams();
  const { products, items, add } = useStore();
  const [quantity, setQuantity] = useState(1);

  const p = products.find((product) => product.codigo === code);

  if (!p) {
    return (
      <section className="container section">
        <h1>Producto no encontrado</h1>
        <Link to="/productos">Volver al catálogo</Link>
      </section>
    );
  }

  const inCart =
    items.find((item) => item.codigo === p.codigo)?.cantidad || 0;

  const availableStock = Math.max(0, p.stock - inCart);

  function handleAdd() {
    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > availableStock
    ) {
      return;
    }

    add(p, quantity);
    setQuantity(1);
  }

  return (
    <section className="container section">
      <Link to="/productos">← Volver a productos</Link>

      <div className="row g-5 align-items-center mt-1">
        <div className="col-md-6">
          <img
            className="detail-image"
            src={p.imagen}
            alt={p.nombre}
          />
        </div>

        <div className="col-md-6">
          <p className="eyebrow">{p.categoriaNombre}</p>

          <h1>{p.nombre}</h1>

          <p className="price fs-3">{money(p.precio)}</p>

          <p>{p.descripcion}</p>

          <p>
            Stock disponible: {availableStock} unidades
            {" · "}Código {p.codigo}
          </p>

          {inCart > 0 && (
            <p className="text-secondary">
              Unidades en tu carrito: {inCart}
            </p>
          )}

          <label htmlFor="quantity" className="form-label">
            Cantidad
          </label>

          <input
            className="form-control mb-3 quantity"
            id="quantity"
            type="number"
            min="1"
            max={availableStock}
            value={quantity}
            onChange={(e) =>
              setQuantity(Number(e.target.value))
            }
            disabled={availableStock === 0}
          />

          <button
            className="btn btn-success btn-lg"
            disabled={
              availableStock === 0 ||
              !Number.isInteger(quantity) ||
              quantity < 1 ||
              quantity > availableStock
            }
            onClick={handleAdd}
          >
            {availableStock === 0
              ? "Sin stock disponible"
              : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </section>
  );
}
