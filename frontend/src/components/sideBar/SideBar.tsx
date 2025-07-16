import React from "react";
import { Home, Gauge, Package, ShoppingCart, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { HeaderSideBar } from "./header/headerSideBar";
import { FooterSideBar } from "./footer/footerSideBar";

type NavItemType = {
  label: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItemType[] = [
  { label: "Home", icon: <Home size={20} />, path: "/home" },
  { label: "Dashboard", icon: <Gauge size={20} />, path: "/dashboard" },
  { label: "Orders", icon: <ShoppingCart size={20} />, path: "/orders" },
  { label: "Products", icon: <Package size={20} />, path: "/products" },
  { label: "Customers", icon: <Users size={20} />, path: "/customers" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 bg-[#1F1F1F] text-white h-screen flex flex-col justify-between">
      <div>
        <HeaderSideBar />
        <nav className="mt-4 space-y-1 px-4">
          {navItems.map((item) => (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center space-x-3 px-3 py-2 rounded cursor-pointer transition-colors ${
                location.pathname === item.path ? "bg-blue-600 text-white" : "hover:bg-[#2A2A2A] text-gray-300"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>
      <FooterSideBar />
    </aside>
  );
}
