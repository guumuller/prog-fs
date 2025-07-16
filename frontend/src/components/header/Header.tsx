import React from "react";
import { ChevronDown } from "lucide-react";

export function Header() {
    return (
        <>
            <header className="bg-[#1F1F1F] shadow items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <div className="bg-white text-black px-2 py-1 rounded">
                                <span className="font-bold text-lg">AG</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <hr className="w-full bg-slate-600"/>
        </>
    );
}
