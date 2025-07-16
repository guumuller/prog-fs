import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage } from './screens/login/LoginPage';
import { RegisterPage } from './screens/openAccount/RegisterPage';
import { HomePage } from './screens/home/HomePage';
import { UserPage } from './screens/user/UserPage';
import React from 'react';
import { DashboardPage } from './screens/dashboard/DashboardPage';
import { CustomersPage } from './screens/customers/CustomersPage';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomersPage />} />
      </Routes>
    </Router>
  );
}
