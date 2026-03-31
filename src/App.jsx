// src/App.jsx
import { useState, useEffect } from "react";
import { onAuthChange } from "./services/authService";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import DetailScreen from "./screens/DetailScreen";
import AddListingScreen from "./screens/AddListingScreen";
import ProfileScreen from "./screens/ProfileScreen";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("home"); // "home", "add", "profile", "detail"
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const unsub = onAuthChange((u) => { setUser(u); setLoading(false); });
    return unsub;
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-white animate-pulse">
      <div className="text-7xl drop-shadow-sm">🏠</div>
      <div className="text-center">
        <h1 className="text-primary text-3xl font-extrabold tracking-tight">বাসা খোঁজ</h1>
        <p className="text-gray-400 text-sm mt-2 font-medium">আপনার স্বপ্নের ঠিকানা খুঁজছি...</p>
      </div>
      <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className="w-full h-full bg-primary animate-ping opacity-75"></div>
      </div>
    </div>
  );

  if (!user) return <LoginScreen onLogin={() => setScreen("home")} />;

  // Detail screen covers everything, no bottom nav
  if (screen === "detail" && selectedId) return (
    <DetailScreen
      listingId={selectedId}
      onBack={() => { setScreen("home"); setSelectedId(null); }}
    />
  );

  return (
    <div className="relative min-h-screen pb-20 bg-white">
      {/* Main Content Area */}
      {screen === "home" && (
        <HomeScreen
          user={user}
          onSelectListing={(id) => { setSelectedId(id); setScreen("detail"); }}
        />
      )}
      
      {screen === "add" && (
        <AddListingScreen
          userId={user.uid}
          onBack={() => setScreen("home")}
          onSuccess={() => setScreen("home")}
        />
      )}

      {screen === "profile" && (
        <ProfileScreen user={user} />
      )}

      {/* Persistent Bottom Navigation Bar - Airbnb Style */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="max-w-[480px] mx-auto flex justify-between items-center px-6 py-3">
          <button 
            onClick={() => setScreen("home")}
            className={`flex flex-col items-center gap-1 min-w-[60px] ${screen === "home" ? "text-primary" : "text-gray-400 hover:text-gray-600"}`}
          >
            <span className={`text-2xl transition-transform ${screen === "home" ? "scale-110" : ""}`}>
              {screen === "home" ? "🔍" : "🏠"}
            </span>
            <span className="text-[10px] font-bold">হোম</span>
          </button>
          
          <button 
            onClick={() => setScreen("add")}
            className={`flex flex-col items-center gap-1 min-w-[60px] ${screen === "add" ? "text-primary" : "text-gray-400 hover:text-gray-600"}`}
          >
            <span className={`text-2xl transition-transform ${screen === "add" ? "scale-110" : ""}`}>
              ➕
            </span>
            <span className="text-[10px] font-bold">যোগ করুন</span>
          </button>
          
          <button 
            onClick={() => setScreen("profile")}
            className={`flex flex-col items-center gap-1 min-w-[60px] ${screen === "profile" ? "text-primary" : "text-gray-400 hover:text-gray-600"}`}
          >
            <span className={`text-2xl transition-transform ${screen === "profile" ? "scale-110" : ""}`}>
              👤
            </span>
            <span className="text-[10px] font-bold">প্রোফাইল</span>
          </button>
        </div>
      </div>
    </div>
  );
}
