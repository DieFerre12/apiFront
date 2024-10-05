import React from "react";
import "./App.css";
import Form from "../components/Form";
import Navigation from "./Navigation";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./Home";
import Contact from "./Contact";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation()

  const handleClick = () => {
    navigate("/contact");
  };

  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <button onClick={handleClick}>Ir a contacto</button>
      <p>La ruta actual es: {location.pathname}</p>
    </>
  );
};

export default App;
