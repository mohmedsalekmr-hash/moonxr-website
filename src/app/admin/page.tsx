"use client";

import { useState, useEffect, useMemo } from "react";
import {
  getProvidersAction,
  createProviderAction,
  updateProviderAction,
  deleteProviderAction,
} from "@/app/actions";
import { Partner } from "@/data/partners";
import { Header } from "@/components/Header";
import { CanvasBackground } from "@/components/CanvasBackground";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, Edit3, Plus, X, Search, RefreshCw, LogIn,
  Shield, Check, AlertTriangle, Eye, EyeOff, Globe, ImageIcon,
} from "lucide-react";

// ─── Helper ───────────────────────────────────────────────────────────────────
const safeUrl = (url: string) =>
  url ? (url.startsWith("http") ? url : "https://" + url) : "#";

// ─── Logo Preview Component ───────────────────────────────────────────────────
function LogoDisplay({ partner }: { partner: Partner }) {
  const [failed, setFailed] = useState(false);
  const initials = partner.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const src = partner.logo_url ||
    `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${safeUrl(partner.url)}&size=128`;

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-xl select-none">
        {initials}
      </div>
    );
  }
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <span className="absolute font-bold text-slate-300 text-xl select-none z-0">{initials}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={partner.name}
        className="w-full h-full object-contain p-2 relative z-10"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {

  // Auth
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Data
  const [providers, setProviders] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", url: "", logo_url: "", is_visible: true });

  // Toast
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // ── Session restore ──
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("moonxr_admin") === "true") {
      setTimeout(() => setIsAdmin(true), 0);
    }
  }, []);

  // ── Load providers ──
  const load = async () => {
    setLoading(true);
    const data = await getProvidersAction();
    setProviders(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      setTimeout(() => {
        load();
      }, 0);
    }
  }, [isAdmin]);

  // ── Auth ──
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "moonadmin2026") {
      setIsAdmin(true);
      sessionStorage.setItem("moonxr_admin", "true");
      showToast("Welcome back, Mohamed!", "success");
    } else {
      setAuthError("Invalid password. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem("moonxr_admin");
  };

  // ── Toast ──
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(""), 4000);
  };

  // ── Filtered list ──
  const filtered = useMemo(() =>
    providers.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.url.toLowerCase().includes(searchQuery.toLowerCase())
    ), [providers, searchQuery]);

  // ── Open form ──
  const openForm = (partner: Partner | null = null) => {
    if (partner) {
      setEditingId(partner.id);
      setForm({ name: partner.name, url: partner.url, logo_url: partner.logo_url ?? "", is_visible: partner.is_visible ?? true });
    } else {
      setEditingId(null);
      setForm({ name: "", url: "", logo_url: "", is_visible: true });
    }
    setIsFormOpen(true);
  };

  // ── Logo file upload → base64 ──
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast("Logo must be under 2MB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, logo_url: reader.result as string }));
      showToast("Logo loaded!", "success");
    };
    reader.readAsDataURL(file);
  };

  // ── Submit form ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.url.trim()) {
      showToast("Name and Website URL are required.", "error");
      return;
    }

    const payload = {
      name: form.name.trim(),
      url: form.url.trim(),
      logo_url: form.logo_url || undefined,
      is_visible: form.is_visible,
    };

    const result = editingId
      ? await updateProviderAction(editingId, payload)
      : await createProviderAction(payload);

    if (result.success) {
      showToast(editingId ? `${payload.name} updated!` : `${payload.name} added!`);
      setIsFormOpen(false);
      load();
    } else {
      showToast(`Error: ${result.error}`, "error");
    }
  };

  // ── Delete ──
  const handleDelete = async (partner: Partner) => {
    if (!confirm(`Delete "${partner.name}"? This cannot be undone.`)) return;
    const result = await deleteProviderAction(partner.id);
    if (result.success) {
      showToast(`"${partner.name}" deleted.`);
      load();
    } else {
      showToast(`Error: ${result.error}`, "error");
    }
  };

  // ── Toggle visibility inline ──
  const handleToggleVisibility = async (partner: Partner) => {
    const result = await updateProviderAction(partner.id, { ...partner, is_visible: !partner.is_visible });
    if (result.success) {
      showToast(`${partner.name} is now ${!partner.is_visible ? "visible" : "hidden"}.`);
      load();
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <main className="relative min-h-screen flex flex-col bg-[#030712] text-white overflow-hidden">
      <CanvasBackground />
      <Header />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
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
            <Check className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-semibold">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-grow pt-32 pb-24 px-6 relative z-10 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">

          {/* ── Login Screen ── */}
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
                  <h1 className="text-3xl font-bold tracking-tight mb-2 font-display">
                    Admin <span className="text-gradient">Portal</span>
                  </h1>
                  <p className="text-white/40 text-sm mb-8">
                    Restricted to Mohamed Salek. Enter your admin password to continue.
                  </p>

                  <form onSubmit={handleLogin} className="w-full space-y-4">
                    <input
                      type="password"
                      placeholder="••••••••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                    {authError && (
                      <p className="text-red-400 text-xs flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> {authError}
                      </p>
                    )}
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 shadow-[0_8px_20px_rgba(6,182,212,0.25)] transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      Authenticate
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>

          ) : (

            /* ── Dashboard ── */
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">

              {/* Header Bar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-xl">
                <div>
                  <h1 className="text-4xl font-extrabold tracking-tight font-display">
                    Admin <span className="text-gradient">Control</span> Panel
                  </h1>
                  <p className="text-white/40 text-sm mt-1">
                    Manage your VR partners — name, website, logo, and visibility.
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-5 py-3 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Logout
                </button>
              </div>

              {/* Search + Add */}
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search by name or URL..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/50 w-full transition-all"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={load}
                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/50 hover:text-white transition-all"
                    title="Refresh"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openForm(null)}
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Provider
                  </button>
                </div>
              </div>

              {/* Provider Grid */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-16 text-center bg-white/[0.01] border border-white/[0.03] rounded-3xl">
                  <AlertTriangle className="w-10 h-10 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white/60">No Providers Found</h3>
                  <p className="text-white/30 text-xs mt-1">
                    {searchQuery ? "Try a different search." : "Add your first provider using the button above!"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filtered.map(partner => {
                    return (
                      <div
                        key={partner.id}
                        className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-5 flex flex-col gap-4 hover:border-white/20 hover:shadow-xl transition-all duration-300 group"
                      >
                        {/* Logo — clicking opens website */}
                        <a
                          href={safeUrl(partner.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                          title={`Visit ${partner.name}`}
                        >
                          <div className="w-full h-[110px] bg-white rounded-2xl flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] shadow-inner border border-white/10">
                            <LogoDisplay partner={partner} />
                          </div>
                        </a>

                        {/* Name + Visibility */}
                        <div className="flex items-center justify-between gap-2 px-1">
                          <h3 className="text-[15px] font-bold text-white truncate leading-snug">
                            {partner.name}
                          </h3>
                          {/* Inline visibility toggle */}
                          <button
                            onClick={() => handleToggleVisibility(partner)}
                            title={partner.is_visible !== false ? "Click to hide" : "Click to show"}
                            className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all border ${
                              partner.is_visible !== false
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                : "bg-white/5 text-white/30 border-white/10 hover:bg-white/10"
                            }`}
                          >
                            {partner.is_visible !== false
                              ? <><Eye className="w-3 h-3" /> Live</>
                              : <><EyeOff className="w-3 h-3" /> Hidden</>
                            }
                          </button>
                        </div>

                        {/* Website link */}
                        <a
                          href={safeUrl(partner.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-1 text-[11px] text-white/30 hover:text-cyan-400 transition-colors truncate"
                        >
                          <Globe className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{partner.url}</span>
                        </a>

                        {/* Actions */}
                        <div className="flex gap-2 pt-3 border-t border-white/[0.04]">
                          <button
                            onClick={() => openForm(partner)}
                            className="flex-grow py-2 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 text-white/70 hover:text-cyan-400 border border-white/10 rounded-xl transition-all text-xs font-bold flex items-center justify-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(partner)}
                            className="p-2 bg-white/5 hover:bg-red-950/20 hover:border-red-500/20 text-white/50 hover:text-red-400 border border-white/10 rounded-xl transition-all"
                            title="Delete"
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

      {/* ── Add / Edit Modal ── */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-lg bg-[#090d16] border border-white/10 rounded-[32px] shadow-2xl z-10 overflow-hidden"
            >
              {/* Accent strip */}
              <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400" />

              {/* Modal header */}
              <div className="flex justify-between items-center p-6 border-b border-white/5">
                <div>
                  <h2 className="text-2xl font-bold font-display">
                    {editingId ? "Edit" : "Add"} <span className="text-gradient">Provider</span>
                  </h2>
                  <p className="text-xs text-white/40 mt-0.5">
                    {editingId ? "Update the provider details below." : "Fill in the details to add a new VR partner."}
                  </p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">

                {/* Company Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Uptale VR"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-cyan-400/50 transition-all"
                    required
                  />
                </div>

                {/* Website URL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">
                    Website URL *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. https://uptale.io"
                    value={form.url}
                    onChange={e => setForm({ ...form, url: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-cyan-400/50 transition-all"
                    required
                  />
                </div>

                {/* Logo Upload */}
                <div className="space-y-3 p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    Company Logo <span className="text-white/20">(optional)</span>
                  </label>

                  <div className="flex items-center gap-5">
                    {/* Preview box */}
                    <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center overflow-hidden border border-white/10 shadow-inner flex-shrink-0 relative group">
                      {form.logo_url ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={form.logo_url} alt="Preview" className="w-full h-full object-contain p-2" />
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, logo_url: "" })}
                            className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                      )}
                    </div>

                    {/* Upload options */}
                    <div className="flex-1 space-y-2">
                      <div className="relative border border-dashed border-white/20 hover:border-cyan-400/50 rounded-xl p-3 transition-colors flex items-center gap-2 bg-white/[0.005] group cursor-pointer">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                          onChange={handleLogoUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <Plus className="w-4 h-4 text-white/40 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">Upload from laptop</p>
                          <p className="text-[9px] text-white/30">PNG, JPG, WEBP, SVG — max 2MB</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-[9px] uppercase text-white/30 font-bold">or paste URL</span>
                        <div className="h-px bg-white/10 flex-1" />
                      </div>

                      <input
                        type="text"
                        placeholder="https://company.com/logo.png"
                        value={form.logo_url}
                        onChange={e => setForm({ ...form, logo_url: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Visibility toggle */}
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white/60">Visible on public pages</p>
                    <p className="text-[10px] text-white/30">Toggle off to temporarily hide this partner</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.is_visible}
                      onChange={e => setForm({ ...form, is_visible: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                    <span className="ml-3 text-[11px] font-bold text-white/40 peer-checked:text-emerald-400">
                      {form.is_visible ? "Visible" : "Hidden"}
                    </span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg transition-all"
                  >
                    {editingId ? "Save Changes" : "Add Provider"}
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
