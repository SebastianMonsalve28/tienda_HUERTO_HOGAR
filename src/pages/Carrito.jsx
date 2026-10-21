import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../Tienda";
import { money, totalCart } from "../carrito";
export default function Cart() {
  const { items, setItems, update } = useStore();
  const [done, setDone] = useState(false);
  return (
    <section className="container section">
      <h1>Tu carrito</h1>
      {done && (
        <p role="status" className="alert alert-success">
          Pedido de demostración confirmado. No se realizó ningún cobro ni
          envío.
        </p>
      )}
      {!items.length ? (
        <div className="empty-state">
          <h2 className="h4">Tu carrito está vacío</h2>
          <p>Un poco de frescura está a un clic.</p>
          <Link className="btn btn-success" to="/productos">
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="row g-4 mt-2">
          <div className="col-lg-8">
            {items.map((i) => (
              <article className="cart-line" key={i.codigo}>
                <img src={i.imagen} alt={i.nombre} />
                <div className="flex-grow-1">
                  <h2 className="h6">{i.nombre}</h2>
                  <p>{money(i.precio)} por unidad</p>
                  <label className="small" htmlFor={"qty-" + i.codigo}>
                    Cantidad de {i.nombre}
                  </label>
                  <input
                    className="form-control quantity"
                    id={"qty-" + i.codigo}
                    type="number"
                    min="1"
                    max={i.stock}
                    value={i.cantidad}
                    onChange={(e) => update(i.codigo, Number(e.target.value))}
                  />
                </div>
                <div>
                  <strong>{money(i.precio * i.cantidad)}</strong>
                  <button
                    className="btn btn-link text-danger d-block px-0"
                    onClick={() =>
                      setItems(items.filter((p) => p.codigo !== i.codigo))
                    }
                  >
                    Eliminar {i.nombre}
                  </button>
                </div>
              </article>
            ))}
            <button
              className="btn btn-outline-danger mt-3"
              onClick={() => setItems([])}
            >
              Vaciar carrito
            </button>
          </div>
          <aside className="col-lg-4">
            <div className="summary">
              <h2 className="h4">Resumen de compra</h2>
              <p className="d-flex justify-content-between mt-4">
                <span>Total</span>
                <strong data-testid="total">{money(totalCart(items))}</strong>
              </p>
              <p className="small text-secondary">
                Simulación académica. Sin pagos ni despacho real.
              </p>
              <button
                className="btn btn-success w-100"
                onClick={() => {
                  setDone(true);
                  setItems([]);
                }}
              >
                Confirmar pedido de prueba
              </button>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
