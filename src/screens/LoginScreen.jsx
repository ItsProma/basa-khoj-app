// src/screens/LoginScreen.jsx
import { useState } from "react";
import { registerUser, loginUser, loginWithGoogle } from "../services/authService";

export default function LoginScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("renter");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) return setError("❌ Email আর Password দাও।");
    setLoading(true); setError("");
    try {
      if (isLogin) await loginUser(email, password);
      else await registerUser(email, password, name, role);
      onLogin();
    } catch (e) {
      setError("❌ " + (e.code === "auth/wrong-password" ? "Password ভুল।"
        : e.code === "auth/user-not-found" ? "Account পাওয়া যায়নি।"
        : e.code === "auth/email-already-in-use" ? "Email টি আগে থেকেই registered।"
        : e.message));
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try { await loginWithGoogle(role); onLogin(); }
    catch (e) { setError("❌ Google login ব্যর্থ হয়েছে।"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center p-6 relative overflow-hidden font-bengali">
      {/* Background Decorative Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 relative z-10 backdrop-blur-sm border border-white/20">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4 drop-shadow-md">🏠</div>
          <h1 className="text-3xl font-extrabold text-primary-dark tracking-tight">বাসা খোঁজ</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">সিলেটের সেরা বাসা খোঁজার অ্যাপ</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
          {["লগইন", "নতুন অ্যাকাউন্ট"].map((t, i) => (
            <button
              key={t}
              onClick={() => { setIsLogin(!i); setError(""); }}
              className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-xl transition-all duration-300 ${
                isLogin === !i 
                  ? "bg-white text-primary shadow-sm ring-1 ring-black/5" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">আপনার নাম</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:border-primary transition-all outline-none"
                  placeholder="যেমন: রাহেলা বেগম" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">আপনি কে?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[["renter", "🔍 বাসা খুঁজছি"], ["landlord", "🏠 বাসা মালিক"]].map(([v, l]) => (
                    <button
                      key={v}
                      onClick={() => setRole(v)}
                      className={`py-2.5 px-3 text-[11px] font-bold rounded-xl border-2 transition-all ${
                        role === v 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-gray-100 bg-gray-50/50 text-gray-500 hover:border-gray-200"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">ইমেইল</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:border-primary transition-all outline-none"
              placeholder="example@gmail.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">পাসওয়ার্ড</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:border-primary transition-all outline-none"
              placeholder="কমপক্ষে ৬ অক্ষর" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 animate-head-shake">
              <p className="text-red-600 text-xs font-bold text-center">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-extrabold text-white shadow-lg transition-all transform active:scale-[0.98] ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-primary to-primary-light hover:shadow-primary/30"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                অপেক্ষা করুন...
              </span>
            ) : isLogin ? "🔐 লগইন করুন" : "✅ অ্যাকাউন্ট তৈরি করুন"}
          </button>

          <div className="flex items-center gap-4 my-4 text-gray-300">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">অথবা</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border-2 border-gray-100 bg-white text-gray-700 text-sm font-bold hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google দিয়ে লগইন
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8 font-medium">
          {isLogin ? "নতুন ইউজার? " : "আগে থেকে অ্যাকাউন্ট আছে? "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-primary font-bold hover:underline underline-offset-4"
          >
            {isLogin ? "রেজিস্টার করুন" : "লগইন করুন"}
          </button>
        </p>
      </div>
    </div>
  );
}
