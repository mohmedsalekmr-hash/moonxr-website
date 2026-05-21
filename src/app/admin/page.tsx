"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  getProvidersAction, 
  createProviderAction, 
  updateProviderAction, 
  deleteProviderAction,
  getProviderUsersAction,
  createProviderUserAction,
  deleteProviderUserAction,
  ProviderUser
} from "@/app/actions";
import { Partner } from "@/data/partners";
import { Header } from "@/components/Header";
import { CanvasBackground } from "@/components/CanvasBackground";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Globe, MapPin, Calendar, ShieldCheck, TrendingUp, 
  Trash2, Edit3, Users, Plus, X, Search, RefreshCw, LogIn,
  Shield, Check, UserPlus, Download, AlertTriangle, Languages, Mail,
  Eye, EyeOff
} from "lucide-react";

// Predefined industrial sectors match existing configurations
const SECTORS = [
  "Formation Professionnelle et Technique",
  "Santé et VR Médicale",
  "Éducation des Enfants (6-16 Ans)"
];

export default function AdminPage() {
  // Authentication State (Simulating admin protection)
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // CRUD States
  const [providers, setProviders] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSectorFilter, setActiveSectorFilter] = useState("All");

  // Form Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Partner | null>(null);
  
  // User Manager Modal States
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [selectedProviderForUsers, setSelectedProviderForUsers] = useState<Partner | null>(null);
  const [providerUsers, setProviderUsers] = useState<ProviderUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // New User Form State
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Learner");
  const [newUserStatus, setNewUserStatus] = useState("Active");

  // Provider Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    sector: SECTORS[0],
    country: "",
    flag: "",
    domain: "",
    description_en: "",
    description_fr: "",
    pricing_en: "",
    pricing_fr: "",
    opportunities_en: "",
    opportunities_fr: "",
    headquarters: "",
    foundedYear: "",
    roiMetrics_en: "",
    roiMetrics_fr: "",
    compliance: "",
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
    // Default premium credentials for Mohamed
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

  // Filtered providers list for dynamic searching & category tabs
  const filteredProviders = useMemo(() => {
    return providers.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.domain.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = activeSectorFilter === "All" || p.sector === activeSectorFilter;
      return matchesSearch && matchesSector;
    });
  }, [providers, searchQuery, activeSectorFilter]);

  // Handle Open Form Modal for Creating/Editing
  const openFormModal = (partner: Partner | null = null) => {
    if (partner) {
      // Pre-fill form values for editing
      setEditingProvider(partner);
      setFormData({
        id: partner.id,
        name: partner.name,
        sector: partner.sector,
        country: partner.country,
        flag: partner.flag,
        domain: partner.domain,
        description_en: partner.description.en,
        description_fr: partner.description.fr,
        pricing_en: partner.pricing.en,
        pricing_fr: partner.pricing.fr,
        opportunities_en: partner.opportunities.en,
        opportunities_fr: partner.opportunities.fr,
        headquarters: partner.headquarters || "",
        foundedYear: partner.foundedYear || "",
        roiMetrics_en: partner.roiMetrics?.en || "",
        roiMetrics_fr: partner.roiMetrics?.fr || "",
        compliance: partner.compliance || "",
        logoUrl: partner.logoUrl || "",
        isVisible: partner.isVisible ?? true
      });
    } else {
      // Clear form values for new creation
      setEditingProvider(null);
      setFormData({
        id: "",
        name: "",
        sector: SECTORS[0],
        country: "",
        flag: "🌐",
        domain: "",
        description_en: "",
        description_fr: "",
        pricing_en: "",
        pricing_fr: "",
        opportunities_en: "",
        opportunities_fr: "",
        headquarters: "",
        foundedYear: "",
        roiMetrics_en: "",
        roiMetrics_fr: "",
        compliance: "",
        logoUrl: "",
        isVisible: true
      });
    }
    setIsFormOpen(true);
  };

  // Submit Provider Creation or Update to database
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.name || !formData.domain) {
      showToast("Please fill in all core fields (ID, Name, Domain).", "error");
      return;
    }

    const payload: Partner = {
      id: formData.id.toLowerCase().replace(/\s+/g, "-"),
      name: formData.name,
      sector: formData.sector,
      country: formData.country,
      flag: formData.flag,
      domain: formData.domain,
      description: {
        en: formData.description_en,
        fr: formData.description_fr
      },
      pricing: {
        en: formData.pricing_en,
        fr: formData.pricing_fr
      },
      opportunities: {
        en: formData.opportunities_en,
        fr: formData.opportunities_fr
      },
      headquarters: formData.headquarters || undefined,
      foundedYear: formData.foundedYear || undefined,
      roiMetrics: (formData.roiMetrics_en || formData.roiMetrics_fr) ? {
        en: formData.roiMetrics_en,
        fr: formData.roiMetrics_fr
      } : undefined,
      compliance: formData.compliance || undefined,
      logoUrl: formData.logoUrl || undefined,
      isVisible: formData.isVisible
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
          ? `Successfully updated provider ${payload.name}!` 
          : `Successfully created provider ${payload.name}!`, 
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
    if (confirm(`Are you absolutely sure you want to delete ${name}? This will permanently wipe all associated users.`)) {
      const result = await deleteProviderAction(id);
      if (result.success) {
        showToast(`Successfully deleted ${name}.`, "success");
        loadProviders();
      } else {
        showToast(`Error deleting provider: ${result.error}`, "error");
      }
    }
  };

  // =========================================================================
  // PROVIDER USERS OPERATION HANDLERS
  // =========================================================================
  const openUsersModal = async (partner: Partner) => {
    setSelectedProviderForUsers(partner);
    setIsUsersModalOpen(true);
    setLoadingUsers(true);
    const users = await getProviderUsersAction(partner.id);
    setProviderUsers(users);
    setLoadingUsers(false);
    
    // Clear forms
    setNewUserName("");
    setNewUserEmail("");
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProviderForUsers) return;
    if (!newUserName || !newUserEmail) {
      showToast("Name and Email are required.", "error");
      return;
    }

    const newUser = {
      provider_id: selectedProviderForUsers.id,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: newUserStatus
    };

    const res = await createProviderUserAction(newUser);
    if (res.success) {
      showToast(`Added user ${newUserName} successfully!`, "success");
      setNewUserName("");
      setNewUserEmail("");
      
      // Reload lists
      const users = await getProviderUsersAction(selectedProviderForUsers.id);
      setProviderUsers(users);
    } else {
      showToast(`Error adding user: ${res.error}`, "error");
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!selectedProviderForUsers) return;
    if (confirm(`Are you sure you want to remove user "${name}"?`)) {
      const res = await deleteProviderUserAction(userId);
      if (res.success) {
        showToast(`Successfully deleted user ${name}.`, "success");
        const users = await getProviderUsersAction(selectedProviderForUsers.id);
        setProviderUsers(users);
      } else {
        showToast(`Error: ${res.error}`, "error");
      }
    }
  };

  // Download Current JSON configuration backup helper
  const handleExportData = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(providers, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", "moonxr-providers-backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Exported backup file successfully!", "success");
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

      <div className="flex-grow pt-32 pb-24 px-6 relative z-10 max-w-7xl mx-auto w-full">
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
                  <div className="w-16 h-16 rounded-2xl bg-moon-blue-dark/50 flex items-center justify-center border border-moon-blue-light/30 shadow-[0_0_30px_rgba(0,122,255,0.2)] mb-6">
                    <Shield className="w-8 h-8 text-moon-blue-light" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2">Admin <span className="text-gradient">Portal</span></h1>
                  <p className="text-white/40 text-sm mb-8">Access is restricted to Mohamed Salek. Please log in with your administrative password.</p>
                  
                  <form onSubmit={handleLogin} className="w-full space-y-4">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-bold text-white/45 uppercase tracking-widest pl-2">Admin Password</label>
                      <input 
                        type="password"
                        placeholder="••••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-moon-blue-light/50 focus:ring-1 focus:ring-moon-blue-light/30 transition-all duration-300"
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
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-[15px] bg-moon-blue-light hover:brightness-110 shadow-[0_8px_20px_rgba(0,122,255,0.25)] transition-all duration-300"
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
                  <h1 className="text-4xl font-extrabold tracking-tight">Admin <span className="text-gradient">Control</span> Panel</h1>
                  <p className="text-white/40 text-sm mt-1">Directly manage MoonXR VR providers, authorized users, and deployment packages.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleExportData}
                    className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
                    title="Export backup file"
                  >
                    <Download className="w-4 h-4" />
                    Backup
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="px-5 py-3 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Statistics Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Total VR Providers", count: providers.length, icon: <Building2 className="w-5 h-5" />, color: "text-moon-blue-light" },
                  { label: "Active Countries", count: new Set(providers.map(p => p.country)).size, icon: <Globe className="w-5 h-5" />, color: "text-emerald-400" },
                  { label: "Specialty Sectors", count: new Set(providers.map(p => p.sector)).size, icon: <ShieldCheck className="w-5 h-5" />, color: "text-moon-yellow" },
                  { label: "Simulated Trainees", count: 48, icon: <Users className="w-5 h-5" />, color: "text-purple-400" }
                ].map((stat, i) => (
                  <div key={i} className="p-6 bg-white/[0.02] border border-white/[0.04] rounded-3xl shadow-lg flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-black text-white">{stat.count}</span>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1.5">{stat.label}</p>
                    </div>
                    <div className={`p-3 bg-white/5 rounded-2xl border border-white/10 ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                ))}
              </div>

              {/* Filters & CRUD Actions bar */}
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                
                {/* Searching & Filter categories */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Category filters */}
                  {["All", ...SECTORS].map(sec => {
                    const isActive = activeSectorFilter === sec;
                    return (
                      <button 
                        key={sec} 
                        onClick={() => setActiveSectorFilter(sec)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all border ${
                          isActive 
                            ? "bg-white/10 border-white/20 text-white shadow-md" 
                            : "bg-transparent border-white/5 text-white/40 hover:text-white/80"
                        }`}
                      >
                        {sec === "All" ? "All Categories" : sec.replace("Formation ", "").replace("Santé ", "")}
                      </button>
                    );
                  })}
                </div>

                {/* Adding button & Search */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input 
                      type="text"
                      placeholder="Search providers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-moon-blue-light/50 w-full md:w-56 transition-all"
                    />
                  </div>
                  
                  <button 
                    onClick={() => openFormModal(null)}
                    className="px-5 py-2.5 bg-moon-blue-light hover:brightness-110 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    Add Provider
                  </button>
                </div>
              </div>

              {/* Providers Grid Table */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <RefreshCw className="w-8 h-8 text-moon-blue-light animate-spin" />
                </div>
              ) : filteredProviders.length === 0 ? (
                <div className="p-16 text-center bg-white/[0.01] border border-white/[0.03] rounded-3xl">
                  <AlertTriangle className="w-10 h-10 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white/60">No Providers Found</h3>
                  <p className="text-white/30 text-xs mt-1">Try broadening your search criteria or create a new provider!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProviders.map(partner => {
                    const initials = partner.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                    return (
                      <div 
                        key={partner.id}
                        className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 flex flex-col justify-between hover:border-white/20 hover:shadow-xl transition-all duration-300 group"
                      >
                        <div className="space-y-4">
                          {/* Top Row: Logo & Info */}
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-inner border border-white/20">
                              <span className="absolute font-bold text-slate-400 text-[15px] select-none z-0">{initials}</span>
                              <img
                                src={partner.logoUrl || `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${partner.domain}&size=128`}
                                alt={partner.name}
                                className="w-full h-full p-1.5 object-contain relative z-10 bg-white"
                                onError={(e) => e.currentTarget.style.opacity = '0'}
                                onLoad={(e) => e.currentTarget.style.opacity = '1'}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1.5">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <h3 className="text-[16px] font-bold text-white truncate leading-snug">{partner.name}</h3>
                                  <span className="text-[15px] flex-shrink-0">{partner.flag}</span>
                                </div>
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
                              <p className="text-white/40 text-xs flex items-center gap-1 mt-1">
                                <Globe className="w-3.5 h-3.5" />
                                {partner.domain}
                              </p>
                            </div>
                          </div>

                          <div className="h-px bg-white/[0.04] w-full" />

                          {/* Sector & HQ details */}
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center text-white/50">
                              <span className="font-semibold">Sector:</span>
                              <span className="text-white/80 font-medium truncate max-w-[180px]">{partner.sector.replace("Formation ", "").replace("Santé ", "")}</span>
                            </div>
                            <div className="flex justify-between items-center text-white/50">
                              <span className="font-semibold">Country/HQ:</span>
                              <span className="text-white/80 font-medium">{partner.headquarters || partner.country}</span>
                            </div>
                            <div className="flex justify-between items-center text-white/50">
                              <span className="font-semibold">Compliance:</span>
                              <span className="text-white/80 font-medium">{partner.compliance || "—"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions Panel */}
                        <div className="flex justify-between gap-2.5 mt-6 pt-4 border-t border-white/[0.04]">
                          <button 
                            onClick={() => openUsersModal(partner)}
                            className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white/70 hover:text-white flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Users className="w-3.5 h-3.5" />
                            Users
                          </button>
                          <button 
                            onClick={() => openFormModal(partner)}
                            className="p-2 py-2 bg-white/5 hover:bg-moon-blue/15 hover:border-moon-blue/30 text-white/70 hover:text-moon-blue-light border border-transparent rounded-xl transition-all"
                            title="Edit provider details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProvider(partner.id, partner.name)}
                            className="p-2 py-2 bg-white/5 hover:bg-red-950/20 hover:border-red-500/20 text-white/70 hover:text-red-400 border border-transparent rounded-xl transition-all"
                            title="Delete provider"
                          >
                            <Trash2 className="w-4 h-4" />
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
              className="relative w-full max-w-4xl bg-[#090d16] border border-white/10 rounded-[32px] shadow-2xl z-10 overflow-hidden my-8"
            >
              {/* Top Accent Strip */}
              <div className="h-1.5 w-full bg-gradient-to-r from-moon-blue-light via-purple-500 to-moon-yellow" />

              {/* Form Title bar */}
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#090d16]/80 backdrop-blur-md">
                <div>
                  <h2 className="text-2xl font-bold">{editingProvider ? "Edit" : "Add New"} <span className="text-gradient">Provider</span></h2>
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
                
                {/* Sector 1: Core credentials */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-moon-blue-light uppercase tracking-widest flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    1. Core Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Unique Slug ID (Lowercase, no spaces)</label>
                      <input 
                        type="text"
                        placeholder="e.g. mimbus"
                        disabled={!!editingProvider}
                        value={formData.id}
                        onChange={(e) => setFormData({...formData, id: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/5 disabled:opacity-40 rounded-xl text-sm focus:outline-none focus:border-moon-blue-light/40"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Supplier Brand Name</label>
                      <input 
                        type="text"
                        placeholder="e.g. Mimbus"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-moon-blue-light/40"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Industry Sector Specialty</label>
                      <select 
                        value={formData.sector}
                        onChange={(e) => setFormData({...formData, sector: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-moon-blue-light/40 text-white [&>option]:bg-[#090d16]"
                      >
                        {SECTORS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Website Domain URL</label>
                      <input 
                        type="text"
                        placeholder="e.g. mimbus.com"
                        value={formData.domain}
                        onChange={(e) => setFormData({...formData, domain: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-moon-blue-light/40"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Country Location</label>
                      <input 
                        type="text"
                        placeholder="e.g. France"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-moon-blue-light/40"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Country Flag Emoji</label>
                      <input 
                        type="text"
                        placeholder="e.g. 🇫🇷"
                        value={formData.flag}
                        onChange={(e) => setFormData({...formData, flag: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-moon-blue-light/40 text-center"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Custom Logo URL (Optional)</label>
                      <input 
                        type="text"
                        placeholder="Leave blank for auto favicon"
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-xs focus:outline-none focus:border-moon-blue-light/40"
                      />
                    </div>
                    <div className="space-y-1 flex flex-col justify-center">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Visibility Status</span>
                      <label className="relative inline-flex items-center cursor-pointer mt-2 pl-1 select-none">
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
                </div>

                <div className="h-px bg-white/[0.04] w-full" />

                {/* Section 2: Administrative details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-moon-yellow uppercase tracking-widest flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    2. Corporate & Administrative Specifications
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Headquarters City</label>
                      <input 
                        type="text"
                        placeholder="e.g. Paris, France"
                        value={formData.headquarters}
                        onChange={(e) => setFormData({...formData, headquarters: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-moon-blue-light/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Founded Year</label>
                      <input 
                        type="text"
                        placeholder="e.g. 2011"
                        value={formData.foundedYear}
                        onChange={(e) => setFormData({...formData, foundedYear: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-moon-blue-light/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Compliance Standard</label>
                      <input 
                        type="text"
                        placeholder="e.g. Native/Offline, CE Class I"
                        value={formData.compliance}
                        onChange={(e) => setFormData({...formData, compliance: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-moon-blue-light/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Core ROI Highlight (EN)</label>
                      <input 
                        type="text"
                        placeholder="e.g. High Reseller Margins"
                        value={formData.roiMetrics_en}
                        onChange={(e) => setFormData({...formData, roiMetrics_en: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-moon-blue-light/40"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/[0.04] w-full" />

                {/* Section 3: Dual-Language descriptions */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    3. Localization Content (Dual Language)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* EN DESCRIPTION */}
                    <div className="space-y-1.5 p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide flex items-center gap-1.5">🇬🇧 English Localization</span>
                      
                      <div className="space-y-3 mt-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-semibold text-white/35 uppercase">Overview Description</label>
                          <textarea 
                            rows={2}
                            value={formData.description_en}
                            onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                            className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs focus:outline-none"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-semibold text-white/35 uppercase">Pricing Details</label>
                          <textarea 
                            rows={1.5}
                            value={formData.pricing_en}
                            onChange={(e) => setFormData({...formData, pricing_en: e.target.value})}
                            className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs focus:outline-none"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-semibold text-white/35 uppercase">Strategic Opportunities</label>
                          <textarea 
                            rows={1.5}
                            value={formData.opportunities_en}
                            onChange={(e) => setFormData({...formData, opportunities_en: e.target.value})}
                            className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* FR DESCRIPTION */}
                    <div className="space-y-1.5 p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide flex items-center gap-1.5">🇫🇷 French Localization</span>
                      
                      <div className="space-y-3 mt-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-semibold text-white/35 uppercase">Overview Description</label>
                          <textarea 
                            rows={2}
                            value={formData.description_fr}
                            onChange={(e) => setFormData({...formData, description_fr: e.target.value})}
                            className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs focus:outline-none"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-semibold text-white/35 uppercase">Pricing Details</label>
                          <textarea 
                            rows={1.5}
                            value={formData.pricing_fr}
                            onChange={(e) => setFormData({...formData, pricing_fr: e.target.value})}
                            className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs focus:outline-none"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-semibold text-white/35 uppercase">Strategic Opportunities</label>
                          <textarea 
                            rows={1.5}
                            value={formData.opportunities_fr}
                            onChange={(e) => setFormData({...formData, opportunities_fr: e.target.value})}
                            className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs focus:outline-none"
                            required
                          />
                        </div>
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
                    className="px-8 py-3.5 bg-moon-blue-light hover:brightness-110 text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg transition-all"
                  >
                    {editingProvider ? "Save Database Changes" : "Create Brand New Supplier"}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          PROVIDER CLIENT/USER MANAGEMENT MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isUsersModalOpen && selectedProviderForUsers && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsUsersModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md" 
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-3xl bg-[#090d16] border border-white/10 rounded-[32px] shadow-2xl z-10 overflow-hidden"
            >
              {/* Form Title bar */}
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#090d16]/80">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-moon-blue-light" />
                    Manage Users for <span className="text-gradient">{selectedProviderForUsers.name}</span>
                  </h2>
                  <p className="text-xs text-white/40 mt-1">Control active licenses and organizational administrators for this VR developer.</p>
                </div>
                <button 
                  onClick={() => setIsUsersModalOpen(false)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                
                {/* 1. Add User Form */}
                <form onSubmit={handleAddUser} className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-1.5">
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                    Authorize New Trainee / User
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-white/40 uppercase">Full Name</label>
                      <input 
                        type="text"
                        placeholder="e.g. Ahmed Salem"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/5 rounded-xl text-xs focus:outline-none focus:border-moon-blue-light/40"
                        required
                      />
                    </div>
                    <div className="space-y-1 col-span-1 sm:col-span-2">
                      <label className="text-[9px] font-bold text-white/40 uppercase">Email Address</label>
                      <input 
                        type="email"
                        placeholder="e.g. salem@company.mr"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/5 rounded-xl text-xs focus:outline-none focus:border-moon-blue-light/40"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-white/40 uppercase">User Role</label>
                      <select 
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/5 rounded-xl text-xs focus:outline-none focus:border-moon-blue-light/40 [&>option]:bg-[#090d16]"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Trainer">Trainer</option>
                        <option value="Learner">Learner</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit"
                      className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add User License
                    </button>
                  </div>
                </form>

                {/* 2. Users Table List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Active User Directory</h3>
                  
                  {loadingUsers ? (
                    <div className="flex justify-center items-center py-10">
                      <RefreshCw className="w-6 h-6 text-moon-blue-light animate-spin" />
                    </div>
                  ) : providerUsers.length === 0 ? (
                    <div className="p-8 text-center bg-white/[0.005] border border-white/5 rounded-2xl text-xs text-white/30">
                      No registered users associated with this provider. Try adding one above!
                    </div>
                  ) : (
                    <div className="max-h-[250px] overflow-y-auto custom-scrollbar border border-white/5 rounded-2xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-white/5 text-white/50 border-b border-white/10 uppercase text-[9px] font-bold tracking-wider">
                            <th className="p-4">Name / Contact</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {providerUsers.map(u => (
                            <tr key={u.id} className="hover:bg-white/[0.01] transition-colors">
                              <td className="p-4">
                                <div className="font-semibold text-white">{u.name}</div>
                                <div className="text-[10px] text-white/30 flex items-center gap-1 mt-0.5">
                                  <Mail className="w-3 h-3" />
                                  {u.email}
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  u.role === "Admin" ? "bg-red-500/10 text-red-400" :
                                  u.role === "Trainer" ? "bg-moon-blue/20 text-moon-blue-light" :
                                  "bg-purple-500/10 text-purple-400"
                                }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                                  u.status === "Active" ? "text-emerald-400" : "text-white/40"
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-emerald-400 animate-pulse" : "bg-white/25"}`} />
                                  {u.status}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <button 
                                  onClick={() => handleDeleteUser(u.id, u.name)}
                                  className="p-2 text-white/40 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-lg transition-all"
                                  title="Revoke user authorization"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button 
                    onClick={() => setIsUsersModalOpen(false)}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wide transition-all"
                  >
                    Close Manager
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
