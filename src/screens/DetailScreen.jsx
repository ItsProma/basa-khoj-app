import { useState, useEffect } from "react";
import { getListing } from "../services/listingService";
import { ShareSheet } from "../components/ShareSheet";

export default function DetailScreen({ listingId, onBack }) {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    getListing(listingId)
      .then(data => { setListing(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [listingId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 animate-pulse bg-white">
      <div className="w-16 h-16 bg-gray-100 rounded-full"></div>
      <p className="text-gray-400 font-bold text-sm">লোড হচ্ছে...</p>
    </div>
  );

  if (!listing) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center bg-white">
      <div className="text-5xl mb-6 grayscale opacity-40">🏚️</div>
      <p className="text-xl font-black text-gray-800 mb-6">দুঃখিত, বাসাটি পাওয়া যায়নি।</p>
      <button 
        onClick={onBack}
        className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl shadow-md hover:bg-gray-800 transition-colors"
      >
        ← ফিরে যান
      </button>
    </div>
  );

  const photos = listing.photos?.length ? listing.photos : [];
  const features = listing.features || [];

  return (
    <div className="bg-white min-h-screen font-bengali pb-32">
      {/* Hero Gallery Block */}
      <div className="relative w-full aspect-[4/3] md:aspect-video bg-gray-100 overflow-hidden">
        {/* Top Navbar Actions Overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/20 to-transparent">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-800 text-xl shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform"
          >
            ←
          </button>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowShare(true)}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-800 text-lg shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform"
            >
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: '2', overflow: 'visible'}}><g fill="none"><path d="M27 18v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-9"></path><path d="M16 3v23V3z"></path><path d="M6 13l9.293-9.293a1 1 0 0 1 1.414 0L26 13"></path></g></svg>
            </button>
            <button 
              onClick={() => setSaved(!saved)}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform"
            >
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{display: 'block', fill: saved ? '#e31c5f' : 'rgba(0, 0, 0, 0.5)', height: '16px', width: '16px', stroke: saved ? '#e31c5f' : 'currentcolor', strokeWidth: '2', overflow: 'visible'}}><path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z"></path></svg>
            </button>
          </div>
        </div>

        {/* Main Photo */}
        {photos.length > 0 && typeof photos[activePhoto] === 'string' && photos[activePhoto].startsWith('http') ? (
          <img src={photos[activePhoto]} alt={listing.title} className="w-full h-full object-cover transition-opacity duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl grayscale opacity-20 bg-gray-100">🏠</div>
        )}
        
        {/* Photo Indicators (if more than 1) */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex gap-2">
             {photos.map((_, i) => (
               <button 
                 key={i} 
                 onClick={() => setActivePhoto(i)}
                 className={`h-1.5 rounded-full transition-all ${activePhoto === i ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} 
               />
             ))}
          </div>
        )}
      </div>

      {/* Title & Key details */}
      <div className="px-6 py-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-1">{listing.title}</h1>
        <p className="text-[15px] text-gray-800 font-medium">{listing.area}, সিলেট {listing.floor ? `· ${listing.floor} তলা` : ""}</p>
        
        <div className="flex gap-4 mt-3 text-[14px] text-gray-900">
          <span>{listing.rooms || "0"} বেডরুম</span>
          <span>·</span>
          <span>{listing.bathrooms || "0"} বাথ</span>
          <span>·</span>
          <span>{listing.size || "0"} sqft</span>
        </div>

        <div className="flex gap-2 mt-4 items-center">
          <span className="text-[14px] font-bold text-gray-900 border border-gray-200 px-3 py-1 rounded-lg">★ নতুন লিস্টিং</span>
          <span className={`text-[12px] font-bold px-3 py-1.5 rounded-lg ${listing.available ? "bg-gray-100 text-gray-800" : "bg-red-50 text-red-600"}`}>
            {listing.available ? "এখনই খালি আছে" : "বুকড"}
          </span>
        </div>
      </div>

      {/* Host Section */}
      <div className="px-6 py-6 border-b border-gray-100 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {(listing.contactName || "?")[0].toUpperCase()}
        </div>
        <div>
          <h3 className="text-[16px] font-bold text-gray-900">মালিকপক্ষ: {listing.contactName || "অজানা"}</h3>
          <p className="text-sm text-gray-500">{listing.type === 'family' ? 'ফ্যামিলি' : 'ব্যাচেলর/অন্যান্য'} হোস্ট</p>
        </div>
      </div>

      {/* Description */}
      {listing.description && (
        <div className="px-6 py-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-3">বাসা সম্পর্কে</h3>
          <p className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
        </div>
      )}

      {/* Features/Amenities */}
      {features.length > 0 && (
        <div className="px-6 py-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">কী কী সুবিধা পাচ্ছেন</h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            {features.map(f => (
              <div key={f} className="flex items-center gap-4">
                <span className="text-2xl text-gray-700">✓</span>
                <span className="text-[15px] text-gray-800">{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map/Location Section */}
      <div className="px-6 py-6 border-b border-gray-100 pb-12">
        <h3 className="text-lg font-bold text-gray-900 mb-2">কোথায় থাকবেন</h3>
        <p className="text-[15px] text-gray-800 mb-4">{listing.address || listing.area + ", সিলেট"}</p>
        
        <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden ring-1 ring-gray-200">
          <iframe
            title="Google Maps"
            width="100%"
            height="100%"
            className="border-0 grayscale-[20%]"
            loading="lazy"
            src={`https://maps.google.com/maps?q=${listing.lat || 24.8949},${listing.lng || 91.8687}&z=16&output=embed`}
          />
        </div>
        <a 
          href={`https://www.google.com/maps?q=${listing.lat || 24.8949},${listing.lng || 91.8687}`} 
          target="_blank" 
          rel="noreferrer"
          className="inline-block mt-4 text-[15px] font-bold text-gray-900 underline"
        >
          Google Maps-এ বড় করে দেখুন
        </a>
      </div>

      {/* Persistent Bottom Contact Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 py-3 px-6 shadow-[0_-1px_15px_rgba(0,0,0,0.05)] pb-safe">
        <div className="max-w-[480px] mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-gray-900">৳{listing.rent?.toLocaleString()} <span className="text-sm font-normal">/ মাস</span></span>
            <span className="text-[13px] text-gray-500 underline cursor-pointer">বিস্তারিত দেখুন</span>
          </div>
          <div className="flex gap-2">
            <a 
              href={`https://wa.me/88${(listing.contactPhone || "").replace(/-/g, "")}`} 
              target="_blank" 
              rel="noreferrer" 
              className="px-4 py-3 bg-gray-100 text-gray-900 text-[15px] font-bold rounded-xl active:scale-95 transition-transform whitespace-nowrap"
            >
              মেসেজ
            </a>
            <a 
              href={`tel:${listing.contactPhone}`} 
              className="px-6 py-3 bg-[#e31c5f] text-white text-[15px] font-bold rounded-xl shadow-md active:scale-95 transition-transform"
            >
              কল করুন
            </a>
          </div>
        </div>
      </div>

      {showShare && <ShareSheet listing={listing} onClose={() => setShowShare(false)} />}
    </div>
  );
}
