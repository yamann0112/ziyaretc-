import { useVisitorStats, useVisitors } from "@/hooks/use-visitors";
import { StatCard } from "@/components/StatCard";
import { LogIn, LogOut, Users, Activity, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useVisitorStats();
  const { data: recentVisitors, isLoading: recentLoading } = useVisitors();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-white">
            Güvenlik Paneli
          </h1>
          <p className="text-muted-foreground mt-2">
            Canlı ziyaretçi istatistikleri ve hareket dökümü
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-green-500">Sistem Aktif</span>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <StatCard
          label="İçerdeki Ziyaretçi"
          value={stats?.currentInside || 0}
          icon={Users}
          color="gold"
          trend="Anlık Durum"
        />
        <StatCard
          label="Bugün Toplam Giriş"
          value={stats?.totalEntries || 0}
          icon={LogIn}
          color="green"
          trend="00:00'dan itibaren"
        />
        <StatCard
          label="Bugün Toplam Çıkış"
          value={stats?.totalExits || 0}
          icon={LogOut}
          color="red"
          trend="00:00'dan itibaren"
        />
      </motion.div>

      {/* Recent Activity Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Activity size={20} />
            </div>
            <h2 className="text-lg font-bold text-white">Son Hareketler</h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground bg-white/5 px-2 py-1 rounded">
            Son 10 Kayıt
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-muted-foreground font-medium uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Ziyaretçi</th>
                <th className="px-6 py-4">Firma</th>
                <th className="px-6 py-4">Plaka</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4">Zaman</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Yükleniyor...</td></tr>
              ) : recentVisitors?.slice(0, 10).map((visitor) => (
                <tr key={visitor.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white group-hover:text-primary transition-colors">
                      {visitor.name} {visitor.surname}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {visitor.company || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {visitor.plate ? (
                      <span className="font-mono bg-white/5 px-2 py-1 rounded text-xs border border-white/10">
                        {visitor.plate}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {visitor.isInside ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        İçeride
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Çıkış Yaptı
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground tabular-nums flex items-center gap-2">
                    <Clock size={14} className="text-primary/50" />
                    {visitor.entryTime && format(new Date(visitor.entryTime), "HH:mm", { locale: tr })}
                    {visitor.exitTime && (
                      <>
                        <span className="text-muted-foreground/30">→</span>
                        {format(new Date(visitor.exitTime), "HH:mm", { locale: tr })}
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {recentVisitors?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Henüz kayıt bulunmuyor
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
