import { useState } from "react";
import { addListing } from "../services/listingService";

const AREAS = ["জিন্দাবাজার", "আম্বরখানা", "শাহজালাল উপশহর", "সোবহানীঘাট", "টিলাগড়", "বন্দরবাজার", "মিরাবাজার", "কদমতলী", "উপশহর", "অন্যান্য"];
const FEATURES = ["গ্যাস", "লিফট", "পার্কিং", "ওয়াইফাই", "এসি", "ছাদ", "নিরাপত্তা", "জেনারেটর", "CCTV", "বাগান"];
const STEPS = ["বাসার তথ্য", "ছবি ও সুবিধা", "যোগাযোগ"];

const init = {
  title: "", area: "", address: "", floor: "", rent: "", type: "", rooms: "", bathrooms: "", size: "",
  features: [], photoFiles: [], photoPreviews: [], contactName: "", contactPhone: "", contactAlt: "",
  description: "", available: true
};

export default function AddListingScreen({ onBack, userId }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(init);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const [uploadIdx, setUploadIdx] = useState(0);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleFeature = f => setForm(p => ({
    ...p,
    features: p.features.includes(f) ? p.features.filter(x => x !== f) : [...p.features, f]
  }));

  const handlePhotos = e => {
    const files = Array.from(e.target.files);
    const previews = files.map(f => URL.createObjectURL(f));
    setForm(p => ({
      ...p,
      photoFiles: [...p.photoFiles, ...files].slice(0, 5),
      photoPreviews: [...p.photoPreviews, ...previews].slice(0, 5),
    }));
  };

  const removePhoto = i => {
    // Revoke the URL to avoid memory leaks
    if (form.photoPreviews[i].startsWith('blob:')) {
      URL.revokeObjectURL(form.photoPreviews[i]);
    }
    setForm(p => ({
      ...p,
      photoFiles: p.photoFiles.filter((_, j) => j !== i),
      photoPreviews: p.photoPreviews.filter((_, j) => j !== i),
    }));
  };

  const canNext = () => {
    if (step === 0) return form.title && form.area && form.rent && form.type && form.rooms;
    if (step === 1) return true;
    if (step === 2) return form.contactName && form.contactPhone;
  };

  const handleSubmit = async () => {
    setLoading(true); 
    setError("");
    setUploadIdx(0);
    
    try {
      await addListing({
        ...form
      }, userId, (progress) => {
        setUploadIdx(progress);
      });
      setDone(true);
    } catch (e) {
      setError("❌ সাবমিট ব্যর্থ: " + e.message);
    } finally { 
      setLoading(false); 
    }
  };

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50 font-bengali animate-fade-in">
      <div className="text-8xl mb-8 drop-shadow-lg">🎉</div>
      <h2 className="text-3xl font-black text-primary mb-4 leading-tight">বাসা সাবমিট হয়েছে!</h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-xs mx-auto font-medium">আপনার তথ্যগুলো সফলভাবে গ্রহণ করা হয়েছে। যাচাইয়ের পর ২৪ ঘণ্টার মধ্যে এটি প্রকাশিত হবে।</p>
      <div className="w-full space-y-4 max-w-[300px]">
        <button 
          onClick={() => { setDone(false); setStep(0); setForm(init); }}
          className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
        >
          + আরেকটি যোগ করুন
        </button>
        <button 
          onClick={onBack}
          className="w-full py-4 bg-white text-primary border-2 border-primary/10 font-bold rounded-2xl hover:bg-gray-100 transition-colors"
        >
          🏠 হোমপেজে ফিরে যান
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-bengali pb-32">
      {/* Header Section */}
      <header className="bg-gradient-to-br from-primary-dark to-primary px-6 pt-8 pb-10 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 blur-xl">
          <div className="w-32 h-32 bg-white rounded-full"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-between gap-4">
          <button 
            onClick={onBack}
            className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white text-xl border border-white/10 active:scale-90 transition-all"
          >
            ←
          </button>
          <div className="flex-1">
            <h1 className="text-white text-xl font-black">বাসা যোগ করুন</h1>
            <p className="text-white/60 text-xs font-medium uppercase tracking-widest mt-0.5">১০০% বিনামূল্যে লিস্টিং</p>
          </div>
          <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black border border-white/10 uppercase tracking-widest">
            ধাপ {step + 1} / 3
          </div>
        </div>

        {/* Improved Progress Bar */}
        <div className="mt-8 flex items-center px-4">
          {STEPS.map((l, i) => (
            <div key={l} className="flex flex-1 items-center">
              <div className="relative group flex flex-col items-center">
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 border-2 ${
                    i < step 
                      ? "bg-white border-white text-primary" 
                      : i === step 
                        ? "bg-accent border-accent text-white ring-4 ring-accent/20" 
                        : "bg-white/10 border-white/20 text-white/40"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`absolute -bottom-6 text-[8px] font-black uppercase tracking-tighter whitespace-nowrap transition-colors ${i === step ? "text-white" : "text-white/40"}`}>
                  {l}
                </span>
              </div>
              {i < 2 && (
                <div className="flex-1 mx-2 h-[2px] bg-white/10 overflow-hidden">
                  <div className={`h-full bg-white transition-all duration-700 ${i < step ? "w-full" : "w-0"}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </header>

      <div className="px-6 space-y-6 mt-12 pb-10">
        {/* Step 0: Basic Info */}
        {step === 0 && (
          <div className="space-y-6 animate-slide-up">
            <F label="বাসার টাইটেল *" hint="এমন কিছু লিখুন যা সহজে চোখে পড়ে">
              <input 
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:ring-2 ring-primary/20 outline-none transition-all text-sm font-medium"
                placeholder="যেমন: জিন্দাবাজারে ২ রুমের ফ্যামিলি ফ্ল্যাট" 
                value={form.title} 
                onChange={e => set("title", e.target.value)}
              />
            </F>
            
            <F label="সিলেট-এর কোন এলাকায়? *">
              <div className="flex flex-wrap gap-2">
                {AREAS.map(a => (
                  <button 
                    key={a} 
                    onClick={() => set("area", a)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      form.area === a 
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105" 
                        : "bg-white border-gray-100 text-gray-500 hover:border-primary/30"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </F>

            <F label="সঠিক ঠিকানা (পুরোটা লিখুন)">
              <input 
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:ring-2 ring-primary/20 outline-none transition-all text-sm font-medium"
                placeholder="হাউজ নং, রোড নং, মহলা..." 
                value={form.address} 
                onChange={e => set("address", e.target.value)}
              />
            </F>

            <div className="grid grid-cols-2 gap-4">
              <F label="কত তলায়">
                <input 
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:ring-2 ring-primary/20 outline-none transition-all text-sm font-medium"
                  placeholder="যেমন: ৩য়" 
                  value={form.floor} 
                  onChange={e => set("floor", e.target.value)}
                />
              </F>
              <F label="মাসিক ভাড়া (৳) *">
                <input 
                  type="number" 
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:ring-2 ring-primary/20 outline-none transition-all text-sm font-medium"
                  placeholder="৮০০০" 
                  value={form.rent} 
                  onChange={e => set("rent", e.target.value)}
                />
              </F>
            </div>

            <F label="বাসার ধরন *">
              <div className="grid grid-cols-2 gap-3">
                {[["family", "🏠 ফ্যামিলি"], ["bachelor", "👨 ব্যাচেলর"], ["sublet", "🛏️ সাবলেট"], ["commercial", "🏬 কমার্শিয়ালি"]].map(([v, l]) => (
                  <button 
                    key={v} 
                    onClick={() => set("type", v)}
                    className={`py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border ${
                      form.type === v 
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                        : "bg-white border-gray-100 text-gray-500 hover:border-primary/30"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </F>

            <div className="grid grid-cols-3 gap-3">
              <F label="বেডরুম *">
                <input 
                  type="number" 
                  className="w-full px-4 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm text-center focus:ring-2 ring-primary/20 outline-none transition-all font-bold"
                  placeholder="২" 
                  value={form.rooms} 
                  onChange={e => set("rooms", e.target.value)}
                />
              </F>
              <F label="বাথ">
                <input 
                  type="number" 
                  className="w-full px-4 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm text-center focus:ring-2 ring-primary/20 outline-none transition-all font-bold"
                  placeholder="১" 
                  value={form.bathrooms} 
                  onChange={e => set("bathrooms", e.target.value)}
                />
              </F>
              <F label="sqft">
                <input 
                  type="number" 
                  className="w-full px-4 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm text-center focus:ring-2 ring-primary/20 outline-none transition-all font-bold"
                  placeholder="৮০০" 
                  value={form.size} 
                  onChange={e => set("size", e.target.value)}
                />
              </F>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-gray-800">এখন কি খালি আছে?</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">বাসাটি কি এখনই ভাড়া দেওয়া সম্ভব?</p>
              </div>
              <button 
                onClick={() => set("available", !form.available)}
                className={`w-14 h-7 rounded-full relative transition-all duration-300 ${form.available ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 ${form.available ? 'left-8' : 'left-1'}`} />
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Photos & Features */}
        {step === 1 && (
          <div className="space-y-8 animate-slide-up">
            <F label="বাসার ছবি (সর্বোচ্চ ৫টি)" hint="ভালো ছবি দিলে ভাড়া হওয়ার চান্স ৮০% বেড়ে যায়">
              <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-primary/20 rounded-3xl p-10 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors group">
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos}/>
                <span className="text-5xl group-hover:scale-110 transition-transform">📸</span>
                <div className="text-center">
                  <span className="block text-primary font-black text-sm uppercase tracking-widest">ছবি সিলেক্ট করুন</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{form.photoPreviews.length}/5 ব্যবহৃত</span>
                </div>
              </label>
              
              {form.photoPreviews.length > 0 && (
                <div className="flex gap-3 overflow-x-auto py-4 scrollbar-hide">
                  {form.photoPreviews.map((p, i) => (
                    <div key={i} className="relative flex-shrink-0 group">
                      <img src={p} alt="" className="w-24 h-24 rounded-2xl object-cover ring-2 ring-white shadow-lg shadow-black/5" />
                      <button 
                        onClick={() => removePhoto(i)}
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center text-xs shadow-lg hover:scale-110"
                      >
                        ✕
                      </button>
                      {i === 0 && (
                        <div className="absolute bottom-2 left-2 bg-primary text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-widest">
                          কভার
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </F>

            <F label="বাসার বিশেষ সুবিধাসমূহ" hint="যা যা আছে সব সিলেক্ট করুন">
              <div className="flex flex-wrap gap-2">
                {FEATURES.map(f => (
                  <button 
                    key={f} 
                    onClick={() => toggleFeature(f)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                      form.features.includes(f) 
                        ? "bg-primary border-primary text-white shadow-md scale-105" 
                        : "bg-white border-gray-100 text-gray-500 hover:border-primary/20"
                    }`}
                  >
                    {form.features.includes(f) && "✓"} {f}
                  </button>
                ))}
              </div>
            </F>

            <F label="বিস্তারিত বিবরণ (ঐচ্ছিক)">
              <textarea 
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:ring-2 ring-primary/20 outline-none transition-all text-sm font-medium h-32 resize-none"
                placeholder="বাসা বা এলাকা সম্পর্কে আরও কিছু তথ্য দিন..." 
                value={form.description} 
                onChange={e => set("description", e.target.value)}
              />
            </F>
          </div>
        )}

        {/* Step 2: Contact Info */}
        {step === 2 && (
          <div className="space-y-8 animate-slide-up">
            <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
              <p className="text-xs font-black text-primary uppercase tracking-widest mb-4 border-b border-primary/10 pb-2">📋 সামারি একঝলকে</p>
              <div className="space-y-3">
                {[
                  ["টাইটেল", form.title],
                  ["এলাকা", form.area],
                  ["ভাড়া", `৳${form.rent} /মাস`],
                  ["বাসার ধরন", `${form.type === 'family' ? 'ফ্যামিলি' : 'অন্যান্য'}`],
                  ["রুম", `${form.rooms}টি`]
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-baseline gap-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">{k}</span>
                    <span className="text-sm font-bold text-gray-700 text-right leading-tight">{v || "—"}</span>
                  </div>
                ))}
              </div>
            </div>

            <F label="আপনার নাম *" hint="যাকে ভাড়াটিয়া ফোন দিলে পাবে">
              <input 
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:ring-2 ring-primary/20 outline-none transition-all text-sm font-bold"
                placeholder="বাসা মালিকের নাম" 
                value={form.contactName} 
                onChange={e => set("contactName", e.target.value)}
              />
            </F>

            <F label="মোবাইল নম্বর *" hint="এই নম্বরে সরাসরি ফোন কল আসবে">
              <input 
                type="tel" 
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:ring-2 ring-primary/20 outline-none transition-all text-sm font-bold tracking-[0.1em]"
                placeholder="017XX-XXXXXX" 
                value={form.contactPhone} 
                onChange={e => set("contactPhone", e.target.value)}
              />
            </F>

            <F label="বিকল্প মোবাইল নম্বর (ঐচ্ছিক)">
              <input 
                type="tel" 
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:ring-2 ring-primary/20 outline-none transition-all text-sm font-bold tracking-[0.1em]"
                placeholder="018XX-XXXXXX" 
                value={form.contactAlt} 
                onChange={e => set("contactAlt", e.target.value)}
              />
            </F>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 animate-shake">
                <p className="text-red-600 text-xs font-black text-center">{error}</p>
              </div>
            )}

            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex gap-4">
              <span className="text-2xl mt-1">📝</span>
              <p className="text-[11px] font-bold text-orange-700 leading-relaxed uppercase tracking-tighter">
                সাবমিট বাটনে ক্লিক করার মাধ্যমে আপনি আমাদের শর্তাবলীতে রাজি। ভুল তথ্য দিলে আপনার লিস্টিংটি মুছে ফেলা হতে পারে।
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 z-50 pointer-events-none">
        <div className="max-w-[480px] mx-auto flex gap-4 pointer-events-auto">
          {step > 0 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="flex-1 py-4 bg-white text-gray-500 font-black rounded-2xl shadow-xl shadow-black/5 ring-1 ring-black/5 hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
            >
              ← পিছনে
            </button>
          )}
          
          {step < 2 ? (
            <button 
              disabled={!canNext()}
              onClick={() => setStep(step + 1)}
              className={`flex-[2] py-4 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs font-black transform active:scale-95 ${
                !canNext() 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                  : "bg-primary text-white shadow-primary/30 hover:shadow-primary/40"
              }`}
            >
              পরবর্তী →
            </button>
          ) : (
            <button 
              disabled={loading || !canNext()}
              onClick={handleSubmit}
              className={`flex-[2] py-4 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs font-black transform active:scale-95 ${
                loading || !canNext()
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed animate-pulse" 
                  : "bg-gradient-to-r from-accent to-orange-500 text-white shadow-accent/30"
              }`}
            >
              {loading 
                ? (form.photoFiles.length > 0 && uploadIdx < form.photoFiles.length)
                  ? `📤 আপলোড হচ্ছে: ${uploadIdx + 1}/${form.photoFiles.length}` 
                  : "⏳ সাবমিট হচ্ছে..." 
                : "✅ বাসা সাবমিট করুন"}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

function F({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-black text-gray-700 uppercase tracking-[0.2em] ml-1">{label}</label>
      {hint && <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1">{hint}</p>}
      {children}
    </div>
  );
}
