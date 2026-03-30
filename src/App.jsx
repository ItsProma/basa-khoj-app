// src/App.jsx
import { useState, useEffect } from "react";
import { onAuthChange } from "./services/authService";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import DetailScreen from "./screens/DetailScreen";
import AddListingScreen from "./screens/AddListingScreen";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("home");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const unsub = onAuthChange((u) => { setUser(u); setLoading(false); });
    return unsub;
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gradient-to-br from-primary-dark to-primary animate-pulse">
      <div className="text-7xl drop-shadow-2xl">🏠</div>
      <div className="text-center">
        <h1 className="text-white text-3xl font-extrabold tracking-tight">বাসা খোঁজ</h1>
        <p className="text-white/60 text-sm mt-2 font-medium">আপনার স্বপ্নের ঠিকানা খুঁজছি...</p>
      </div>
      <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
        <div className="w-full h-full bg-accent animate-ping opacity-75"></div>
      </div>
    </div>
  );

  if (!user) return <LoginScreen onLogin={() => setScreen("home")} />;

  if (screen === "add") return (
    <AddListingScreen
      userId={user.uid}
      onBack={() => setScreen("home")}
    />
  );

  if (screen === "detail" && selectedId) return (
    <DetailScreen
      listingId={selectedId}
      onBack={() => { setScreen("home"); setSelectedId(null); }}
    />
  );

  return (
    <HomeScreen
      user={user}
      onSelectListing={(id) => { setSelectedId(id); setScreen("detail"); }}
      onAddListing={() => setScreen("add")}
    />
  );
}
