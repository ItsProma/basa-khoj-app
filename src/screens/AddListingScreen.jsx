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

export default function AddListingScreen({ onBack, userId, onSuccess }) {
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
    if (step === 1) return true; // Photos & Features optional
    if (step === 2) return form.contactName && form.contactPhone;
  };

  const handleSubmit = async () => {
    setLoading(true); 
    setError("");
    setUploadIdx(0);
    
    try {
      await addListing({ ...form }, userId, (progress) => {
        setUploadIdx(progress);
      });
      setDone(true);
      if(onSuccess) {
          // You might prefer to show the success ui before navigating
          // setTimeout(onSuccess, 3000); 
      }
    } catch (e) {
      setError("❌ সাবমিট ব্যর্থ: " + e.message);
    } finally { 
      setLoading(false); 
    }
  };

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-white font-bengali">
      <div className="text-8xl mb-8 opacity-70">✨</div>
      <h2 className="text-3xl font-black text-gray-900 mb-4 leading-tight">লিস্টিং সফল হয়েছে!</h2>
      <p className="text-gray-500 text-[15px] leading-relaxed mb-10 max-w-xs mx-auto">
        আপনার বাসাটি সফলভাবে যুক্ত করা হয়েছে। 
      </p>
      <div className="w-full space-y-4 max-w-[300px]">
        <button 
          onClick={() => { setDone(false); setStep(0); setForm(init); }}
          className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl active:scale-95 transition-transform"
        >
          আরেকটি বাসা যোগ করুন
        </button>
        <button 
          onClick={onBack}
          className="w-full py-4 text-gray-900 font-bold underline active:scale-95 transition-transform"
        >
          হোমপেজে ফিরে যান
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-bengali pb-32">
      {/* Clean Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-30 pt-4 pb-2 border-b border-gray-100 px-6">
        <div className="flex items-center justify-between gap-4 mb-2 max-w-[480px] mx-auto">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-800 text-xl font-medium transition-colors"
          >
            ✕
          </button>
          <div className="flex flex-1 items-center justify-center">
            {STEPS.map((_, i) => (
              <div key={i} className="flex-1 max-w-[40px] h-1.5 mx-1 rounded-full overflow-hidden bg-gray-200">
                 <div className={`h-full bg-gray-900 transition-all duration-300 ${i <= step ? 'w-full' : 'w-0'}`} />
              </div>
            ))}
          </div>
          <div className="w-10 text-right">
             <span className="text-[10px] font-bold text-gray-400">{step + 1}/3</span>
          </div>
        </div>
        <div className="opacity-0 h-0">Spacing Buffer</div>
      </header>
      <div className="h-[80px]"></div>

      <div className="px-6 space-y-10 mt-6 pb-10">
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
               {step === 0 ? "বাসা সম্পর্কে কিছু তথ্য দিন" : step === 1 ? "বাসার ছবি ও সুবিধা যোগ করুন" : "আপনার সাথে যোগাযোগের উপায়"}
            </h1>
            <p className="text-gray-500 text-[15px]">
               {step === 0 ? "আপনার বাসাটি কেমন, কোথায় অবস্থিত এবং ভাড়া কত।" : step === 1 ? "দুটি বা তিনটি ভালো ছবি যোগ করলে দ্রুত ভাড়া হয়।" : "আগ্রহী ভাড়াটিয়ারা এই নম্বরে যোগাযোগ করবে।"}
            </p>
        </div>

        {/* Step 0: Basic Info */}
        {step === 0 && (
          <div className="space-y-6">
            <F label="লিস্টিং টাইটেল *" hint="যেমন: জিন্দাবাজারে ২ রুমের ফ্ল্যাট">
              <input 
                className="w-full text-lg border-b-2 border-gray-200 focus:border-gray-900 outline-none transition-colors py-2 bg-transparent text-gray-900 placeholder:text-gray-300 font-medium"
                placeholder="টাইটেল লিখুন" 
                value={form.title} 
                onChange={e => set("title", e.target.value)}
              />
            </F>
            
            <F label="এলাকা *">
              <div className="flex flex-wrap gap-2 mt-2">
                {AREAS.map(a => (
                  <button 
                    key={a} 
                    onClick={() => set("area", a)}
                    className={`px-4 py-2.5 rounded-full text-[14px] transition-all border ${
                      form.area === a 
                        ? "bg-gray-900 border-gray-900 text-white" 
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </F>

            <F label="সঠিক ঠিকানা (ঐচ্ছিক)">
              <input 
                className="w-full text-lg border-b-2 border-gray-200 focus:border-gray-900 outline-none transition-colors py-2 bg-transparent text-gray-900 placeholder:text-gray-300 font-medium"
                placeholder="হাউজ নং, রোড নং..." 
                value={form.address} 
                onChange={e => set("address", e.target.value)}
              />
            </F>

            <div className="flex gap-6 mt-8">
              <F label="কত তলায়">
                <input 
                  className="w-full text-lg border-b-2 border-gray-200 focus:border-gray-900 outline-none transition-colors py-2 bg-transparent text-gray-900 placeholder:text-gray-300 font-medium"
                  placeholder="যেমন: ৩য়" 
                  value={form.floor} 
                  onChange={e => set("floor", e.target.value)}
                />
              </F>
              <F label="ভাড়া (৳) *">
                <input 
                  type="number" 
                  className="w-full text-lg border-b-2 border-gray-200 focus:border-gray-900 outline-none transition-colors py-2 bg-transparent text-gray-900 placeholder:text-gray-300 font-medium"
                  placeholder="৮০০০" 
                  value={form.rent} 
                  onChange={e => set("rent", e.target.value)}
                />
              </F>
            </div>

            <F label="বাসার ধরন *">
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[["family", "ফ্যামিলি"], ["bachelor", "ব্যাচেলর"], ["sublet", "সাবলেট"], ["commercial", "কমার্শিয়াল"]].map(([v, l]) => (
                  <button 
                    key={v} 
                    onClick={() => set("type", v)}
                    className={`py-3 rounded-xl text-[14px] font-medium border ${
                      form.type === v 
                        ? "bg-gray-50 border-gray-900 border-2 text-gray-900 font-bold" 
                        : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </F>

            <div className="flex gap-6 mt-8">
              <F label="বেডরুম *">
                <input 
                  type="number" 
                  className="w-full text-center text-lg border-b-2 border-gray-200 focus:border-gray-900 outline-none transition-colors py-2 bg-transparent text-gray-900 placeholder:text-gray-300 font-medium"
                  placeholder="২" 
                  value={form.rooms} 
                  onChange={e => set("rooms", e.target.value)}
                />
              </F>
              <F label="বাথ">
                <input 
                  type="number" 
                  className="w-full text-center text-lg border-b-2 border-gray-200 focus:border-gray-900 outline-none transition-colors py-2 bg-transparent text-gray-900 placeholder:text-gray-300 font-medium"
                  placeholder="১" 
                  value={form.bathrooms} 
                  onChange={e => set("bathrooms", e.target.value)}
                />
              </F>
              <F label="sqft (ঐচ্ছিক)">
                <input 
                  type="number" 
                  className="w-full text-center text-lg border-b-2 border-gray-200 focus:border-gray-900 outline-none transition-colors py-2 bg-transparent text-gray-900 placeholder:text-gray-300 font-medium"
                  placeholder="৭০০" 
                  value={form.size} 
                  onChange={e => set("size", e.target.value)}
                />
              </F>
            </div>
            
            <div className="flex items-center justify-between border-b border-gray-200 py-4 mt-6">
                <div>
                   <p className="text-[16px] font-bold text-gray-900">এখন কি খালি আছে?</p>
                   <p className="text-[12px] text-gray-500">বাসাটি কি এখনই ভাড়া দেওয়া সম্ভব?</p>
                </div>
                <button 
                  onClick={() => set("available", !form.available)}
                  className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${form.available ? 'bg-gray-900' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 shadow-sm ${form.available ? 'left-7' : 'left-1'}`} />
                </button>
            </div>
          </div>
        )}

        {/* Step 1: Photos & Features */}
        {step === 1 && (
          <div className="space-y-8 min-h-[50vh]">
            <F label="বাসার ছবি (সর্বোচ্চ ৫টি)">
              <label className="flex flex-col items-center justify-center gap-3 border border-gray-300 border-dashed rounded-xl p-10 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors mt-2">
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos}/>
                <span className="text-4xl">📸</span>
                <div className="text-center mt-2 border-b border-gray-900 pb-0.5">
                  <span className="block text-gray-900 font-bold text-[14px]">ডিভাইস থেকে ছবি আপলোড করুন</span>
                </div>
                <span className="text-[12px] text-gray-500">{form.photoPreviews.length}/5 ব্যবহৃত</span>
              </label>
              
              {form.photoPreviews.length > 0 && (
                <div className="flex gap-3 overflow-x-auto py-4 scrollbar-hide mt-2 -mx-6 px-6">
                  {form.photoPreviews.map((p, i) => (
                    <div key={i} className="relative flex-shrink-0 group">
                      <img src={p} alt="" className="w-28 h-28 rounded-xl object-cover ring-1 ring-gray-200" />
                      <button 
                        onClick={() => removePhoto(i)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-gray-800 flex items-center justify-center text-xs shadow-md shadow-black/10 hover:scale-110 active:scale-95"
                      >
                        ✕
                      </button>
                      {i === 0 && (
                        <div className="absolute bottom-2 left-2 bg-white text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">
                          কভার
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </F>

            <F label="কী কী সুবিধা আছে?">
              <div className="flex flex-wrap gap-2 mt-2">
                {FEATURES.map(f => (
                  <button 
                    key={f} 
                    onClick={() => toggleFeature(f)}
                    className={`px-4 py-2 rounded-full text-[14px] transition-all border ${
                      form.features.includes(f) 
                        ? "bg-gray-50 border-gray-900 border-2 text-gray-900 font-bold" 
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-800"
                    }`}
                  >
                    {form.features.includes(f) && "✓ "} {f}
                  </button>
                ))}
              </div>
            </F>

            <F label="বিস্তারিত বিবরণ (ঐচ্ছিক)">
              <textarea 
                className="w-full text-lg border-b-2 border-gray-200 focus:border-gray-900 outline-none transition-colors py-2 bg-transparent text-gray-900 placeholder:text-gray-300 font-medium h-32 resize-none mt-2"
                placeholder="বাসা বা এলাকা সম্পর্কে চমৎকার কিছু তথ্য..." 
                value={form.description} 
                onChange={e => set("description", e.target.value)}
              />
            </F>
          </div>
        )}

        {/* Step 2: Contact Info */}
        {step === 2 && (
          <div className="space-y-8 min-h-[50vh]">
            <F label="আপনার নাম *">
              <input 
                className="w-full text-lg border-b-2 border-gray-200 focus:border-gray-900 outline-none transition-colors py-2 bg-transparent text-gray-900 placeholder:text-gray-300 font-medium"
                placeholder="বাসা মালিকের নাম" 
                value={form.contactName} 
                onChange={e => set("contactName", e.target.value)}
              />
            </F>

            <F label="মোবাইল নম্বর *">
              <input 
                type="tel" 
                className="w-full text-lg border-b-2 border-gray-200 focus:border-gray-900 outline-none transition-colors py-2 bg-transparent text-gray-900 placeholder:text-gray-300 font-medium tracking-wide"
                placeholder="0171X-XXXXXX" 
                value={form.contactPhone} 
                onChange={e => set("contactPhone", e.target.value)}
              />
               <p className="text-[12px] text-gray-500 mt-1 mt-2">এই নম্বরে সরাসরি ফোন কল বা হোয়াটসঅ্যাপ আসবে।</p>
            </F>

            <F label="বিকল্প মোবাইল নম্বর (ঐচ্ছিক)">
              <input 
                type="tel" 
                className="w-full text-lg border-b-2 border-gray-200 focus:border-gray-900 outline-none transition-colors py-2 bg-transparent text-gray-900 placeholder:text-gray-300 font-medium tracking-wide mt-2"
                placeholder="0181X-XXXXXX" 
                value={form.contactAlt} 
                onChange={e => set("contactAlt", e.target.value)}
              />
            </F>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-[14px]">
                 {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Persistent Bottom Bar Action */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe shadow-[0_-1px_15px_rgba(0,0,0,0.05)]">
        <div className="max-w-[480px] mx-auto px-6 py-4 flex items-center justify-between">
           {step > 0 ? (
             <button 
               onClick={() => setStep(step - 1)}
               className="text-[15px] font-bold text-gray-900 underline underline-offset-2 px-2 py-2"
             >
               পিছনে
             </button>
           ) : (
             <div className="flex-1"></div>
           )}

           {step < 2 ? (
             <button 
               disabled={!canNext()}
               onClick={() => setStep(step + 1)}
               className={`px-8 py-3.5 rounded-xl font-bold text-[15px] transition-colors ${
                 !canNext() 
                   ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                   : "bg-gray-900 text-white active:scale-95"
               }`}
             >
               পরবর্তী
             </button>
           ) : (
             <button 
               disabled={loading || !canNext()}
               onClick={handleSubmit}
               className={`px-8 py-3.5 rounded-xl font-bold text-[15px] transition-colors ${
                 loading || !canNext()
                   ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                   : "bg-[#e31c5f] text-white active:scale-95 shadow-md"
               }`}
             >
               {loading 
                 ? (form.photoFiles.length > 0 && uploadIdx < form.photoFiles.length)
                   ? `আপলোড হচ্ছে ${uploadIdx + 1}/${form.photoFiles.length}` 
                   : "সাবমিট হচ্ছে..." 
                 : "বাসা সাবমিট করুন"}
             </button>
           )}
        </div>
      </footer>
    </div>
  );
}

function F({ label, hint, children }) {
  return (
    <div className="flex flex-col w-full">
      <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wide mb-1 flex justify-between items-baseline">
        {label}
        {hint && <span className="text-[10px] text-gray-400 font-medium normal-case ml-2 text-right">{hint}</span>}
      </label>
      {children}
    </div>
  );
}
