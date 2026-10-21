import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./Tienda";
import Layout from "./components/Estructura";
import Home from "./pages/Inicio";
import Catalog from "./pages/Catalogo";
import Detail from "./pages/Detalle";
import Cart from "./pages/Carrito";
import AccountForm from "./components/FormularioCuenta";
import Admin from "./pages/Administracion";
import { About, Blog, NotFound } from "./pages/Contenido";
export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="productos" element={<Catalog />} />
            <Route path="productos/:code" element={<Detail />} />
            <Route path="carrito" element={<Cart />} />
            <Route path="nosotros" element={<About />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<Blog />} />
            <Route
              path="contacto"
              element={<AccountForm key="contact" mode="contact" />}
            />
            <Route
              path="login"
              element={<AccountForm key="login" mode="login" />}
            />
            <Route
              path="registro"
              element={<AccountForm key="register" mode="register" />}
            />
            <Route path="admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}
