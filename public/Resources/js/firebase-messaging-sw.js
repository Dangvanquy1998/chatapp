// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyDTtXVVsHUsJnKiqSeRyeEPcUIVTk0-sKI",
    authDomain: "web-notification-4287d.firebaseapp.com",
    databaseURL: "https://web-notification-4287d.firebaseio.com",
    projectId: "web-notification-4287d",
    storageBucket: "web-notification-4287d.appspot.com",
    messagingSenderId: "994992429937",
    appId: "1:994992429937:web:5b49407ec4a7e1c53f74d0",

  
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: 'codelearn-logo.svg'
    };
  
    self.registration.showNotification(notificationTitle,
      notificationOptions);
  });