import React from 'react';
import { useStore } from '../Tienda';
import ProductCard from '../components/TarjetaProducto';
export default function Ofertas(){const { products,add }=useStore();const offers=products.filter(p=>Number(p.descuento)>0);return <section className="container section"><h1>Ofertas</h1><p className="text-secondary">Productos con descuentos disponibles</p><div className="row g-4">{offers.map(p=><div className="col-12 col-sm-6 col-lg-4" key={p.codigo}><ProductCard product={p} onAdd={add}/><p className="text-success">{p.descuento}% de descuento · Antes: ${p.precio.toLocaleString('es-CL')}</p></div>)}</div>{!offers.length && <p>No hay ofertas por el momento.</p>}</section>}
