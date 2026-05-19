# Namma HomeStay

Welcome to Namma HomeStay! This project provides a full-stack solution for rural home-stay owners to manage their listings, showcase traditional food, and connect with guests.

## 📱 Project Overview
This repository contains two complete versions of the Namma HomeStay application:
1. **Web App (React)**: A fully functional web application that you can preview and use right now in this environment.
2. **Android App (Kotlin/Jetpack Compose)**: A native Android Studio project source code located in the `/android-source` directory.

---

## 🌐 Web Version (React + Firebase)
The web version is ready for use. It features:
- **Authentication**: Secure Google Login.
- **Dashboard**: Overview of all your listings.
- **Listing Management**: Add, edit, or delete home-stays with photos of rooms and surroundings.
- **Food Menu**: Highlight local delicacies like Akki Rotti or Bamboo Shoot Curry.
- **Cloud Storage**: Automatic photo uploads to Firebase Storage.

**How to use:**
- Sign in using the home screen.
- Click "Add New Listing" to create your first home-stay.
- Manage your profile to add contact details.

---

## 🤖 Android Version (Kotlin)
The native Android source code is structured with MVVM architecture and modular packages.

**Folders in `/android-source`:**
- `app/src/main/java/com/nammahomestay/ui`: Jetpack Compose screens.
- `app/src/main/java/com/nammahomestay/viewmodel`: State management logic.
- `app/src/main/java/com/nammahomestay/model`: Data models.
- `app/src/main/java/com/nammahomestay/utils`: Helper utilities like Image Pickers.

**Setup Instructions for Android Studio:**
1. Download the `/android-source` folder.
2. Open Android Studio and select **"Open an Existing Project"**.
3. Choose the `android-source` folder.
4. **Firebase Setup**:
   - Go to your Firebase Console.
   - Add an Android App to your project (`com.nammahomestay`).
   - Download the `google-services.json` file.
   - Place it in the `android-source/app/` directory.
5. Sync Project with Gradle Files.
6. Run the app on an emulator or physical device.

---

## 🛡️ Security
This project uses **Hardened Firestore Security Rules** to ensure that hosts can only manage their own listings and that all data follows strict integrity checks.

## 🛠️ Technical Stack
- **Frontend**: React 19, Tailwind CSS 4, Motion/React.
- **Android**: Kotlin, Jetpack Compose, Material 3, MVVM.
- **Backend**: Firebase Authentication, Cloud Firestore, Firebase Storage.
