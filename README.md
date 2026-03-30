# 🏠 বাসা খোঁজ — Sylhet এর সেরা বাসা খোঁজার App

## ⚡ Quick Start

```bash
# 1. Dependencies install করো
npm install

# 2. Firebase config দাও (src/firebase.js)

# 3. App চালাও
npm run dev
```

---

## 📁 Folder Structure

```
basa-khoj/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              ← Entry point
    ├── App.jsx               ← Navigation controller
    ├── firebase.js           ← 🔴 Config এখানে দাও
    ├── screens/
    │   ├── LoginScreen.jsx   ← Login + Register
    │   ├── HomeScreen.jsx    ← Search + Filter + Listings
    │   ├── DetailScreen.jsx  ← বাসার details + Map + Share
    │   └── AddListingScreen.jsx ← বাসা মালিকের form
    ├── components/
    │   └── ShareSheet.jsx    ← Social media share
    └── services/
        ├── authService.js    ← Login/Register/Google
        ├── listingService.js ← Firebase CRUD
        └── shareService.js   ← Share functions
```

---

## 🔥 Firebase Setup (৩০ মিনিট)

### Step 1 — Project বানাও
1. firebase.google.com → Add project → `basa-khoj`
2. Continue → Create project

### Step 2 — Services enable করো
- **Authentication** → Email/Password ✅ + Google ✅
- **Firestore Database** → Production mode
- **Storage** → Production mode

### Step 3 — Config copy করো
Project Settings (⚙️) → Your apps → Web app (`</>`) → Register app → Copy config → `src/firebase.js` এ বসাও

### Step 4 — Firestore Rules (Firestore → Rules)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /listings/{listingId} {
      allow read: if resource.data.approved == true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null
        && (request.auth.uid == resource.data.addedBy
          || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin");
    }
  }
}
```

### Step 5 — Storage Rules (Storage → Rules)
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /listings/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

---

## 📱 Play Store এ Publish

```bash
# 1. Build করো
npm run build

# 2. Capacitor দিয়ে Android app বানাও
npm install @capacitor/core @capacitor/android
npx cap init "বাসা খোঁজ" "com.basakhoj.app"
npx cap add android
npx cap copy android
npx cap open android

# 3. Android Studio → Build → Generate Signed Bundle
# 4. play.google.com/console এ upload করো ($25 one-time)
```

---

## 🗄️ Firestore Data Structure

```
users/
  {uid}/
    name, email, role (renter|landlord|admin), createdAt

listings/
  {id}/
    title, area, address, floor
    rent (number), type, rooms, bathrooms, size
    features (array), photos (array of URLs)
    contactName, contactPhone, contactAlt
    description, available (boolean)
    approved (boolean — admin approval লাগবে)
    addedBy (uid), createdAt
    lat, lng (optional — map এর জন্য)
```

---

## 💰 Cost: প্রায় ০ টাকা!

| Service | Cost |
|---------|------|
| Firebase Free Tier | $0 |
| Vercel / Netlify | $0 |
| Play Store (one-time) | $25 |
| Domain (optional) | ~৳১,২০০/year |
