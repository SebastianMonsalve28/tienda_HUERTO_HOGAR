import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useStore } from "../Tienda";
import { storage } from "../almacenamiento";
import { validateCheckout, locations } from "../validaciones";
import { totalCart, money } from "../carrito";

export function Checkout() {
  const { items, setItems, user, products, setProducts } = useStore();
  const navigate = useNavigate();
  const [data, setData] = useState(() => {
    const users = storage.read('users', []);
    const stored = Array.isArray(users) ? users.find(u => u.correo === user?.correo) : null;
    return { nombre: stored?.nombre || user?.nombre || '', correo: user?.correo || '', direccion: stored?.direccion || '', region: stored?.region || '', comuna: stored?.comuna || '', indicaciones: '', entrega: 'domicilio', resultado: 'exito' };
  });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const change = e => {
    const {name, value} = e.target;
    const next = {...data, [name]: value, ...(name === 'region' ? {comuna: ''} : {})};
    setData(next);
    if (touched[name] || errors[name]) setErrors(validateCheckout(next));
  };
  const blur = e => { setTouched(t => ({...t, [e.target.name]: true})); setErrors(validateCheckout(data)); };
  const feedback = name => errors[name] && (touched[name] || Object.values(touched).includes('submit')) ? <p id={'checkout-'+name+'-error'} role="alert" className="text-danger small mt-1 mb-0">{errors[name]}</p> : null;
  const invalid = name => errors[name] && (touched[name] || Object.values(touched).includes('submit'));
  
  function submit(e) {
    e.preventDefault(); setError('');
    if (!items.length) return setError('El carrito está vacío.');
    const issues = validateCheckout(data); setErrors(issues); setTouched({nombre:'submit',correo:'submit',direccion:'submit',region:'submit',comuna:'submit',indicaciones:'submit'});
    if (Object.keys(issues).length) return;
    if (items.some(i => !Number.isInteger(i.cantidad) || i.cantidad < 1 || !products.some(p => p.codigo === i.codigo && p.stock >= i.cantidad)))
      return setError('Uno o más productos no tienen stock suficiente.');
    const pedido = { id: `HH-${Date.now()}`, fecha: new Date().toISOString(), cliente: { nombre: data.nombre.trim(), correo: data.correo.trim().toLowerCase(), direccion: data.direccion.trim(), region: data.region, comuna: data.comuna, indicaciones: data.indicaciones, entrega: data.entrega }, productos: items.map(i => ({ codigo: i.codigo, nombre: i.nombre, cantidad: i.cantidad, precio: i.precio })), total: totalCart(items), estado: data.resultado === 'exito' ? 'exitosa' : 'fallida' };
    if (data.resultado === 'exito') {
      const anteriores = storage.read('orders', []);
      if (!storage.write('orders', [...(Array.isArray(anteriores) ? anteriores : []), pedido])) return setError('No fue posible guardar el pedido.');
      setProducts(products.map(p => { const item = items.find(i => i.codigo === p.codigo); return item ? {...p, stock: p.stock - item.cantidad} : p; }));
      setItems([]);
    }
    navigate('/resultado', { state: { pedido } });
  }
  if (!items.length) return <section className="container section"><h1>Checkout</h1><p>Tu carrito está vacío.</p><Link to="/productos">Ver productos</Link></section>;
  return <section className="container section"><h1>Finalizar compra</h1><p className="text-secondary">Demostración académica: no se cobra dinero ni se realiza despacho real.</p>
    <div className="row g-4"><div className="col-lg-8"><form className="summary" onSubmit={submit} noValidate>
      <h2 className="h4">Datos del cliente y entrega</h2>
      {[["nombre","Nombre completo"],["correo","Correo electrónico"],["direccion","Dirección de entrega"]].map(([name,label]) => <div className="mb-3" key={name}><label htmlFor={'checkout-'+name}>{label}</label><input id={'checkout-'+name} className={"form-control " + (invalid(name) ? "is-invalid" : "")} name={name} value={data[name]} onChange={change} onBlur={blur} aria-invalid={!!invalid(name)} aria-describedby={invalid(name) ? "checkout-"+name+"-error" : undefined}/>{feedback(name)}</div>)}
      <div className="row g-3 mb-3"><div className="col-md-6"><label htmlFor="checkout-region">Región</label><select className="form-select" id="checkout-region" name="region" value={data.region} onChange={change} onBlur={blur} aria-invalid={!!invalid("region")}><option value="">Selecciona región</option>{Object.keys(locations).map(r => <option key={r}>{r}</option>)}</select>{feedback("region")}</div><div className="col-md-6"><label htmlFor="checkout-comuna">Comuna</label><select className="form-select" id="checkout-comuna" name="comuna" value={data.comuna} onChange={change} onBlur={blur} aria-invalid={!!invalid("comuna")}><option value="">Selecciona comuna</option>{(locations[data.region] || []).map(c => <option key={c}>{c}</option>)}</select>{feedback("comuna")}</div></div>
      <label htmlFor="checkout-indicaciones">Indicaciones (opcional)</label><textarea className="form-control mb-3" id="checkout-indicaciones" name="indicaciones" maxLength="300" value={data.indicaciones} onChange={change} onBlur={blur}/>{feedback("indicaciones")}
      <label htmlFor="checkout-entrega">Tipo de entrega</label><select className="form-select mb-3" id="checkout-entrega" name="entrega" value={data.entrega} onChange={change}><option value="domicilio">Despacho a domicilio (simulado)</option><option value="retiro">Retiro en tienda (simulado)</option></select>
      <label htmlFor="checkout-resultado">Resultado de pago simulado</label><select className="form-select mb-3" id="checkout-resultado" name="resultado" value={data.resultado} onChange={change}><option value="exito">Aprobar pago de prueba</option><option value="fallo">Rechazar pago de prueba</option></select>
      {error && <p role="alert" className="alert alert-danger">{error}</p>}<button className="btn btn-success" type="submit">Simular pago</button><Link className="btn btn-link" to="/carrito">Volver al carrito</Link>
    </form></div><aside className="col-lg-4"><div className="summary"><h2 className="h4">Resumen</h2>{items.map(i=><p key={i.codigo}>{i.nombre} × {i.cantidad}: {money(i.precio*i.cantidad)}</p>)}<strong>Total: {money(totalCart(items))}</strong></div></aside></div>
  </section>;
}
export function Resultado() {
  const navigate = useNavigate();
  const pedido = useLocation().state?.pedido;
  const ok = pedido?.estado === 'exitosa';
  if (!pedido) return <section className="container section"><h1>No hay resultado de pago</h1><Link to="/carrito">Volver al carrito</Link></section>;
  return <section className="container section"><div className="summary"><h1>{ok ? 'Compra exitosa' : 'No se pudo realizar el pago'}</h1><p>Pedido {pedido.id}</p><p>{pedido.cliente.nombre} · {pedido.cliente.correo}</p><p>{pedido.cliente.direccion}, {pedido.cliente.comuna}</p>{pedido.productos.map(i=><p key={i.codigo}>{i.nombre} × {i.cantidad} — {money(i.precio*i.cantidad)}</p>)}<h2>Total: {money(pedido.total)}</h2><p>Pago y despacho simulados. No se realizó ningún cobro.</p>{ok ? <Link to="/productos" className="btn btn-success">Seguir comprando</Link> : <button className="btn btn-success" onClick={()=>navigate('/checkout')}>Volver a intentar el pago</button>}</div></section>;
}
