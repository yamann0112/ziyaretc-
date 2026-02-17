import { useState } from "react";
import { useVisitors, useCreateVisitor, useVisitorExit, useDeleteVisitor, useUpdateVisitor } from "@/hooks/use-visitors";
import { SuggestionInput } from "@/components/SuggestionInput";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertVisitorSchema } from "@shared/schema";
import { z } from "zod";
import { 
  Plus, Search, LogOut, Pencil, Trash2, 
  CarFront, Briefcase, User, FileText, X, Save
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type FormValues = z.infer<typeof insertVisitorSchema>;

export default function Visitors() {
  const { data: visitors, isLoading } = useVisitors();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Mutations
  const createMutation = useCreateVisitor();
  const exitMutation = useVisitorExit();
  const deleteMutation = useDeleteVisitor();
  const updateMutation = useUpdateVisitor();

  // Form State
  const form = useForm<FormValues>({
    resolver: zodResolver(insertVisitorSchema),
    defaultValues: {
      name: "", surname: "", company: "", plate: "", notes: ""
    }
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const onSubmit = async (data: FormValues) => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...data });
        toast({ title: "Başarılı", description: "Ziyaretçi kaydı güncellendi" });
      } else {
        await createMutation.mutateAsync(data);
        toast({ title: "Başarılı", description: "Ziyaretçi girişi yapıldı" });
      }
      resetForm();
    } catch (error) {
      toast({ 
        title: "Hata", 
        description: (error as Error).message, 
        variant: "destructive" 
      });
    }
  };

  const resetForm = () => {
    form.reset({ name: "", surname: "", company: "", plate: "", notes: "" });
    setEditingId(null);
  };

  const handleEdit = (visitor: any) => {
    setEditingId(visitor.id);
    form.reset({
      name: visitor.name,
      surname: visitor.surname,
      company: visitor.company || "",
      plate: visitor.plate || "",
      notes: visitor.notes || "",
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Silindi", description: "Kayıt başarıyla silindi" });
    } catch (error) {
      toast({ title: "Hata", description: "Silme işlemi başarısız oldu", variant: "destructive" });
    }
  };

  const handleQuickExit = async (id: number) => {
    try {
      await exitMutation.mutateAsync(id);
      toast({ title: "Çıkış Yapıldı", description: "Ziyaretçi çıkışı kaydedildi" });
    } catch (error) {
      toast({ title: "Hata", description: "Çıkış işlemi başarısız", variant: "destructive" });
    }
  };

  const fillFormFromVisitor = (v: any) => {
    form.setValue("name", v.name);
    form.setValue("surname", v.surname);
    form.setValue("company", v.company || "");
    form.setValue("plate", v.plate || "");
    form.setValue("notes", v.notes || "");
  };

  const filteredVisitors = visitors?.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6 md:p-10 max-w-7xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-display text-white">
          Ziyaretçi Kaydı
        </h1>
        <p className="text-muted-foreground mt-2">
          Giriş yapan ziyaretçileri yönetin ve takip edin
        </p>
      </div>

      {/* Manual Entry Form - Now Inline */}
      <div className="glass-card rounded-2xl p-6 border border-white/5 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Plus size={20} />
          </div>
          <h2 className="text-xl font-bold text-white">
            {editingId ? "Kayıt Düzenle" : "Yeni Giriş Kaydı"}
          </h2>
          {editingId && (
            <button 
              onClick={resetForm}
              className="ml-auto text-xs text-muted-foreground hover:text-white flex items-center gap-1"
            >
              <X size={14} /> İptal Et
            </button>
          )}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SuggestionInput 
              label="Ad" 
              placeholder="Ahmet"
              icon={<User className="w-4 h-4" />}
              {...form.register("name")}
              onSelectVisitor={fillFormFromVisitor}
              value={form.watch("name")}
            />
            
            <SuggestionInput 
              label="Soyad" 
              placeholder="Yılmaz"
              icon={<User className="w-4 h-4" />}
              {...form.register("surname")}
              onSelectVisitor={fillFormFromVisitor}
              value={form.watch("surname")}
            />

            <SuggestionInput 
              label="Firma" 
              placeholder="Örn: ABC A.Ş."
              icon={<Briefcase className="w-4 h-4" />}
              {...form.register("company")}
              onSelectVisitor={fillFormFromVisitor}
              value={form.watch("company")}
            />

            <SuggestionInput 
              label="Plaka" 
              placeholder="34 ABC 123"
              icon={<CarFront className="w-4 h-4" />}
              {...form.register("plate")}
              onSelectVisitor={fillFormFromVisitor}
              value={form.watch("plate")}
            />

            <div className="lg:col-span-3 space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Açıklama</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                <input 
                  {...form.register("notes")}
                  placeholder="Ziyaret sebebi..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95"
              >
                <Save size={20} />
                {(createMutation.isPending || updateMutation.isPending) ? "Kaydediliyor..." : "KAYDET"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="border-t border-white/5 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Search className="text-primary" size={24} />
            Kayıtlı Ziyaretçiler
          </h2>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-3.5 text-muted-foreground w-4 h-4" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ara..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary outline-none text-sm"
            />
          </div>
        </div>

        {/* Visitors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
          <AnimatePresence>
            {filteredVisitors?.map((visitor) => (
              <motion.div
                key={visitor.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "group relative bg-card border rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl",
                  visitor.isInside ? "border-primary/30 shadow-primary/5" : "border-border opacity-75 grayscale-[0.5] hover:grayscale-0 hover:opacity-100"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg font-bold font-display text-primary border border-white/10">
                    {visitor.name.charAt(0)}{visitor.surname.charAt(0)}
                  </div>
                  {visitor.isInside ? (
                    <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20 animate-pulse">
                      İÇERİDE
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20">
                      ÇIKIŞ
                    </span>
                  )}
                </div>

                <div className="space-y-1 mb-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">
                    {visitor.name} {visitor.surname}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate flex items-center gap-1.5">
                    <Briefcase size={14} /> {visitor.company || "Firma Belirtilmedi"}
                  </p>
                  <p className="text-sm font-mono text-muted-foreground flex items-center gap-1.5">
                    <CarFront size={14} /> {visitor.plate || "PLAKA YOK"}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500/50" />
                      {format(new Date(visitor.entryTime), "HH:mm", { locale: tr })}
                    </div>
                    {visitor.exitTime && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="w-2 h-2 rounded-full bg-red-500/50" />
                        {format(new Date(visitor.exitTime), "HH:mm", { locale: tr })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex flex-col items-center justify-center gap-3 p-6 z-10">
                  {visitor.isInside && (
                    <button 
                      onClick={() => handleQuickExit(visitor.id)}
                      className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-900/50"
                    >
                      <LogOut size={18} /> Hızlı Çıkış
                    </button>
                  )}
                  <div className="flex gap-2 w-full">
                    <button 
                      onClick={() => handleEdit(visitor)}
                      className="flex-1 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center justify-center gap-2 transition-colors border border-white/10"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(visitor.id)}
                      className="flex-1 py-2.5 rounded-lg bg-white/10 hover:bg-red-500/20 hover:text-red-500 text-white font-semibold flex items-center justify-center gap-2 transition-colors border border-white/10"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
