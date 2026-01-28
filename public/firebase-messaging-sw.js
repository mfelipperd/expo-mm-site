importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// Replace with your project's Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBHaL7VDwE12rGdX0GaJhu2hp3XQPncjNE",
  authDomain: "expo-mm-site.firebaseapp.com",
  projectId: "expo-mm-site",
  storageBucket: "expo-mm-site.firebasestorage.app",
  messagingSenderId: "739233309720",
  appId: "1:739233309720:web:6126762e641e436241cf6d",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/assets/logo EMM_Prancheta 1.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
