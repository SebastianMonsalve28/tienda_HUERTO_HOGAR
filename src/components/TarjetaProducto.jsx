import React from "react";
import { Link } from "react-router-dom";
import { money, offerPrice } from "../carrito";
export default function ProductCard({ product, onAdd }) {
  return (
    <article className="card product-card h-100">
      <Link to={"/productos/" + product.codigo}>
        <img
          loading="lazy"
          className="card-img-top"
          src={product.imagen}
          alt={product.nombre}
        />
      </Link>
      <div className="card-body d-flex flex-column">
        <p className="eyebrow">{product.categoriaNombre}</p>
        <h3 className="h5">
          <Link className="product-title" to={"/productos/" + product.codigo}>
            {product.nombre}
          </Link>
        </h3>
        <p className="small text-secondary flex-grow-1">
          {product.descripcion}
        </p>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <span><strong className="price">{money(offerPrice(product))}</strong>{Number(product.descuento)>0 && <><small className="d-block text-muted text-decoration-line-through">{money(product.precio)}</small><span className="badge bg-success">-{product.descuento}%</span></>}</span>
          <button
            disabled={product.stock === 0}
            className="btn btn-success"
            onClick={() => onAdd(product)}
          >
            {product.stock === 0 ? "Agotado" : "Agregar"}
          </button>
        </div>
        <small className="text-secondary mt-2">
          Stock: {product.stock} unidades
        </small>
      </div>
    </article>
  );
}
