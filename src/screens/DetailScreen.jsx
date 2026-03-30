import { useState, useEffect } from "react";
import { getListing } from "../services/listingService";
import { ShareSheet } from "../components/ShareSheet";

export default function DetailScreen({ listingId, onBack }) {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("info");
  const [saved, setSaved] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    getListing(listingId)
      .then(data => { setListing(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [listingId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 animate-pulse">
      <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
      <p className="text-primary font-bold text-lg">লোড হচ্ছে...</p>
    </div>
  );

  if (!listing) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center">
      <div className="text-6xl mb-6">🏚️</div>
      <p className="text-xl font-bold text-gray-800 mb-6">দুঃখিত, বাসাটি পাওয়া যায়নি।</p>
      <button 
        onClick={onBack}
        className="px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform"
      >
        ← ফিরে যান
      </button>
    </div>
  );

  const photos = listing.photos?.length ? listing.photos : ["🏠", "🛋️", "🍳", "🛁"];
  const features = listing.features || [];
  const visFeatures = showAllFeatures ? features : features.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 font-bengali pb-32">
      {/* Gallery Section */}
      <div className="relative group">
        <div className="h-[300px] md:h-[400px] bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center overflow-hidden relative">
          {typeof photos[activePhoto] === "string" && photos[activePhoto].startsWith("http")
            ? <img src={photos[activePhoto]} alt={listing.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
            : <span className="text-9xl drop-shadow-2xl">🏠</span>}
          
          {/* Top Bar Actions */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
            <button 
              onClick={onBack}
              className="w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-primary text-xl shadow-lg active:scale-90 transition-all border border-white"
            >
              ←
            </button>
            <div className="flex gap-3">
              <button 
                onClick={() => setSaved(!saved)}
                className="w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-xl shadow-lg active:scale-90 transition-all border border-white"
              >
                {saved ? "❤️" : "🤍"}
              </button>
              <button 
                onClick={() => setShowShare(true)}
                className="w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-xl shadow-lg active:scale-90 transition-all border border-white"
              >
                ↗️
              </button>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase">
            {activePhoto + 1} / {photos.length} ফটোজ
          </div>
          <div className={`absolute bottom-6 left-6 px-4 py-1.5 rounded-full text-xs font-black text-white shadow-lg ${listing.available ? "bg-primary" : "bg-red-500"}`}>
            {listing.available ? "✅ খালি আছে" : "❌ বুকড"}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-4 p-5 bg-white border-b border-gray-100 overflow-x-auto scrollbar-hide">
          {photos.map((p, i) => (
            <button 
              key={i} 
              onClick={() => setActivePhoto(i)}
              className={`w-16 h-16 rounded-2xl flex-shrink-0 transition-all duration-300 overflow-hidden ${
                activePhoto === i 
                  ? "ring-4 ring-primary ring-offset-2 scale-95" 
                  : "grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
              }`}
            >
              {typeof p === "string" && p.startsWith("http") 
                ? <img src={p} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-green-50 flex items-center justify-center text-2xl">🏠</div>}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 space-y-8 mt-6">
        {/* Title & Price Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-6">
            <h1 className="text-2xl font-black text-gray-800 leading-tight mb-2">{listing.title}</h1>
            <p className="text-gray-400 text-sm font-bold flex items-center gap-1.5">
              <span className="text-accent">📍</span> {listing.area}{listing.floor ? ` • ${listing.floor} তলা` : ""}
            </p>
          </div>
          <div className="text-right">
            <div className="flex flex-col items-end">
              <span className="text-3xl font-black text-primary leading-none tracking-tighter">৳{listing.rent?.toLocaleString()}</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">প্রতি মাস</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          {[
            ["🛏️", `${listing.rooms || "0"} রুম`],
            ["🚿", `${listing.bathrooms || "0"} বাথ`],
            ["📐", `${listing.size || "0"} sqft`],
            ["🏠", listing.type === "family" ? "ফ্যামিলি" : listing.type || "অন্যান্য"]
          ].map(([icon, val]) => (
            <div key={val} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-2 text-center group hover:bg-primary transition-colors duration-300">
              <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
              <span className="text-[10px] font-black text-gray-700 group-hover:text-white uppercase tracking-tighter">{val}</span>
            </div>
          ))}
        </div>

        {/* Content Tabs */}
        <div className="bg-white p-1.5 rounded-2xl flex border border-gray-100 shadow-sm">
          {[["info", "📋 বিবরণ"], ["map", "🗺️ অবস্থান"]].map(([v, l]) => (
            <button 
              key={v}
              onClick={() => setTab(v)}
              className={`flex-1 py-3 text-sm font-black rounded-xl transition-all duration-300 ${
                tab === v ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Tab Content: Info */}
        <div className={`space-y-6 transition-all duration-300 ${tab === "info" ? "opacity-100 block" : "opacity-0 hidden"}`}>
          {listing.description && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-gray-800 mb-4 border-l-4 border-accent pl-4">বাসার বিবরণ</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{listing.description}</p>
            </div>
          )}

          {features.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-gray-800 mb-4 border-l-4 border-accent pl-4">সুযোগ-সুবিধা</h3>
              <div className="grid grid-cols-2 gap-3">
                {visFeatures.map(f => (
                  <div key={f} className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl group hover:bg-primary/5 transition-colors">
                    <span className="text-primary font-black text-xs">✓</span>
                    <span className="text-xs font-bold text-gray-600 group-hover:text-primary transition-colors">{f}</span>
                  </div>
                ))}
              </div>
              {features.length > 4 && (
                <button 
                  onClick={() => setShowAllFeatures(!showAllFeatures)}
                  className="mt-6 w-full text-center text-[10px] font-black text-primary uppercase tracking-widest hover:underline underline-offset-4"
                >
                  {showAllFeatures ? "↑ কম দেখুন" : `↓ আরও ${features.length - 4}টি সুবিধা দেখুন`}
                </button>
              )}
            </div>
          )}

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-800 mb-4 border-l-4 border-accent pl-4">সঠিক ঠিকানা</h3>
            <p className="text-gray-600 text-sm font-medium mb-6">📍 {listing.address || listing.area + ", সিলেট"}</p>
            <button 
              onClick={() => setTab("map")}
              className="w-full py-4 bg-primary/5 text-primary text-xs font-black rounded-2xl hover:bg-primary/10 transition-colors uppercase tracking-widest"
            >
              🗺️ ম্যাপে অবস্থান দেখুন
            </button>
          </div>

          {!reported ? (
            <button 
              onClick={() => setReported(true)}
              className="w-full py-4 text-center text-xs font-bold text-red-400 hover:text-red-600 transition-colors"
            >
              🚩 এই তথ্য নিয়ে অভিযোগ করুন
            </button>
          ) : (
            <p className="text-center text-xs font-black text-primary bg-primary/5 py-4 rounded-2xl animate-bounce">
              ✅ অভিযোগ গ্রহণ করা হয়েছে। ধন্যবাদ।
            </p>
          )}
        </div>

        {/* Tab Content: Map */}
        <div className={`space-y-6 transition-all duration-300 ${tab === "map" ? "opacity-100 block" : "opacity-0 hidden"}`}>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <h3 className="text-lg font-black text-gray-800 mb-2">{listing.area}, সিলেট</h3>
            <p className="text-xs font-bold text-gray-400 mb-4 tracking-tighter uppercase">{listing.address || "সঠিক ঠিকানা সংরক্ষিত"}</p>
            
            <div className="h-[250px] w-full rounded-2xl overflow-hidden shadow-inner mb-6 ring-1 ring-black/5">
              <iframe
                title="Google Maps"
                width="100%"
                height="100%"
                className="grayscale-[20%] contrast-[110%]"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${listing.lat || 24.8949},${listing.lng || 91.8687}&z=16&output=embed`}
              />
            </div>

            <a 
              href={`https://www.google.com/maps?q=${listing.lat || 24.8949},${listing.lng || 91.8687}`} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center gap-3 py-4 bg-primary text-white text-sm font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              📍 Google Maps-এ খুলুন
            </a>

            <div className="mt-10">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 text-center">আশেপাশের সুবিধাসমূহ</h4>
              <div className="grid grid-cols-4 gap-2">
                {[
                  ["🏥", "হাসপাতাল", "৫ মি"],
                  ["🏫", "স্কুল", "৩ মি"],
                  ["🛒", "বাজার", "২ মি"],
                  ["🕌", "মসজিদ", "১ মি"]
                ].map(([ic, lb, dt]) => (
                  <div key={lb} className="flex flex-col items-center gap-2 p-2 rounded-xl border border-gray-50 text-center">
                    <span className="text-xl">{ic}</span>
                    <p className="text-[9px] font-black text-gray-700 uppercase leading-none">{lb}</p>
                    <p className="text-[8px] font-bold text-gray-300">{dt} পথ</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Contact Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-50 pointer-events-none">
        <div className="max-w-[480px] mx-auto bg-white/80 backdrop-blur-xl rounded-[32px] p-4 shadow-2xl border border-white/40 flex items-center justify-between gap-4 pointer-events-auto ring-1 ring-black/5">
          <div className="flex items-center gap-3 pl-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-white">
              {(listing.contactName || "?")[0].toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-black text-gray-800 leading-tight">{listing.contactName || "বাসা মালিক"}</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">মালিকপক্ষ</p>
            </div>
          </div>
          <div className="flex gap-2 flex-1 sm:flex-none">
            <a 
              href={`tel:${listing.contactPhone}`} 
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white text-xs font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              📞 কল
            </a>
            <a 
              href={`https://wa.me/88${(listing.contactPhone || "").replace(/-/g, "")}`} 
              target="_blank" 
              rel="noreferrer" 
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] text-white text-xs font-black rounded-2xl shadow-lg shadow-green-500/20 hover:scale-105 transition-transform"
            >
              💬 হোয়াটঅ্যাপ
            </a>
          </div>
        </div>
      </div>

      {/* Share Sheet */}
      {showShare && <ShareSheet listing={listing} onClose={() => setShowShare(false)} />}
    </div>
  );
}
