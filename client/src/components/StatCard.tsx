import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color?: "gold" | "red" | "blue" | "green";
  trend?: string;
}

export function StatCard({ label, value, icon: Icon, color = "gold", trend }: StatCardProps) {
  const colorStyles = {
    gold: "from-amber-500/20 to-yellow-500/5 border-amber-500/20 text-amber-500",
    red: "from-red-500/20 to-rose-500/5 border-red-500/20 text-red-500",
    blue: "from-blue-500/20 to-cyan-500/5 border-blue-500/20 text-blue-500",
    green: "from-emerald-500/20 to-green-500/5 border-emerald-500/20 text-emerald-500",
  };

  const iconStyles = {
    gold: "bg-amber-500/10 text-amber-500 shadow-amber-500/10",
    red: "bg-red-500/10 text-red-500 shadow-red-500/10",
    blue: "bg-blue-500/10 text-blue-500 shadow-blue-500/10",
    green: "bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 border bg-gradient-to-br backdrop-blur-sm",
        colorStyles[color]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {label}
          </p>
          <h3 className="text-4xl font-bold font-display tracking-tight text-white">
            {value}
          </h3>
          {trend && (
            <p className="text-xs mt-2 text-muted-foreground">{trend}</p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl shadow-lg", iconStyles[color])}>
          <Icon size={24} />
        </div>
      </div>
      
      {/* Decorative background glow */}
      <div className={cn(
        "absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none",
        color === 'gold' && "bg-amber-500",
        color === 'red' && "bg-red-500",
        color === 'blue' && "bg-blue-500",
        color === 'green' && "bg-emerald-500",
      )} />
    </motion.div>
  );
}
