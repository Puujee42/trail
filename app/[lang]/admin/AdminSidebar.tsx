"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTachometerAlt, FaPlaneDeparture, FaBlog, FaSignOutAlt, FaGlobe, FaFacebookMessenger, FaMapMarkedAlt } from "react-icons/fa";
import { SignOutButton } from "@clerk/nextjs";

interface SidebarProps {
  user: {
    name: string;
    imageUrl: string;
  };
}

export default function AdminSidebar({ user }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full z-50">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-blue-400">Аяллын Админ</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavItem href="/admin" icon={FaTachometerAlt} label="Хяналтын самбар" />
        <NavItem href="/admin/custom-trips" icon={FaMapMarkedAlt} label="Тусгай захиалгууд" />
        <NavItem href="/admin/trips" icon={FaPlaneDeparture} label="Аялал удирдах" />
        <NavItem href="/admin/blogs" icon={FaBlog} label="Блог удирдах" />
        <NavItem href="/admin/comments" icon={FaFacebookMessenger} label="Сэтгэгдлүүд" />
        <NavItem href="/admin/settings" icon={FaGlobe} label="Тохиргоо" />
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <img src={user.imageUrl} alt="Admin" className="w-10 h-10 rounded-full border border-slate-600" />
          <div>
            <p className="text-sm font-bold max-w-[120px] truncate">{user.name}</p>
            <p className="text-xs text-slate-400">Администратор</p>
          </div>
        </div>
        <SignOutButton>
          <button className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-bold w-full transition-colors">
            <FaSignOutAlt /> Гарах
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}

// Helper for active link styling
const NavItem = ({ icon: Icon, label, href }: any) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
    >
      <Icon className="text-lg" />
      <span className="font-medium">{label}</span>
    </Link>
  );
};