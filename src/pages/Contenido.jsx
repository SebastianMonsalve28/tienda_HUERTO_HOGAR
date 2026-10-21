import React from "react";
import { Link, useParams } from "react-router-dom";
const posts = [
  {
    id: "alimentacion",
    title: "Pequeños cambios, una alimentación más saludable",
    image: "comersaludable.jpg",
    body: "Incorpora frutas y verduras de distintos colores en tus comidas. Planificar la compra semanal te ayuda a aprovechar los alimentos de temporada, preparar platos variados y reducir desperdicios.",
  },
  {
    id: "productores",
    title: "El valor de comprar a productores locales",
    image: "locales.jpg",
    body: "Elegir productos locales fortalece la comunidad y nos acerca al origen de nuestros alimentos. En HuertoHogar queremos conectar a quienes cultivan con quienes disfrutan de productos frescos en casa.",
  },
];
export function About() {
  return (
    <section className="container section">
      <p className="eyebrow">NUESTRA HISTORIA</p>
      <h1>Del campo a los hogares chilenos</h1>
      <div className="row g-5 align-items-center mt-2">
        <div className="col-md-6">
          <img
            className="detail-image"
            src="img/huerto.webp"
            alt="Cultivos de HuertoHogar"
          />
        </div>
        <div className="col-md-6">
          <h2 className="h4">Nuestra misión</h2>
          <p>
            Entregar productos frescos y de calidad, apoyando a productores
            locales y promoviendo una alimentación saludable.
          </p>
          <h2 className="h4">Nuestra visión</h2>
          <p>
            Ser una tienda reconocida por su calidad, servicio y compromiso con
            la sostenibilidad.
          </p>
          <h2 className="h4">Nuestro equipo</h2>
          <p>
            Sebastian Monsalve y Lucas Parra.
            <br />
            Proyecto académico · Desarrollo Fullstack II.
          </p>
        </div>
      </div>
    </section>
  );
}
export function Blog() {
  const { id } = useParams();
  const post = posts.find((p) => p.id === id);
  if (id && !post) return <NotFound />;
  return (
    <section className="container section">
      <p className="eyebrow">IDEAS QUE CULTIVAMOS</p>
      <h1>{post ? post.title : "El blog de HuertoHogar"}</h1>
      {post ? (
        <article className="reading">
          <img
            className="w-100 rounded-4 my-4"
            src={"img/" + post.image}
            alt={post.title}
          />
          <p className="lead">{post.body}</p>
          <Link to="/blog">← Volver al blog</Link>
        </article>
      ) : (
        <div className="row g-4 mt-3">
          {posts.map((p) => (
            <article className="col-md-6" key={p.id}>
              <div className="card h-100">
                <img
                  className="blog-image card-img-top"
                  src={"img/" + p.image}
                  alt={p.title}
                />
                <div className="card-body">
                  <h2 className="h4">{p.title}</h2>
                  <Link to={"/blog/" + p.id}>Leer artículo →</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
export function NotFound() {
  return (
    <section className="container section">
      <h1>Página no encontrada</h1>
      <Link className="btn btn-success" to="/">
        Volver al inicio
      </Link>
    </section>
  );
}
