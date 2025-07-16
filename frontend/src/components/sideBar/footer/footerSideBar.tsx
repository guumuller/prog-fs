import { CircleUser, LogOut, MoreVertical, Palette } from "lucide-react";
import React, { useState } from "react";
import { userStore } from "../../../store/userStore";

export function FooterSideBar() {
    const user = userStore(state => state.user);
    const [showDropdown, setShowDropdown] = useState(false);

    return(
        <div className="relative">
        {showDropdown && (
          <div className="absolute bottom-16 left-4 right-4 bg-[#2A2A2A] border border-gray-600 rounded p-2 z-50 shadow-lg">
            <ul className="space-y-1">
              <div className="flex flex-row hover:bg-gray-700 rounded items-center cursor-pointer pl-2">
                <Palette size={15} />
                <li className="text-sm px-2 py-1">Theme</li>
              </div>
              <div className="flex flex-row items-center hover:bg-gray-700 rounded cursor-pointer pl-2">
                <LogOut color="#ef4444" size={15} />
                <li className="text-sm text-red-500 px-2 py-1">Log out</li>
              </div>
            </ul>
          </div>
        )}
        <div className="p-4 border-t border-gray-600 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <CircleUser size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-none">
                {user ? user.nome : "Usuário não logado"}
              </span>
              {user && (
                <span className="text-xs text-gray-400 truncate max-w-[120px]">
                  {user.email}
                </span>
              )}
            </div>
          </div>
          <div
            onClick={() => setShowDropdown(prev => !prev)}
            className="p-1 rounded-full hover:bg-gray-600 cursor-pointer transition-colors"
            title="Mais opções"
          >
            <MoreVertical size={18} className="text-gray-400" />
          </div>
        </div>
      </div>
    )
}