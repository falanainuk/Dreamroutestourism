import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useData } from '../contexts/DataContext';
import { Settings, Plus, Trash2, Save, LogOut, Loader2, Globe, Shield, DollarSign, Image as ImageIcon, MapPin, ExternalLink, Plane, Mail, Phone, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export function Admin() {
  const { data, updateData, loading, refreshData } = useData();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [localData, setLocalData] = useState(data);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'enquiries'>('content');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/check', { credentials: 'include' })
      .then(res => res.json())
      .then(res => setIsLoggedIn(res.isAdmin));
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/admin/enquiries', { credentials: 'include' })
        .then(res => res.json())
        .then(res => setEnquiries(res));
    }
  }, [isLoggedIn]);

  const deleteEnquiry = async (id: string) => {
    const res = await fetch('/api/admin/enquiries/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
      credentials: 'include'
    });
    if (res.ok) {
      setEnquiries(enquiries.filter(e => e.id !== id));
      setStatus({ type: 'success', message: 'Enquiry removed' });
      setTimeout(() => setStatus(null), 3000);
    }
  };

  useEffect(() => {
    if (data) setLocalData(data);
  }, [data]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
      credentials: 'include'
    });
    if (res.ok) setIsLoggedIn(true);
    else alert("Invalid password");
  };

  const handleSave = async () => {
    if (!localData) return;
    const success = await updateData(localData);
    if (success) {
      setStatus({ type: 'success', message: 'All changes saved & synced to Google Drive!' });
      setTimeout(() => setStatus(null), 3000);
    } else {
      setStatus({ type: 'error', message: 'Failed to save changes.' });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'hero' | 'logo' | { type: 'destination' | 'service' | 'package', id: string }) => {
    const file = e.target.files?.[0];
    if (!file || !localData) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errData = await res.json();
          throw new Error(errData.error || 'Upload failed');
        } else {
          const text = await res.text();
          throw new Error(`Upload failed with status ${res.status}`);
        }
      }

      const result = await res.json();
      
      if (result.url) {
        if (target === 'hero') {
          setLocalData({
            ...localData,
            settings: { ...localData.settings, heroImage: result.url }
          });
        } else if (target === 'logo') {
          setLocalData({
            ...localData,
            settings: { ...localData.settings, logo: result.url }
          });
        } else if (typeof target === 'object') {
          if (target.type === 'destination') {
            const newDest = localData.destinations.map(d => 
              d.id === target.id ? { ...d, image: result.url } : d
            );
            setLocalData({ ...localData, destinations: newDest });
          } else if (target.type === 'service') {
            const newServices = localData.services.map(s => 
              s.id === target.id ? { ...s, image: result.url } : s
            );
            setLocalData({ ...localData, services: newServices });
          } else if (target.type === 'package') {
            const newPkgs = localData.packages.map(p => 
              p.id === target.id ? { ...p, image: result.url } : p
            );
            setLocalData({ ...localData, packages: newPkgs });
          }
        }
        setStatus({ type: 'success', message: 'Upload successful!' });
      } else {
        throw new Error('No URL returned from server');
      }
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: err.message || 'Upload failed.' });
    } finally {
      setUploading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-primary"><Loader2 className="animate-spin text-accent" /></div>;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10 rounded-3xl glass w-full max-w-md">
          <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center text-accent mx-auto mb-6">
            <Shield size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center text-text">Admin Access</h2>
          <p className="opacity-50 text-center text-sm mb-8 text-text">Enter your credentials to manage Dream Route.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Admin Password" 
              className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent text-text"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button className="w-full bg-accent text-primary py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-colors">
              Enter Console
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (!localData) return null;

  return (
    <div className="min-h-screen bg-primary pt-24 pb-24 text-text">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-accent mb-2">
              <Shield size={16} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Secure Session</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Management Console</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs opacity-50 uppercase tracking-widest hover:text-accent transition-colors mr-4">Preview Site</Link>
            <button 
              onClick={handleSave}
              disabled={uploading}
              className="px-8 py-4 bg-accent text-primary rounded-xl font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-black hover:text-white transition-all shadow-xl shadow-accent/20 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
              Save All Changes
            </button>
            <button 
              onClick={() => fetch('/api/admin/logout', { method: 'POST', credentials: 'include' }).then(() => setIsLoggedIn(false))}
              className="p-4 border border-white/10 rounded-xl opacity-50 hover:text-red-500 hover:bg-red-500/10 hover:opacity-100 transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('content')}
            className={cn("px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all", activeTab === 'content' ? "bg-accent text-primary" : "bg-white/5 opacity-50 hover:opacity-100")}
          >
            Site Content
          </button>
          <button 
            onClick={() => setActiveTab('enquiries')}
            className={cn("px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all relative", activeTab === 'enquiries' ? "bg-accent text-primary" : "bg-white/5 opacity-50 hover:opacity-100")}
          >
            Enquiries / CRM
            {enquiries.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white">{enquiries.length}</span>}
          </button>
        </div>

        {status && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={cn("p-4 rounded-xl mb-8 flex items-center gap-3 sticky top-24 z-50", status.type === 'success' ? "bg-green-500/10 text-green-500 border border-green-500/20 backdrop-blur-md" : "bg-red-500/10 text-red-500 border border-red-500/20 backdrop-blur-md")}>
            <Shield size={20} /> {status.message}
          </motion.div>
        )}

        {activeTab === 'content' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Settings */}
            <div className="lg:col-span-4 space-y-8">
              <section className="p-8 rounded-3xl glass border border-white/10">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-2"><Settings size={18} className="text-accent" /> Custom Branding</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 block mb-2">Agency Name</label>
                    <input 
                      className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none text-text" 
                      value={localData.settings.siteName} 
                      onChange={e => setLocalData({...localData, settings: {...localData.settings, siteName: e.target.value}})}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 block mb-2">Agency Logo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-black/20 border border-white/5 flex items-center justify-center overflow-hidden">
                        {localData.settings.logo ? (
                          <img src={localData.settings.logo} className="w-full h-full object-contain" />
                        ) : (
                          <Plane size={24} className="opacity-20" />
                        )}
                      </div>
                      <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
                        {uploading ? "Uploading..." : "Upload Logo"}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 block mb-2">Hero Background</label>
                    <div className="relative group rounded-2xl overflow-hidden aspect-video mb-4 bg-black/20 border border-white/5">
                      <img src={localData.settings.heroImage} className="w-full h-full object-cover opacity-60" />
                      <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group-hover:bg-black/40 transition-colors">
                        <ImageIcon size={24} className="mb-2 text-accent" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">Change Image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero')} />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 block mb-2">Global Currency</label>
                    <select 
                      className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none appearance-none text-text"
                      value={localData.settings.currency}
                      onChange={e => setLocalData({...localData, settings: {...localData.settings, currency: e.target.value}})}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="AED">AED (د.إ)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="PKR">PKR (Rs.)</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="p-8 rounded-3xl glass border border-white/10">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-2"><Globe size={18} className="text-accent" /> Social Links</h3>
                <div className="space-y-6">
                  {Object.entries(localData.settings.socials).map(([key, val]) => (
                    <div key={key}>
                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 block mb-2 capitalize">{key}</label>
                      <input 
                        className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 focus:border-accent outline-none text-text" 
                        value={val} 
                        onChange={e => setLocalData({...localData, settings: {...localData.settings, socials: {...localData.settings.socials, [key]: e.target.value}}})}
                      />
                    </div>
                  ))}
                </div>
              </section>

              <div className="p-6 rounded-3xl bg-accent text-primary flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Drive Storage</p>
                    <p className="font-bold">Google Cloud Sync</p>
                 </div>
                 <Shield size={24} />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-8">
              {/* Services */}
              <section className="p-8 rounded-3xl glass border border-white/10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-sm">1</span>
                    Our Services
                  </h3>
                  <button 
                    onClick={() => setLocalData({...localData, services: [...localData.services, { id: Date.now().toString(), title: "New boutique service", description: "Describe the service...", price: 0, details: "", image: "" }]})}
                    className="bg-accent/10 text-accent px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-accent hover:text-primary transition-all"
                  >
                    <Plus size={14} /> Add Service
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {localData.services.map((service, idx) => (
                    <div key={service.id} className="group p-6 bg-surface rounded-2xl border border-white/10 hover:border-accent/30 transition-all space-y-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden relative group/img bg-black/20">
                          <img src={service.image} className="w-full h-full object-cover" />
                          <label className="absolute inset-0 hidden group-hover/img:flex items-center justify-center bg-black/60 cursor-pointer">
                            <ImageIcon size={20} className="text-accent" />
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, { type: 'service', id: service.id })} />
                          </label>
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-4">
                            <input 
                              className="bg-transparent text-lg font-bold border-b border-transparent focus:border-accent outline-none flex-grow mr-2 text-text" 
                              value={service.title}
                              onChange={e => {
                                const newServices = [...localData.services];
                                newServices[idx].title = e.target.value;
                                setLocalData({...localData, services: newServices});
                              }}
                            />
                            <button 
                               onClick={() => setLocalData({...localData, services: localData.services.filter(s => s.id !== service.id)})}
                               className="text-red-500/50 hover:text-red-500 p-2 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <textarea 
                            className="w-full bg-transparent text-text opacity-60 text-xs font-light outline-none resize-none h-20 leading-relaxed"
                            placeholder="Short description..."
                            value={service.description}
                            onChange={e => {
                              const newServices = [...localData.services];
                              newServices[idx].description = e.target.value;
                              setLocalData({...localData, services: newServices});
                            }}
                          ></textarea>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 block mb-2">Expanded Details (for popup)</label>
                        <textarea 
                          className="w-full bg-surface border border-white/5 rounded-xl p-4 text-xs font-light outline-none resize-none h-32 leading-relaxed focus:border-accent/30 transition-colors"
                          placeholder="Detailed information shown in the Learn More popup..."
                          value={service.details}
                          onChange={e => {
                            const newServices = [...localData.services];
                            newServices[idx].details = e.target.value;
                            setLocalData({...localData, services: newServices});
                          }}
                        ></textarea>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                         <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Service Fee</span>
                         <div className="flex items-center gap-1 font-bold text-accent">
                           {localData.settings.currency}
                           <input 
                              type="number"
                              className="bg-transparent outline-none w-20 text-right text-accent" 
                              value={service.price}
                              onChange={e => {
                                const newServices = [...localData.services];
                                newServices[idx].price = parseInt(e.target.value);
                                setLocalData({...localData, services: newServices});
                              }}
                            />
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Destinations */}
              <section className="p-8 rounded-3xl glass border border-white/10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-sm">2</span>
                    Featured Destinations
                  </h3>
                  <button 
                    onClick={() => setLocalData({...localData, destinations: [...localData.destinations, { id: Date.now().toString(), name: "Destination Name", country: "Country", price: 0, image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8", details: "", departureType: "fixed" }]})}
                    className="bg-accent/10 text-accent px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-accent hover:text-primary transition-all"
                  >
                    <Plus size={14} /> Add Destination
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {localData.destinations.map((dest, idx) => (
                    <div key={dest.id} className="p-4 bg-surface rounded-3xl border border-white/10 flex flex-col gap-4">
                      <div className="flex gap-4 items-center">
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 group">
                          <img src={dest.image} className="w-full h-full object-cover" />
                          <label className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/60 cursor-pointer">
                            <ImageIcon size={20} className="text-accent" />
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, { type: 'destination', id: dest.id })} />
                          </label>
                        </div>
                        <div className="flex-grow space-y-2">
                           <input 
                            className="w-full bg-transparent font-bold border-b border-transparent focus:border-accent outline-none text-text" 
                            value={dest.name}
                            onChange={e => {
                              const newDests = [...localData.destinations];
                              newDests[idx].name = e.target.value;
                              setLocalData({...localData, destinations: newDests});
                            }}
                          />
                          <div className="flex justify-between items-center">
                            <input 
                              className="bg-transparent text-xs opacity-50 uppercase tracking-widest outline-none text-text" 
                              value={dest.country}
                              onChange={e => {
                                const newDests = [...localData.destinations];
                                newDests[idx].country = e.target.value;
                                setLocalData({...localData, destinations: newDests});
                              }}
                            />
                            <button onClick={() => setLocalData({...localData, destinations: localData.destinations.filter(d => d.id !== dest.id)})} className="text-red-500/50 hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <textarea 
                        className="w-full bg-surface border border-white/5 rounded-xl p-3 text-[10px] font-light outline-none resize-none h-24 leading-relaxed focus:border-accent/30 transition-colors"
                        placeholder="Details for popup..."
                        value={dest.details}
                        onChange={e => {
                          const newDests = [...localData.destinations];
                          newDests[idx].details = e.target.value;
                          setLocalData({...localData, destinations: newDests});
                        }}
                      ></textarea>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <select 
                          className="bg-surface border border-white/5 rounded-lg px-2 py-1 text-[8px] font-bold uppercase tracking-widest outline-none text-accent"
                          value={dest.departureType}
                          onChange={e => {
                            const newDests = [...localData.destinations];
                            newDests[idx].departureType = e.target.value as any;
                            setLocalData({...localData, destinations: newDests});
                          }}
                        >
                          <option value="fixed">Fixed</option>
                          <option value="flexible">Flexible</option>
                        </select>
                        <div className="flex items-center gap-1 font-bold text-accent text-sm">
                          {localData.settings.currency}
                          <input 
                            type="number"
                            className="bg-transparent outline-none w-16 text-accent text-right" 
                            value={dest.price}
                            onChange={e => {
                              const newDests = [...localData.destinations];
                              newDests[idx].price = parseInt(e.target.value);
                              setLocalData({...localData, destinations: newDests});
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tour Packages */}
              <section className="p-8 rounded-3xl glass border border-white/10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-sm">3</span>
                    Tour Packages
                  </h3>
                  <button 
                    onClick={() => setLocalData({...localData, packages: [...localData.packages, { id: Date.now().toString(), title: "New Package", location: "Location", price: 0, image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13", details: "" }]})}
                    className="bg-accent/10 text-accent px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-accent hover:text-primary transition-all"
                  >
                    <Plus size={14} /> Add Package
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {localData.packages.map((pkg, idx) => (
                    <div key={pkg.id} className="p-6 bg-surface rounded-3xl border border-white/10 flex flex-col md:flex-row gap-6">
                      <div className="relative w-full md:w-48 h-32 rounded-2xl overflow-hidden flex-shrink-0 group">
                        <img src={pkg.image} className="w-full h-full object-cover" />
                        <label className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/60 cursor-pointer">
                          <ImageIcon size={20} className="text-accent" />
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, { type: 'package', id: pkg.id })} />
                        </label>
                      </div>
                      <div className="flex-grow space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-grow mr-4">
                            <input 
                              className="w-full bg-transparent text-lg font-bold border-b border-transparent focus:border-accent outline-none text-text mb-1" 
                              value={pkg.title}
                              onChange={e => {
                                const newPkgs = [...localData.packages];
                                newPkgs[idx].title = e.target.value;
                                setLocalData({...localData, packages: newPkgs});
                              }}
                            />
                            <input 
                              className="w-full bg-transparent text-xs opacity-50 uppercase tracking-widest outline-none text-text" 
                              value={pkg.location}
                              onChange={e => {
                                const newPkgs = [...localData.packages];
                                newPkgs[idx].location = e.target.value;
                                setLocalData({...localData, packages: newPkgs});
                              }}
                            />
                          </div>
                          <button onClick={() => setLocalData({...localData, packages: localData.packages.filter(p => p.id !== pkg.id)})} className="text-red-500/50 hover:text-red-500 transition-colors p-2">
                            <Trash2 size={18} />
                          </button>
                        </div>
                        
                        <textarea 
                          className="w-full bg-surface border border-white/5 rounded-xl p-3 text-[10px] font-light outline-none resize-none h-24 leading-relaxed focus:border-accent/30 transition-colors"
                          placeholder="Detailed information for popup..."
                          value={pkg.details}
                          onChange={e => {
                            const newPkgs = [...localData.packages];
                            newPkgs[idx].details = e.target.value;
                            setLocalData({...localData, packages: newPkgs});
                          }}
                        ></textarea>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="flex items-center gap-1 font-bold text-accent text-sm">
                            {localData.settings.currency}
                            <input 
                              type="number"
                              className="bg-transparent outline-none w-20 text-accent" 
                              value={pkg.price}
                              onChange={e => {
                                const newPkgs = [...localData.packages];
                                newPkgs[idx].price = parseInt(e.target.value);
                                setLocalData({...localData, packages: newPkgs});
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {enquiries.length === 0 ? (
              <div className="p-20 border border-dashed border-white/10 rounded-3xl text-center">
                <p className="opacity-50 font-light">No enquiries found.</p>
              </div>
            ) : (
              enquiries.map((enq) => (
                <motion.div 
                  key={enq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-3xl bg-surface border border-white/10 flex flex-col md:flex-row gap-8 items-start relative group"
                >
                  <div className="flex-grow space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-accent/20 text-accent text-[8px] font-bold uppercase tracking-widest rounded-full">
                        {enq.destination || 'General Enquiry'}
                      </span>
                      <span className="text-[10px] opacity-30 uppercase font-bold tracking-widest">
                        {new Date(enq.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold">{enq.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-light opacity-70">
                      <div className="flex items-center gap-2"><Mail size={14} className="text-accent" /> {enq.email}</div>
                      <div className="flex items-center gap-2"><Phone size={14} className="text-accent" /> {enq.phone}</div>
                      {enq.dates && <div className="flex items-center gap-2"><Calendar size={14} className="text-accent" /> {enq.dates}</div>}
                    </div>
                    {enq.message && (
                      <div className="p-4 bg-black/20 rounded-xl mt-4 italic text-sm font-light opacity-80 leading-relaxed">
                        "{enq.message}"
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => deleteEnquiry(enq.id)}
                    className="p-4 rounded-xl text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
