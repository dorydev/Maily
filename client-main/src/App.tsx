import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import { Switch } from "./components/ui/switch";

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");

    if (stored === "dark") {
      root.classList.add("dark");
      setIsDark(true);
      return;
    }

    if (stored === "light") {
      root.classList.remove("dark");
      setIsDark(false);
      return;
    }

    // Pas de thème stocké : on peut se baser sur la préférence système
    const prefersDark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (prefersDark) {
      root.classList.add("dark");
      setIsDark(true);
    } else {
      root.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const handleToggleTheme = (next: boolean) => {
    const root = document.documentElement;

    if (next) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    setIsDark(next);
  };

  return (
    <div className="relative min-h-screen">
      <Routes>
        {/* Redirige la racine vers /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>

      {/* Switch de thème global, visible sur tout le front */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <Switch checked={isDark} onCheckedChange={handleToggleTheme} />
        <span className="text-sm text-muted-foreground">
          {isDark ? "Dark" : "Light"}
        </span>
      </div>
    </div>
  );
}

export default App;
