import React, { createContext, useContext, useEffect, useState } from "react";
import { storage } from "./almacenamiento";
import { initialProducts } from "./productos";
import { addItem, changeQuantity, offerPrice } from "./carrito";
const Store = createContext(null);
export const useStore = () => useContext(Store);
export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const p = storage.read("products", initialProducts);
    return Array.isArray(p) &&
      p.every((x) => x.codigo && x.precio >= 0 && x.stock >= 0)
      ? p.map(x => ({...x, descuento: x.descuento ?? initialProducts.find(i => i.codigo === x.codigo)?.descuento ?? 0}))
      : initialProducts;
  });
  const [items, setItems] = useState(() => {
    const c = storage.read("cart", []);
    return Array.isArray(c)
      ? c.filter(
          (x) =>
            x.codigo &&
            Number.isInteger(x.cantidad) &&
            x.cantidad > 0 &&
            x.cantidad <= x.stock &&
            Number.isFinite(x.precio),
        )
      : [];
  });
  const [user, setUser] = useState(() => {
    const u = storage.read("session", null);
    return u?.correo ? u : null;
  });
  const [notice, setNotice] = useState("");
  useEffect(() => {
    storage.write("cart", items);
  }, [items]);
  useEffect(() => {
    storage.write("products", products);
  }, [products]);
  useEffect(() => {
    storage.write("session", user);
  }, [user]);
  function add(product, quantity = 1) {
    try {
      setItems(addItem(items, {...product, precio: offerPrice(product)}, quantity));
      setNotice(`${product.nombre} agregado al carrito.`);
    } catch (e) {
      setNotice(e.message);
    }
  }
  function update(code, quantity) {
    try {
      setItems(changeQuantity(items, code, quantity));
    } catch (e) {
      setNotice(e.message);
    }
  }
  return (
    <Store.Provider
      value={{
        products,
        setProducts,
        items,
        setItems,
        user,
        setUser,
        notice,
        setNotice,
        add,
        update,
      }}
    >
      {children}
    </Store.Provider>
  );
}
