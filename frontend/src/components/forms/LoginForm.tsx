import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginService } from '../../services/login.service';
import { userStore } from '../../store/userStore';

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = loginService();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login({ email, senha });
      const token = response?.data?.token;
      const userData = response?.data?.usuario;
      

      localStorage.setItem('token', token);
      localStorage.setItem('userId', String(userData.id));
      userStore.getState().setUser(userData);
      console.log(userStore.getState().user);
      console.log(token);
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || 'Dados inválidos');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1F1F1F] to-[#2A2A2A] px-4 overflow-hidden">
      <div className="z-10 bg-[#121212] p-8 rounded-xl shadow-2xl w-full max-w-md text-white">
        <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">Entre em sua conta</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-[#1F1F1F] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-4 py-2 bg-[#1F1F1F] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
          >
            Entrar
          </button>
        </form>

        {errorMsg && (
          <p className="text-red-500 text-sm text-center mt-4">{errorMsg}</p>
        )}

        <p className="text-center text-sm mt-6 text-gray-400">
          Não tem conta?{' '}
          <a href="/register" className="text-blue-500 font-medium hover:underline">Cadastre-se</a>
        </p>
      </div>
      <svg
        className="absolute bottom-0 left-0 w-full h-32 text-[#1F1F1F] rotate-180"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path
          fillOpacity="1"
          d="M0,64L48,90.7C96,117,192,171,288,165.3C384,160,480,96,576,85.3C672,75,768,117,864,149.3C960,181,1056,203,1152,181.3C1248,160,1344,96,1392,64L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        ></path>
      </svg>
    </div>
  );
}
