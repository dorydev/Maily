//import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import SmtpConfigPage from "./pages/smtp-config";

function App() {


  return (
    <div className="relative min-h-screen">
      <Routes>
        {/* Redirige la racine vers /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/smtp-config" element={<SmtpConfigPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>

      {/* Switch de thème global, visible sur tout le front */}
    </div>
  );
}

export default App;
