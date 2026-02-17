import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, Menu, X, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const toggle = () => setIsOpen(!isOpen);

  const links = [
    { href: "/", label: "Anasayfa", icon: LayoutDashboard },
    { href: "/visitors", label: "Ziyaretçi Kaydı", icon: Users },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={toggle}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border md:hidden text-primary hover:bg-accent/10 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed inset-y-0 left-0 z-40 w-72 bg-card/95 backdrop-blur-xl border-r border-border shadow-2xl flex flex-col",
              "md:translate-x-0 md:relative md:block",
              !isOpen && "hidden md:flex"
            )}
          >
            {/* Logo Area */}
            <div className="p-8 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <ShieldCheck className="text-black w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-display tracking-wide text-white">
                    GÜVENLİK
                  </h1>
                  <p className="text-xs text-primary font-medium tracking-widest uppercase">
                    Kontrol Paneli
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 mt-4">
              {links.map((link) => {
                const isActive = location === link.href;
                const Icon = link.icon;
                
                return (
                  <Link key={link.href} href={link.href}>
                    <div
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 cursor-pointer group relative overflow-hidden",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 font-semibold" 
                          : "text-muted-foreground hover:text-white hover:bg-white/5"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5]" : "group-hover:text-primary transition-colors")} />
                      <span className="text-sm tracking-wide">{link.label}</span>
                      
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-white/10"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-white/5">
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-muted-foreground text-center">
                  © 2024 Güvenlik Sistemleri<br/>v1.0.0
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
