import React from "react";
import { Sidebar } from "../../components/sideBar/SideBar";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/header/Header";

export function HomePage() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 relative bg-gradient-to-br from-[#1F1F1F] to-[#2A2A2A] text-white overflow-hidden flex items-center justify-center">
        <div className="relative z-10 text-center space-y-6 max-w-lg">
          <h1 className="text-4xl font-extrabold leading-tight">Bem-vindo, vamos começar!</h1>
          <p className="text-gray-300 text-lg">
            Comece sua jornada agora mesmo. Clique no botão abaixo para fazer login.
          </p>
          <button
            onClick={handleGoToLogin}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow-lg transition"
          >
            Ir para Login
          </button>
        </div>

        {/* Efeito de onda no rodapé */}
        <svg
          className="absolute bottom-0 left-0 w-full h-32 text-[#1F1F1F] rotate-180"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path
            fillOpacity="1"
            d="M0,64L48,90.7C96,117,192,171,288,165.3C384,160,480,96,576,85.3C672,75,768,117,864,149.3C960,181,1056,203,1152,181.3C1248,160,1344,96,1392,64L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </main>
    </div>
  );
}
