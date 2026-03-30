// src/services/listingService.js
import {
  collection, addDoc, getDocs, getDoc,
  doc, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

const uploadPhoto = async (file, listingId) => {
  const r = ref(storage, `listings/${listingId}/${Date.now()}_${file.name}`);
  await uploadBytes(r, file);
  return getDownloadURL(r);
};

export const addListing = async (formData, userId, onProgress) => {
  // 1. Create the listing document first (without photos)
  const docRef = await addDoc(collection(db, "listings"), {
    title: formData.title,
    area: formData.area,
    address: formData.address || "",
    floor: formData.floor || "",
    rent: Number(formData.rent),
    type: formData.type,
    rooms: Number(formData.rooms),
    bathrooms: Number(formData.bathrooms || 0),
    size: Number(formData.size || 0),
    features: formData.features || [],
    description: formData.description || "",
    available: formData.available ?? true,
    photos: [], // Initial empty array
    addedBy: userId,
    approved: false,
    createdAt: serverTimestamp(),
  });

  // 2. Upload photos to Storage
  const urls = [];
  const files = formData.photoFiles || [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      const url = await uploadPhoto(files[i], docRef.id);
      urls.push(url);
      if (onProgress) onProgress(i + 1); // Report that image i+1 is done
    } catch (error) {
      console.error("Image upload failed for:", files[i].name, error);
    }
  }

  // 3. Update the document with final photo URLs
  if (urls.length > 0) {
    await updateDoc(docRef, { photos: urls });
  }

  return docRef.id;
};

export const getListings = async () => {
  const q = query(
    collection(db, "listings"),
    where("approved", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getListing = async (id) => {
  const snap = await getDoc(doc(db, "listings", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getMyListings = async (uid) => {
  const q = query(
    collection(db, "listings"),
    where("addedBy", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateListing = async (id, data) =>
  updateDoc(doc(db, "listings", id), { ...data, updatedAt: serverTimestamp() });

export const deleteListing = async (id) => deleteDoc(doc(db, "listings", id));

export const getPendingListings = async () => {
  const q = query(
    collection(db, "listings"),
    where("approved", "==", false),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const approveListing = async (id) =>
  updateDoc(doc(db, "listings", id), { approved: true });
