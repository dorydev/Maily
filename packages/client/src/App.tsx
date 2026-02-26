//import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import MailEditor from "./pages/mail-editor";
import SmtpConfigPage from "./pages/smtp-config";
import { ThemeToggle } from "./components/theme-toggle";
import ErrorBoundary from "./handler/error";

function App() {
  return (
    <div className="relative min-h-screen">
      <ErrorBoundary
        onError={(error, errorInfo) => {
          // Centralise ici le logging (console, Sentry, etc.)
          console.error("Unhandled UI error:", error, errorInfo);
        }}
      >
      <ThemeToggle />
      <Routes>
        {/* Redirige la racine vers /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/smtp-config" element={<SmtpConfigPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mail-editor" element={<MailEditor />} />
      </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
