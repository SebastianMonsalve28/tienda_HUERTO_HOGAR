import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/TarjetaProducto";
import { useStore } from "../Tienda";
export default function Home() {
  const { products, add } = useStore();
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <p className="eyebrow">FRESCO · LOCAL · NATURAL</p>
              <h1>
                Lo mejor del campo,
                <br />
                <em>en tu hogar.</em>
              </h1>
              <p className="lead my-4">
                Frutas, verduras y productos orgánicos seleccionados para llenar
                tu mesa de sabor.
              </p>
              <Link className="btn btn-success btn-lg" to="/productos">
                Descubrir productos →
              </Link>
              <div className="hero-tags mt-4">
                Productores locales <span>•</span> Frescura de temporada
              </div>
            </div>
            <div className="col-lg-6">
              <img
                className="hero-image"
                src="img/huerto.webp"
                alt="Cultivos verdes de nuestro huerto"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="container section">
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
          <div>
            <p className="eyebrow">DE LA TIERRA A TU MESA</p>
            <h2 className="mb-0">Favoritos de temporada</h2>
          </div>
          <Link to="/productos">Ver todos los productos →</Link>
        </div>
        <div className="row g-4">
          {products.slice(0, 3).map((p) => (
            <div className="col-sm-6 col-lg-4" key={p.codigo}>
              <ProductCard product={p} onAdd={add} />
            </div>
          ))}
        </div>
      </section>
      <section className="story-strip">
        <div className="container row mx-auto align-items-center g-4">
          <div className="col-md-5">
            <p className="eyebrow">CONOCE HUERTOHOGAR</p>
            <h2>
              Cerca del origen.
              <br />
              Cerca de ti.
            </h2>
            <p>
              Apoyamos a productores locales y una alimentación más consciente.
            </p>
            <Link className="btn btn-outline-success" to="/nosotros">
              Nuestra historia
            </Link>
          </div>
          <div className="col-md-7">
            <video
              className="w-100 rounded-4"
              controls
              preload="none"
              poster="img/huerto.webp"
            >
              <source src="video/video.mp4" type="video/mp4" />
              Tu navegador no permite reproducir este video.
            </video>
          </div>
        </div>
      </section>
    </>
  );
}
