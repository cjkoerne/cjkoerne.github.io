
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

import { auth, db } from "./firebase.js";

const button = document.querySelector("#import-button");
const message = document.querySelector("#import-message");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    message.textContent = "Please log in on the Contact Us page first.";
    button.disabled = true;
  } else {
    button.disabled = false;
  }
});

button.addEventListener("click", async () => {
  message.textContent = "Loading activity data...";
  button.disabled = true;

  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("You must log in first.");
    }

    const response = await fetch("activities.json");

    if (!response.ok) {
      throw new Error("Could not load activities.json.");
    }

    const data = await response.json();

    const activityDocument = doc(db, "siteData", "activities");
    const existingDocument = await getDoc(activityDocument);

    if (existingDocument.exists()) {
      throw new Error("Activity data has already been imported.");
    }

    await setDoc(activityDocument, {
      categories: data.categories,
      activityDetails: data.activityDetails,
      updatedAt: serverTimestamp()
    });

    message.textContent = "Success! Your activity data is now in Firebase.";
  } catch (error) {
    console.error(error);
    message.textContent = "Import failed: " + error.message;
  } finally {
    button.disabled = false;
  }
});
