# ReactNativeDemo

A React Native app built with Expo that integrates Firebase services (Firestore, Storage, Auth) and dynamically fetches the Firebase API key from a backend.

---

## Features

- Dynamic Firebase config fetched securely from backend
- Firestore database integration
- Firebase Storage for image uploads
- Authentication state management
- Expo ImagePicker support for photos
- Form submission with validation and error handling

---

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- Expo CLI (`npm install -g expo-cli`)
- A Firebase project with Firestore and Storage enabled
- Backend API that serves the Firebase API key at `/api/getApiKey`

### Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/yourusername/reactnativedemo.git
   cd reactnativedemo

2. Install dependecies:

   npm install

3. Clone the backend repo and set up your backend server to serve the API key at http://your-backend-ip:3000/api/getApiKey

   Clone the backend repo:

   ```bash
   git clone https://github.com/yourusername/nodejsbackend.git
   **follow the readme in the backend repo to get your backend running**

4. Update the backend IP address in src/contexts/ApiKeyProvider.tsx:

   const response = await fetch('http://your-backend-ip:3000/api/getApiKey');

5. Run the backend server and then run the front-end app:

   expo start
   
   Scan the QR code if you have Expo GO app installed or open on your physical device or emulator

### Project Structure

   src/
   ├── components/          # Reusable UI components
   ├── contexts/            # Context providers (ApiKeyProvider, FirebaseProvider)
   ├── navigation/          # Navigation stack and screens
   ├── screens/             # App screens (Login, Main, Success)
   ├── App.tsx              # App entry point

### Usage

- The app fetches your Firebase API key on startup.
- If fetching fails, you’ll see an error message.
- Once Firebase initializes, you can submit the form with a name, email,    description, and optionally upload an image.
- Submissions are saved to Firestore and images uploaded to Firebase Storage.
- On success, you’ll be navigated to a success screen.


### Troubleshooting

- App stuck loading Firebase: Check your backend API URL and network connectivity.
- Firebase Storage unknown error: Verify Firebase Storage rules and that the API key is correct.
- Duplicate Firebase app error: Ensure Firebase is initialized only once in FirebaseProvider.

### Dependencies

- React Native
- Expo
- Firebase (v9 modular)
- React Navigation
- React Native Paper
- react-native-uuid
- expo-image-picker