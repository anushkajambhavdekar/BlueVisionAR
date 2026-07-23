import React from "react";
import { 
  LayoutDashboard, 
  FileImage, 
  Type, 
  Smartphone, 
  Hammer, 
  FolderOpen, 
  Settings
} from 'lucide-react';
import { motion } from 'motion/react';
import { Brand } from "./Brand";

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', sectionId: 'hero' },
  { icon: FileImage, label: 'Blueprint to 3D', sectionId: 'upload' },
  { icon: Type, label: 'Text to 3D', sectionId: 'hero' },
  { icon: Smartphone, label: 'AR Viewer', sectionId: 'ar' },
  { icon: Hammer, label: 'Manual Builder', sectionId: 'manual-builder' },
  { icon: FolderOpen, label: 'My Projects', sectionId: 'projects' },
  { icon: Settings, label: 'Viewer', sectionId: 'viewer' },
];

type SidebarProps = {
  onNavigate: (id: string) => void;
  userName: string;
  userEmail: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "BV";
}

export function Sidebar({ onNavigate, userName, userEmail }: SidebarProps) {
  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-screen w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Brand compact />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onNavigate(item.sectionId)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              index === 0
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 shadow-lg shadow-cyan-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-semibold">{getInitials(userName)}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">{userName}</p>
            <p className="text-xs text-gray-400">{userEmail}</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
