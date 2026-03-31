import { useState, useEffect, useMemo } from "react";
import { getListings } from "../services/listingService";

const AREAS = ["সব এলাকা", "জিন্দাবাজার", "আম্বরখানা", "শাহজালাল উপশহর", "সোবহানীঘাট", "টিলাগড়", "বন্দরবাজার", "মিরাবাজার", "কদমতলী"];
const TYPES = [
  { value: "all", label: "সব ধরন", icon: "🏢" },
  { value: "family", label: "ফ্যামিলি", icon: "🏠" },
  { value: "bachelor", label: "ব্যাচেলর", icon: "👨" },
  { value: "sublet", label: "সাবলেট", icon: "🛏️" },
  { value: "commercial", label: "কমার্শিয়াল", icon: "🏬" },
];

export default function HomeScreen({ user, onSelectListing }) {
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

  const clearFilters = () => {
    setFilters({
      search: "",
      area: "সব এলাকা",
      type: "all",
      maxRent: 25000,
      onlyAvail: false
    });
    setShowFilter(false);
  };

  const isFilterActive = filters.area !== "সব এলাকা" || filters.type !== "all" || filters.onlyAvail || filters.maxRent < 25000;

  return (
    <div className="bg-white font-bengali pb-24 min-h-screen">
      {/* Clean Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] pt-6 pb-4 px-6">
        
        {/* Search Bar - Airbnb Style */}
        <div className="flex bg-white border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-full px-4 py-2 flex-1 items-center gap-3 transition-shadow hover:shadow-md cursor-pointer">
          <span className="text-gray-800 text-lg">🔍</span>
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-[10px] font-black text-gray-800 leading-none mb-0.5">কোথায় খুঁজছেন?</span>
            <input 
              className="bg-transparent border-none outline-none text-xs text-gray-500 placeholder-gray-400 w-full p-0 h-4" 
              placeholder="এলাকার নাম লিখুন..." 
              value={filters.search} 
              onChange={e => setFilters(prev => ({...prev, search: e.target.value}))} 
            />
          </div>
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 bg-white"
          >
            <span className="text-sm">⚙️</span>
          </button>
        </div>

        {/* Categories / Types Horizontal List */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide mt-5 pb-2 -mx-2 px-2">
          {TYPES.map(t => (
            <button 
              key={t.value} 
              onClick={() => setFilters(prev => ({...prev, type: t.value}))}
              className={`flex flex-col items-center gap-2 min-w-[56px] pb-2 border-b-2 transition-colors ${
                filters.type === t.value 
                  ? "border-gray-800 text-gray-800 opacity-100" 
                  : "border-transparent text-gray-500 opacity-60 hover:opacity-100"
              }`}
            >
              <span className="text-2xl">{t.icon}</span>
              <span className="text-[10px] font-bold whitespace-nowrap">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Expandable Filter Panel */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilter ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-5">
            <div>
              <p className="text-gray-800 text-xs font-bold uppercase tracking-widest mb-3">📍 এলাকা নির্বাচন করুন</p>
              <div className="flex flex-wrap gap-2">
                {AREAS.map(a => (
                  <button 
                    key={a} 
                    onClick={() => setFilters(prev => ({...prev, area: a}))}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                      filters.area === a 
                        ? "bg-gray-800 border-gray-800 text-white shadow-md shadow-gray-200" 
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-800 text-xs font-bold uppercase tracking-widest">💰 সর্বোচ্চ ভাড়া (৳)</p>
                  <span className="text-gray-800 text-xs font-black bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                    {filters.maxRent.toLocaleString()}
                  </span>
                </div>
                <input 
                  type="range" min={1000} max={25000} step={500} 
                  value={filters.maxRent} 
                  onChange={e => setFilters(prev => ({...prev, maxRent: +e.target.value}))}
                  className="w-full accent-gray-800 h-1.5 rounded-lg appearance-none bg-gray-200 cursor-pointer" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-gray-800 text-xs font-bold uppercase tracking-widest">শুধু খালি বাসা দেখান</span>
              <button 
                onClick={() => setFilters(prev => ({...prev, onlyAvail: !prev.onlyAvail}))}
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${filters.onlyAvail ? 'bg-gray-800' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${filters.onlyAvail ? 'left-7 shadow-md' : 'left-1'}`} />
              </button>
            </div>
            
            <button 
              onClick={clearFilters}
              className="w-full mt-2 py-3 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-800 hover:bg-gray-100 transition-colors uppercase tracking-widest"
            >
              সব ফিল্টার বাতিল করুন ✕
            </button>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <main className="px-6 mt-6">
        <div className="flex flex-col gap-8">
          {loading ? (
            // Skeleton Loaders
            Array.from({length: 3}).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-square bg-gray-200 rounded-2xl mb-4"></div>
                <div className="flex justify-between items-start mb-2">
                  <div className="h-4 w-1/2 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-3 w-1/3 bg-gray-200 rounded-full mb-1"></div>
                <div className="h-4 w-24 bg-gray-200 rounded-full mt-2"></div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 grayscale opacity-40">🏚️</div>
              <h3 className="text-lg font-black text-gray-800 mb-2">কোনো বাসা পাওয়া যায়নি</h3>
              <p className="text-gray-500 text-sm font-medium">অনুগ্রহ করে ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
              {isFilterActive && (
                <button 
                  onClick={clearFilters}
                  className="mt-6 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  সবগুলো দেখুন
                </button>
              )}
            </div>
          ) : (
            filtered.map(l => (
              <div 
                key={l.id} 
                onClick={() => onSelectListing(l.id)}
                className="group cursor-pointer"
              >
                {/* Airbnb-style Card Image */}
                <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden mb-3">
                  {l.photos?.[0] ? (
                    typeof l.photos[0] === 'string' && l.photos[0].startsWith('http') ? (
                       <img src={l.photos[0]} alt={l.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 group-hover:scale-105 transition-transform duration-500 text-6xl shadow-inner">
                        🏠
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 group-hover:scale-105 transition-transform duration-500 text-6xl shadow-inner">
                      🏠
                    </div>
                  )}
                  
                  {/* Floating Like Button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); /* Add handleSave logic */ }}
                    className="absolute top-4 right-4 text-white hover:scale-110 transition-transform drop-shadow-md z-10"
                  >
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{display: 'block', fill: 'rgba(0, 0, 0, 0.5)', height: '24px', width: '24px', stroke: 'white', strokeWidth: '2', overflow: 'visible'}}><path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z"></path></svg>
                  </button>

                  <div className={`absolute top-4 left-4 px-2 py-1 rounded-md text-[10px] font-black tracking-widest uppercase shadow-md ${l.available ? "bg-white text-gray-900" : "bg-red-500 text-white"}`}>
                    {l.available ? "খালি" : "বুকড"}
                  </div>
                </div>
                
                {/* Information */}
                <div className="flex justify-between items-start pt-1">
                  <div>
                    <h3 className="text-[15px] font-bold text-gray-900 leading-snug tracking-tight">{l.area}, সিলেট</h3>
                    <p className="text-[15px] text-gray-500 leading-snug">{l.title}</p>
                    {l.rooms && <p className="text-[15px] text-gray-500 leading-snug">{l.rooms} বেডরুম</p>}
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[15px] font-bold text-gray-900 leading-snug tracking-tight">৳{l.rent?.toLocaleString()}</span>
                      <span className="text-[15px] text-gray-900 leading-snug">/ মাস</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[14px]">
                    <span className="text-gray-900">★</span>
                    <span className="text-gray-900 font-medium">নতুন</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
