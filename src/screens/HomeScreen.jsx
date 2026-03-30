import { useState, useEffect, useMemo } from "react";
import { getListings } from "../services/listingService";
import { logoutUser } from "../services/authService";

const AREAS = ["সব এলাকা", "জিন্দাবাজার", "আম্বরখানা", "শাহজালাল উপশহর", "সোবহানীঘাট", "টিলাগড়", "বন্দরবাজার", "মিরাবাজার", "কদমতলী"];
const TYPES = [
  { value: "all", label: "সব ধরন" },
  { value: "family", label: "🏠 ফ্যামিলি" },
  { value: "bachelor", label: "👨 ব্যাচেলর" },
  { value: "sublet", label: "🛏️ সাবলেট" },
  { value: "commercial", label: "🏬 কমার্শিয়াল" },
];

export default function HomeScreen({ user, onSelectListing, onAddListing }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  
  // Unified Filters State
  const [filters, setFilters] = useState({
    search: "",
    area: "সব এলাকা",
    type: "all",
    maxRent: 25000,
    onlyAvail: false
  });

  useEffect(() => {
    getListings()
      .then(data => { setListings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Efficient Memoized Filtering
  const filtered = useMemo(() => {
    return listings.filter(l => {
      const s = filters.search.toLowerCase();
      const matchesSearch = !s || 
                            l.title?.toLowerCase().includes(s) || 
                            l.area?.toLowerCase().includes(s) ||
                            l.description?.toLowerCase().includes(s);
      
      const matchesArea = filters.area === "সব এলাকা" || l.area === filters.area;
      const matchesType = filters.type === "all" || l.type === filters.type;
      const matchesRent = (l.rent || 0) <= filters.maxRent;
      const matchesAvail = !filters.onlyAvail || l.available;

      return matchesSearch && matchesArea && matchesType && matchesRent && matchesAvail;
    });
  }, [listings, filters]);

  const firstName = user?.displayName?.split(" ")[0] || "আপনাকে";

  const clearFilters = () => {
    setFilters({
      search: "",
      area: "সব এলাকা",
      type: "all",
      maxRent: 25000,
      onlyAvail: false
    });
  };

  const isFilterActive = filters.area !== "সব এলাকা" || filters.type !== "all" || filters.onlyAvail || filters.maxRent < 25000;

  return (
    <div className="min-h-screen bg-gray-50 font-bengali pb-24">
      {/* Header Section */}
      <header className="bg-gradient-to-br from-primary-dark to-primary px-6 pt-8 pb-10 rounded-b-[40px] shadow-lg sticky top-0 z-30">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">স্বাগতম, {firstName}! 👋</p>
            <h1 className="text-white text-2xl font-black">বাসা খুঁজুন</h1>
          </div>
          <button 
            onClick={logoutUser}
            className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-black text-lg hover:bg-white/20"
          >
            {(user?.displayName?.[0] || user?.email?.[0] || "?").toUpperCase()}
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1 bg-white rounded-2xl shadow-inner flex items-center px-4 py-1.5 focus-within:ring-2 ring-accent/50 transition-all">
            <span className="text-gray-400 mr-2 text-lg">🔍</span>
            <input 
              className="flex-1 bg-transparent border-none outline-none py-2 text-sm font-medium text-gray-700" 
              placeholder="এলাকা বা বাসার নাম..." 
              value={filters.search} 
              onChange={e => setFilters(prev => ({...prev, search: e.target.value}))} 
            />
            {filters.search && (
              <button 
                onClick={() => setFilters(prev => ({...prev, search: ""}))}
                className="text-gray-300 hover:text-gray-500 text-lg ml-2"
              >
                ✕
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${
              showFilter ? "bg-accent shadow-lg scale-105" : "bg-white/15 backdrop-blur-md border border-white/20"
            }`}
          >
            <span className={`text-xl transition-transform duration-300 ${showFilter ? 'rotate-180' : ''}`}>
              {showFilter ? '✕' : '⚙️'}
            </span>
          </button>
        </div>

        {/* Expandable Filter Panel */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFilter ? 'max-h-[500px] mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-5 border border-white/10 space-y-5">
            <div>
              <p className="text-white/90 text-xs font-bold uppercase tracking-widest mb-3 ml-1">📍 এলাকা</p>
              <div className="flex flex-wrap gap-2">
                {AREAS.map(a => (
                  <button 
                    key={a} 
                    onClick={() => setFilters(prev => ({...prev, area: a}))}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      filters.area === a 
                        ? "bg-accent text-white shadow-md shadow-accent/20" 
                        : "bg-white/10 text-white/80 border border-white/10 hover:bg-white/20"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/90 text-xs font-bold uppercase tracking-widest mb-3 ml-1">🏠 ধরন</p>
                <select 
                  className="w-full bg-white/15 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none appearance-none cursor-pointer"
                  value={filters.type}
                  onChange={e => setFilters(prev => ({...prev, type: e.target.value}))}
                >
                  {TYPES.map(t => <option key={t.value} value={t.value} className="text-gray-800 font-bold">{t.label}</option>)}
                </select>
              </div>
              <div>
                <p className="text-white/90 text-xs font-bold uppercase tracking-widest mb-3 ml-1">💰 ভাড়া (৳)</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" min={1000} max={25000} step={500} 
                    value={filters.maxRent} 
                    onChange={e => setFilters(prev => ({...prev, maxRent: +e.target.value}))}
                    className="flex-1 accent-accent h-1.5 rounded-lg appearance-none bg-white/20 cursor-pointer" 
                  />
                  <span className="text-white text-[10px] font-black w-14 text-right bg-white/10 px-2 py-1 rounded-md">
                    {filters.maxRent.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-white/90 text-xs font-bold">শুধু খালি বাসা</span>
              <button 
                onClick={() => setFilters(prev => ({...prev, onlyAvail: !prev.onlyAvail}))}
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${filters.onlyAvail ? 'bg-accent' : 'bg-white/20'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${filters.onlyAvail ? 'left-7 shadow-md' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <main className="px-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500 text-sm font-bold">
            <span className="text-primary font-black text-lg">{filtered.length}টি</span> বাসা পাওয়া গেছে
          </p>
          {isFilterActive && (
            <button 
              onClick={clearFilters}
              className="text-[11px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors"
            >
              ✕ তথ্য মুছুন
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 w-32 bg-gray-200 rounded-full mb-2"></div>
            <div className="h-3 w-48 bg-gray-100 rounded-full"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 px-10">
            <div className="text-7xl mb-6 grayscale opacity-40">🏚️</div>
            <h3 className="text-xl font-black text-gray-800 mb-2">কোনো বাসা পাওয়া যায়নি</h3>
            <p className="text-gray-400 text-sm font-medium">অনুগ্রহ করে ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
            <button 
              onClick={clearFilters}
              className="mt-6 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              সবগুলো দেখুন
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filtered.map(l => (
              <div 
                key={l.id} 
                onClick={() => onSelectListing(l.id)}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 group"
              >
                <div className="flex">
                  {/* Card Image Placeholder */}
                  <div className="w-32 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center relative flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-5xl drop-shadow-sm">{l.photos?.[0] ? "🏠" : "🏠"}</span>
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-[9px] font-black text-white ${l.available ? "bg-primary" : "bg-red-500"}`}>
                      {l.available ? "খালি" : "ভরা"}
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-5 flex-1 relative">
                    <h3 className="text-base font-black text-gray-800 line-clamp-1 mb-1 pr-4">{l.title}</h3>
                    <p className="text-gray-400 text-[11px] font-bold flex items-center gap-1 mb-3 uppercase tracking-tighter">
                      <span className="text-accent text-sm">📍</span> {l.area}{l.floor ? ` • ${l.floor} তলা` : ""}
                    </p>
                    
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-2xl font-black text-primary tracking-tight">৳{l.rent?.toLocaleString()}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">/মাস</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(l.features || []).slice(0, 2).map(f => (
                        <span key={f} className="text-[10px] font-bold px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                          {f}
                        </span>
                      ))}
                      {(l.features || []).length > 2 && (
                        <span className="text-[10px] font-bold px-2.5 py-1 text-gray-300 bg-gray-50 rounded-lg">
                          +{(l.features.length - 2)}
                        </span>
                      )}
                    </div>
                    
                    {/* Arrow Indicator */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-200 group-hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={onAddListing}
        className="fixed bottom-8 right-8 flex items-center gap-3 bg-gradient-to-r from-accent to-orange-500 text-white font-black px-6 py-4 rounded-3xl shadow-xl shadow-accent/30 hover:scale-105 active:scale-95 transition-all z-40 group"
      >
        <span className="text-2xl group-hover:rotate-12 transition-transform">+</span>
        <span className="text-sm">বাসা যোগ করুন</span>
      </button>
    </div>
  );
}
