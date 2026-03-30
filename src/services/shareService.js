// src/services/shareService.js
const BASE_URL = "https://basakhoj.app"; // ← তোমার domain

export const getListingURL = (id) => `${BASE_URL}/listing/${id}`;

export const buildShareText = (l) =>
  `🏠 *${l.title}*\n📍 ${l.area}, সিলেট\n💰 ভাড়া: ৳${l.rent?.toLocaleString()}/মাস\n🛏️ ${l.rooms} রুম | ${l.floor || ""}\n${l.available ? "✅ এখনই খালি আছে!" : "⏳ শীঘ্রই খালি হবে"}\n\nবাসা খোঁজ App এ দেখুন 👇`;

export const shareOnFacebook = (l) =>
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getListingURL(l.id))}`, "_blank");

export const shareOnWhatsApp = (l) =>
  window.open(`https://wa.me/?text=${encodeURIComponent(buildShareText(l) + "\n\n" + getListingURL(l.id))}`, "_blank");

export const shareOnMessenger = (l) =>
  window.open(`fb-messenger://share?link=${encodeURIComponent(getListingURL(l.id))}`, "_blank");

export const shareOnTelegram = (l) =>
  window.open(`https://t.me/share/url?url=${encodeURIComponent(getListingURL(l.id))}&text=${encodeURIComponent(buildShareText(l))}`, "_blank");

export const shareOnTwitter = (l) =>
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🏠 ${l.title} — ৳${l.rent}/মাস | ${l.area}, সিলেট`)}&url=${encodeURIComponent(getListingURL(l.id))}`, "_blank");

export const copyLink = async (l) => {
  await navigator.clipboard.writeText(getListingURL(l.id));
};

export const nativeShare = async (l) => {
  if (!navigator.share) return false;
  await navigator.share({ title: l.title, text: buildShareText(l), url: getListingURL(l.id) });
  return true;
};
