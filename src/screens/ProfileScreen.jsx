import { logoutUser } from "../services/authService";

export default function ProfileScreen({ user }) {
  const name = user?.displayName || "ব্যবহারকারী";
  const email = user?.email || "";
  const initial = name[0] || email[0] || "?";

  return (
    <div className="min-h-screen bg-white font-bengali pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">প্রোফাইল</h1>
      </header>

      {/* User Info Card */}
      <div className="px-6 space-y-8">
        <div className="flex items-center gap-5 pb-8 border-b border-gray-100">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
            <span className="text-3xl text-white font-black">{initial.toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{name}</h2>
            <p className="text-sm font-medium text-gray-400 mt-1">{email}</p>
          </div>
        </div>

        {/* Menu Options */}
        <div className="space-y-2">
          {/* Static options for display */}
          <button className="w-full flex items-center justify-between py-4 border-b border-gray-50 active:scale-95 transition-transform text-left">
            <div className="flex items-center gap-4">
              <span className="text-xl">⚙️</span>
              <span className="text-gray-700 font-medium">সেটিংস</span>
            </div>
            <span className="text-gray-300">❯</span>
          </button>
          
          <button className="w-full flex items-center justify-between py-4 border-b border-gray-50 active:scale-95 transition-transform text-left">
            <div className="flex items-center gap-4">
              <span className="text-xl">🛡️</span>
              <span className="text-gray-700 font-medium">প্রাইভেসি ও পলিসি</span>
            </div>
            <span className="text-gray-300">❯</span>
          </button>
          
          <button className="w-full flex items-center justify-between py-4 border-b border-gray-50 active:scale-95 transition-transform text-left">
            <div className="flex items-center gap-4">
              <span className="text-xl">🎧</span>
              <span className="text-gray-700 font-medium">হেল্প ও সাপোর্ট</span>
            </div>
            <span className="text-gray-300">❯</span>
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={logoutUser}
          className="w-full py-4 mt-6 bg-red-50 text-red-500 font-bold rounded-2xl active:scale-95 transition-transform"
        >
          লগ আউট করুন
        </button>
      </div>
    </div>
  );
}
