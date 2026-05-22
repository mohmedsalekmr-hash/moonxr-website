"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  getProvidersAction, 
  createProviderAction, 
  updateProviderAction, 
  deleteProviderAction
} from "@/app/actions";
import { Partner } from "@/data/partners";
import { Header } from "@/components/Header";
import { CanvasBackground } from "@/components/CanvasBackground";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Globe, Trash2, Edit3, Plus, X, Search, RefreshCw, LogIn,
  Shield, Check, AlertTriangle, Eye, EyeOff
} from "lucide-react";

const sanitizeUrl = (url: string) => {
  if (!url) return "#";
  return url.startsWith("http") ? url : "https://" + url;
};

export default function AdminPage() {
  // Authentication State (Simulating admin protection)
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // CRUD States
  const [providers, setProviders] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Form Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Partner | null>(null);

  // Provider Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    domain: "",
    logoUrl: "",
    isVisible: true
  });

  // Success Toasts / Status Alerts
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Load Admin status from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const logged = sessionStorage.getItem("moonxr_admin_logged");
      if (logged === "true") {
        setIsAdmin(true);
      }
    }
  }, []);

  // Fetch Providers list from DB
  const loadProviders = async () => {
    setLoading(true);
    const data = await getProvidersAction();
    setProviders(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      loadProviders();
    }
  }, [isAdmin]);

  // Handle Admin Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "moonadmin2026" || password === "admin") {
      setIsAdmin(true);
      setAuthError("");
      sessionStorage.setItem("moonxr_admin_logged", "true");
      showToast("Access Granted. Welcome back, Mohamed!", "success");
    } else {
      setAuthError("Invalid Administrator password. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem("moonxr_admin_logged");
    showToast("Logged out successfully.", "success");
  };

  // Toast Trigger Helper
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Filtered providers list for dynamic searching
  const filteredProviders = useMemo(() => {
    return providers.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.domain.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [providers, searchQuery]);

  // Handle Open Form Modal for Creating/Editing
  const openFormModal = (partner: Partner | null = null) => {
    if (partner) {
      setEditingProvider(partner);
      setFormData({
        id: partner.id,
        name: partner.name,
        domain: partner.domain,
        logoUrl: partner.logoUrl || "",
        isVisible: partner.isVisible ?? true
      });
    } else {
      setEditingProvider(null);
      setFormData({
        id: "",
        name: "",
        domain: "",
        logoUrl: "",
        isVisible: true
      });
    }
    setIsFormOpen(true);
  };

  // Handle PNG/JPG logo file uploading & converting to base64
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Logo size must be smaller than 2MB to keep performance fast.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
        showToast("Logo image loaded successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Provider Creation or Update to database
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.domain) {
      showToast("Please fill in all core fields (Name, Website URL).", "error");
      return;
    }

    const generatedId = editingProvider 
      ? editingProvider.id 
      : formData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const payload: Partner = {
      id: generatedId,
      name: formData.name,
      domain: formData.domain,
      logoUrl: formData.logoUrl || undefined,
      isVisible: formData.isVisible,
    };

    let result;
    if (editingProvider) {
      result = await updateProviderAction(editingProvider.id, payload);
    } else {
      result = await createProviderAction(payload);
    }

    if (result.success) {
      showToast(
        editingProvider 
          ? `Successfully updated ${payload.name}!` 
          : `Successfully added ${payload.name}!`, 
        "success"
      );
      setIsFormOpen(false);
      loadProviders();
    } else {
      showToast(`Error: ${result.error}`, "error");
    }
  };

  // Delete Provider
  const handleDeleteProvider = async (id: string, name: string) => {
    if (confirm(`Are you absolutely sure you want to delete ${name}?`)) {
      const result = await deleteProviderAction(id);
      if (result.success) {
        showToast(`Successfully deleted ${name}.`, "success");
        loadProviders();
      } else {
        showToast(`Error deleting provider: ${result.error}`, "error");
      }
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col bg-[#030712] text-white overflow-hidden">
      <CanvasBackground />
      <Header />

      {/* SUCCESS/ERROR POPUP TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-24 left-1/2 z-[9999] px-6 py-3.5 rounded-2xl flex items-center gap-3 border shadow-2xl backdrop-blur-md ${
              toastType === "success" 
                ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-400" 
                : "bg-red-950/80 border-red-500/30 text-red-400"
            }`}
          >
            <Check className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-grow pt-32 pb-24 px-6 relative z-10 max-w-7xl mx-auto w-full font-sans">
        <AnimatePresence mode="wait">
          
          {/* PASSWORD LOCK SCREEN */}
          {!isAdmin ? (
            <motion.div
              key="lock"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-center items-center py-20"
            >
              <div className="w-full max-w-md p-10 bg-white/[0.02] border border-white/10 rounded-[32px] backdrop-blur-xl shadow-2xl">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-brand-dark flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(0,122,255,0.1)] mb-6">
                    <Shield className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2 font-display">Admin <span className="text-gradient">Portal</span></h1>
                  <p className="text-white/40 text-sm mb-8">Access is restricted to Mohamed Salek. Please log in with your administrative password.</p>
                  
                  <form onSubmit={handleLogin} className="w-full space-y-4">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-bold text-white/45 uppercase tracking-widest pl-2">Admin Password</label>
                      <input 
                        type="password"
                        placeholder="••••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-300"
                      />
                    </div>

                    {authError && (
                      <p className="text-red-400 text-xs flex items-center gap-1.5 pl-2 mt-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {authError}
                      </p>
                    )}

                    <button 
                      type="submit" 
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-[15px] bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 shadow-[0_8px_20px_rgba(6,182,212,0.25)] transition-all duration-300"
                    >
                      <LogIn className="w-4 h-4" />
                      Authenticate Portal
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          ) : (

            /* ADMIN DASHBOARD PANELS */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              
              {/* Header Panel */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-xl">
                <div>
                  <h1 className="text-4xl font-extrabold tracking-tight font-display">Admin <span className="text-gradient">Control</span> Panel</h1>
                  <p className="text-white/40 text-sm mt-1">Directly manage MoonXR VR providers and live partner links.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleLogout}
                    className="px-5 py-3 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Search & Actions bar */}
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input 
                    type="text"
                    placeholder="Search providers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/50 w-full transition-all"
                  />
                </div>
                
                <button 
                  onClick={() => openFormModal(null)}
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Add Provider
                </button>
              </div>

              {/* Providers Grid Table */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              ) : filteredProviders.length === 0 ? (
                <div className="p-16 text-center bg-white/[0.01] border border-white/[0.03] rounded-3xl">
                  <AlertTriangle className="w-10 h-10 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white/60">No Providers Found</h3>
                  <p className="text-white/30 text-xs mt-1">Try adding your first provider using the button above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProviders.map(partner => {
                    const initials = partner.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                    return (
                      <div 
                        key={partner.id}
                        className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-5 flex flex-col justify-between hover:border-white/20 hover:shadow-xl transition-all duration-300 group"
                      >
                        {/* Card Link pointing directly to partner website */}
                        <a 
                          href={sanitizeUrl(partner.domain)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="space-y-4 block cursor-pointer flex-grow group/card"
                          title={`Go directly to ${partner.name} website`}
                        >
                          {/* Centered logo inside a white canvas */}
                          <div className="w-full h-[120px] bg-white rounded-2xl flex items-center justify-center p-3 relative overflow-hidden transition-transform duration-300 group-hover/card:scale-[1.02] shadow-inner border border-white/10">
                            <span className="absolute font-bold text-slate-400 text-lg select-none z-0">{initials}</span>
                            <img
                              src={partner.logoUrl || `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${partner.domain}&size=128`}
                              alt={partner.name}
                              className="w-full h-full object-contain relative z-10 bg-white"
                              onError={(e) => e.currentTarget.style.opacity = '0'}
                              onLoad={(e) => e.currentTarget.style.opacity = '1'}
                            />
                          </div>

                          {/* Company Name & Visibility Badge */}
                          <div className="flex items-center justify-between gap-2 mt-2 px-1">
                            <h3 className="text-[16px] font-bold text-white group-hover/card:text-cyan-400 transition-colors truncate leading-snug">{partner.name}</h3>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex-shrink-0 ${
                              partner.isVisible !== false 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                : "bg-white/5 text-white/30 border border-white/5"
                            }`}>
                              {partner.isVisible !== false ? (
                                <>
                                  <Eye className="w-3 h-3" />
                                  Visible
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3" />
                                  Hidden
                                </>
                              )}
                            </span>
                          </div>
                        </a>

                        {/* Actions Panel */}
                        <div className="flex gap-2 mt-4 pt-3 border-t border-white/[0.04] items-center">
                          <button 
                            onClick={() => openFormModal(partner)}
                            className="flex-grow py-2 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 text-white/70 hover:text-cyan-400 border border-white/10 rounded-xl transition-all text-xs font-bold flex items-center justify-center gap-1.5"
                            title="Edit provider details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit Brand
                          </button>
                          <button 
                            onClick={() => handleDeleteProvider(partner.id, partner.name)}
                            className="p-2 bg-white/5 hover:bg-red-950/20 hover:border-red-500/20 text-white/70 hover:text-red-400 border border-white/10 rounded-xl transition-all"
                            title="Delete provider"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =========================================================================
          PROVIDER CREATE / EDIT FORM MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md" 
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-2xl bg-[#090d16] border border-white/10 rounded-[32px] shadow-2xl z-10 overflow-hidden my-8"
            >
              {/* Top Accent Strip */}
              <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400" />

              {/* Form Title bar */}
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#090d16]/80 backdrop-blur-md">
                <div>
                  <h2 className="text-2xl font-bold font-display">{editingProvider ? "Edit" : "Add New"} <span className="text-gradient">Provider</span></h2>
                  <p className="text-xs text-white/40 mt-1">Submit database updates for the global VR supplier directory.</p>
                </div>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Container */}
              <form onSubmit={handleFormSubmit} className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Core Provider Information
                  </h3>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Supplier Brand Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Uptale VR"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-cyan-400/40"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Website URL / Domain</label>
                    <input 
                      type="text"
                      placeholder="e.g. uptale.io"
                      value={formData.domain}
                      onChange={(e) => setFormData({...formData, domain: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-cyan-400/40"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Visibility Status</label>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                      <span className="text-xs text-white/50 font-medium">Show on public pages?</span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={formData.isVisible} 
                          onChange={(e) => setFormData({...formData, isVisible: e.target.checked})}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        <span className="ml-3 text-[11px] font-bold text-white/50 peer-checked:text-emerald-400">
                          {formData.isVisible ? "Visible" : "Hidden"}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Logo Upload Section */}
                  <div className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl space-y-4">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block pl-1">Company Logo (PNG / JPG / WEBP)</label>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Logo Preview */}
                      <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center border border-white/10 overflow-hidden relative shadow-inner flex-shrink-0 group">
                        {formData.logoUrl ? (
                          <>
                            <img 
                              src={formData.logoUrl} 
                              alt="Logo Preview" 
                              className="w-full h-full object-contain p-2"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData({...formData, logoUrl: ""})}
                              className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                            >
                              Remove
                            </button>
                          </>
                        ) : (
                          <div className="text-center text-slate-455 flex flex-col items-center p-2">
                            <Globe className="w-6 h-6 mb-1 text-slate-400 animate-pulse" />
                            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Auto Favicon</span>
                          </div>
                        )}
                      </div>

                      {/* Upload Options */}
                      <div className="flex-1 w-full space-y-3">
                        <div className="relative border border-dashed border-white/20 hover:border-cyan-400/50 rounded-2xl p-4 transition-colors flex flex-col items-center justify-center bg-white/[0.005] group">
                          <input 
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            onChange={handleLogoUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <Plus className="w-5 h-5 text-white/40 group-hover:text-cyan-400 transition-colors mb-1" />
                          <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">Choose PNG or JPG file</span>
                          <span className="text-[9px] text-white/35 mt-0.5">Drag & drop or click to browse (Max 2MB)</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="h-px bg-white/10 flex-1" />
                          <span className="text-[9px] uppercase text-white/30 font-bold">Or enter direct URL</span>
                          <div className="h-px bg-white/10 flex-1" />
                        </div>

                        <input 
                          type="text"
                          placeholder="Paste direct link e.g. https://website.com/logo.png"
                          value={formData.logoUrl}
                          onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-xs focus:outline-none focus:border-cyan-400/40 text-white placeholder-white/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-white/5 bg-[#090d16]/80">
                  <button 
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg transition-all"
                  >
                    {editingProvider ? "Save Database Changes" : "Create Brand New Supplier"}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
