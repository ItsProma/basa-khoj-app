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

export const addListing = async (formData, userId) => {
  const docRef = await addDoc(collection(db, "listings"), {
    ...formData, photos: [],
    addedBy: userId, approved: false,
    createdAt: serverTimestamp(),
  });
  const urls = [];
  for (const f of formData.photoFiles || []) {
    urls.push(await uploadPhoto(f, docRef.id));
  }
  if (urls.length) await updateDoc(docRef, { photos: urls });
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
