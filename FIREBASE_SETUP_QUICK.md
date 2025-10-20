# 🔥 Firebase Setup - Quick Guide

## Step 1: Create Firebase Project ✅

1. Go to: https://console.firebase.google.com/
2. Click "Add project"
3. Name: `LarsBees`
4. Disable Google Analytics (optional)
5. Click "Create project"
6. Wait ~30 seconds
7. Click "Continue"

---

## Step 2: Set Up Realtime Database

1. In left sidebar, click **"Build"** → **"Realtime Database"**
2. Click **"Create Database"**
3. Location: Choose closest to you (e.g., `us-central1`)
4. Click **"Next"**
5. Security rules: Select **"Start in test mode"**
6. Click **"Enable"**
7. Database created! ✅

---

## Step 3: Get Your Configuration

1. Click the **⚙️ gear icon** (next to "Project Overview")
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **web icon** `</>`
5. App nickname: `LarsBees Web`
6. ❌ Don't check "Firebase Hosting"
7. Click **"Register app"**
8. **COPY the firebaseConfig object** - you'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyABC123...",
  authDomain: "larsbees-xxxxx.firebaseapp.com",
  databaseURL: "https://larsbees-xxxxx-default-rtdb.firebaseio.com",
  projectId: "larsbees-xxxxx",
  storageBucket: "larsbees-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

9. **SAVE THIS CONFIG** - you'll need it in the next step!

---

## Step 4: Add Config to Your App

I'll help you with this once you have the config!

---

## 🆘 Stuck?

- **Can't find Realtime Database?** Look under "Build" in the left sidebar
- **Database URL missing?** Make sure you created "Realtime Database" not "Firestore"
- **Need help?** Just let me know which step you're on!

---

## 📋 Checklist

- [ ] Firebase account created
- [ ] Project created
- [ ] Realtime Database enabled
- [ ] Firebase config copied
- [ ] Ready for Step 4!

