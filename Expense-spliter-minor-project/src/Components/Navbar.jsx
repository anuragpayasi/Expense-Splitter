import React from "react";

export default function Navbar() {
  return (
    <nav className="backdrop-blur-md bg-white/40 border-b border-white/30 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-xl font-bold tracking-wide">
          Expense <span className="text-blue-600">Splitter</span>
        </h1>

        {/* Nav Items */}
        <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
          <li className="hover:text-blue-600 cursor-pointer transition">Home</li>
          <li className="hover:text-blue-600 cursor-pointer transition">People</li>
          <li className="hover:text-blue-600 cursor-pointer transition">Summary</li>
        </ul>

        {/* Mobile Menu Icon */}
        <div className="md:hidden text-2xl cursor-pointer">☰</div>
      </div>
    </nav>
  );
}