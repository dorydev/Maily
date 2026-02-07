//import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import SmtpConfigPage from "./pages/smtp-config";
import { ThemeToggle } from "./components/theme-toggle";

function App() {


  return (
    <div className="relative min-h-screen">
      <ThemeToggle />
      <Routes>
        {/* Redirige la racine vers /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/smtp-config" element={<SmtpConfigPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>

    </div>
  );
}

export default App;
