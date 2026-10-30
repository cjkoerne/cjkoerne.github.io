
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

import { auth, db, googleProvider } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const email = document.querySelector("#login-email");
  const password = document.querySelector("#login-password");
  const authMessage = document.querySelector("#auth-message");
  const loginSection = document.querySelector("#login-section");
  const userSection = document.querySelector("#user-section");
  const userStatus = document.querySelector("#user-status");
  const submitButton = document.querySelector("#contact-form button[type='submit']");

  const showMessage = (message) => {
    authMessage.textContent = message;
  };

  document.querySelector("#signup-button").addEventListener("click", async () => {
    showMessage("Creating your account...");
    try {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      showMessage("Account created successfully!");
    } catch (error) {
      showMessage(error.message);
    }
  });

  document.querySelector("#login-button").addEventListener("click", async () => {
    showMessage("Logging in...");
    try {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      showMessage("Login successful!");
    } catch (error) {
      showMessage(error.message);
    }
  });

  document.querySelector("#google-button").addEventListener("click", async () => {
    showMessage("Connecting to Google...");
    try {
      await signInWithPopup(auth, googleProvider);
      showMessage("Google login successful!");
    } catch (error) {
      showMessage(error.message);
    }
  });

  document.querySelector("#reset-password-button").addEventListener("click", async () => {
  const email = document.querySelector("#login-email").value;
  const message = document.querySelector("#auth-message");

  if (!email) {
    message.textContent = "Please enter your email address first.";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    message.textContent = "Password reset email sent! Check your inbox.";
  } catch (error) {
    message.textContent = "Could not send reset email. " + error.message;
  }
});
  
  document.querySelector("#logout-button").addEventListener("click", async () => {
    try {
      await signOut(auth);
      showMessage("You have signed out.");
    } catch (error) {
      showMessage(error.message);
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginSection.hidden = true;
      userSection.hidden = false;
      userStatus.textContent = `Signed in as ${user.email || user.displayName}`;
      submitButton.disabled = false;
    } else {
      loginSection.hidden = false;
      userSection.hidden = true;
      submitButton.disabled = true;
    }
  });

  const contactForm = document.querySelector("#contact-form");

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      document.querySelector("#form-message").textContent =
        "Please log in before submitting.";
      return;
    }

    const formMessage = document.querySelector("#form-message");
    const name = document.querySelector("#name").value.trim();
    const contactEmail = document.querySelector("#email").value.trim();
    const interest = document.querySelector("#interest").value;
    const message = document.querySelector("#message").value.trim();

    submitButton.disabled = true;
    formMessage.textContent = "Sending your message...";

    try {
      await addDoc(collection(db, "collectMessages"), {
        name,
        email: contactEmail,
        interest,
        message,
        userId: user.uid,
        timestamp: serverTimestamp()
      });

      formMessage.textContent =
        "Success! Your contact information has been saved to Firebase.";

      contactForm.reset();
    } catch (error) {
      formMessage.textContent =
        `Your message could not be saved: ${error.message}`;
    } finally {
      submitButton.disabled = false;
    }
  });
});
