// src/components/ShareSheet.jsx
import { useState } from "react";
import {
  shareOnFacebook, shareOnWhatsApp, shareOnMessenger,
  shareOnTelegram, shareOnTwitter, copyLink,
  nativeShare, buildShareText,
} from "../services/shareService";

export function ShareSheet({ listing, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyLink(listing);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const PLATFORMS = [
    { label: "WhatsApp",  icon: "💬", color: "#25D366", bg: "#f0fdf4", action: () => shareOnWhatsApp(listing) },
    { label: "Facebook",  icon: "👍", color: "#1877F2", bg: "#eff6ff", action: () => shareOnFacebook(listing) },
    { label: "Messenger", icon: "✈️", color: "#0099FF", bg: "#f0f9ff", action: () => shareOnMessenger(listing) },
    { label: "Telegram",  icon: "📨", color: "#229ED9", bg: "#f0f9ff", action: () => shareOnTelegram(listing) },
    { label: "Twitter/X", icon: "🐦", color: "#000",    bg: "#f9fafb", action: () => shareOnTwitter(listing) },
    { label: "আরও অ্যাপ", icon: "↗️", color: "#6366f1", bg: "#f5f3ff", action: () => nativeShare(listing) },
  ];

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={s.handle} />
        <div style={s.header}>
          <h3 style={s.title}>বাসাটি শেয়ার করুন</h3>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={s.preview}>
          <span style={{ fontSize: 30 }}>🏠</span>
          <div>
            <p style={s.previewTitle}>{listing.title}</p>
            <p style={s.previewSub}>📍 {listing.area} • ৳{listing.rent?.toLocaleString()}/মাস</p>
          </div>
        </div>
        <div style={s.grid}>
          {PLATFORMS.map((p) => (
            <button key={p.label} style={{ ...s.btn, background: p.bg }} onClick={p.action}>
              <span style={{ fontSize: 26 }}>{p.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: p.color }}>{p.label}</span>
            </button>
          ))}
        </div>
        <div style={s.textBox}>
          <p style={s.textContent}>{buildShareText(listing)}</p>
        </div>
        <button style={s.copyBtn} onClick={handleCopy}>
          {copied ? "✅ Link Copied!" : "🔗 Link Copy করুন"}
        </button>
      </div>
    </div>
  );
}

const s = {
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"flex-end", zIndex:300 },
  sheet: { background:"#fff", borderRadius:"24px 24px 0 0", padding:"12px 20px 40px", width:"100%", maxWidth:480, margin:"0 auto", boxSizing:"border-box" },
  handle: { width:40, height:4, background:"#e0e0e0", borderRadius:2, margin:"0 auto 16px" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 },
  title: { fontSize:17, fontWeight:800, color:"#1a1a1a", margin:0 },
  closeBtn: { width:30, height:30, borderRadius:"50%", background:"#f0f0f0", border:"none", fontSize:13, cursor:"pointer" },
  preview: { display:"flex", alignItems:"center", gap:12, background:"#f9fdf9", borderRadius:14, padding:"12px 14px", marginBottom:20, border:"1px solid #c8e6c9" },
  previewTitle: { fontSize:14, fontWeight:700, color:"#1a1a1a", margin:"0 0 3px 0" },
  previewSub: { fontSize:12, color:"#888", margin:0 },
  grid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 },
  btn: { borderRadius:14, border:"none", padding:"14px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:6, cursor:"pointer" },
  textBox: { background:"#f8f8f8", borderRadius:12, padding:"12px 14px", marginBottom:14, border:"1px solid #eee", maxHeight:90, overflowY:"auto" },
  textContent: { fontSize:12, color:"#555", lineHeight:1.7, margin:0, whiteSpace:"pre-line" },
  copyBtn: { width:"100%", padding:13, borderRadius:14, border:"none", background:"linear-gradient(135deg,#1a6b3c,#2d8a52)", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" },
};
