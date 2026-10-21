export const offerPrice = product => Number(product.descuento) > 0 ? Math.round(Number(product.precio) * (1 - Number(product.descuento)/100)) : Number(product.precio);
export const money = (value) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
export function addItem(items, product, quantity = 1) {
  if (!product || !Number.isInteger(quantity) || quantity < 1)
    throw new Error("Ingresa una cantidad entera mayor que cero.");
  const previous = items.find((item) => item.codigo === product.codigo);
  if ((previous?.cantidad || 0) + quantity > product.stock)
    throw new Error("La cantidad supera el stock disponible.");
  return previous
    ? items.map((item) =>
        item.codigo === product.codigo
          ? { ...item, cantidad: item.cantidad + quantity }
          : item,
      )
    : [...items, { ...product, cantidad: quantity }];
}
export function changeQuantity(items, code, quantity) {
  const product = items.find((item) => item.codigo === code);
  if (
    !product ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > product.stock
  )
    throw new Error("Cantidad fuera del stock disponible.");
  return items.map((item) =>
    item.codigo === code ? { ...item, cantidad: quantity } : item,
  );
}
export const totalCart = (items) =>
  items.reduce((total, item) => total + item.precio * item.cantidad, 0);
