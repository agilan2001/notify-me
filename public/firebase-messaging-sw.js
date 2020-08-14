importScripts('https://www.gstatic.com/firebasejs/7.15.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.5/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyCRHTSjjk1VudmmI5yCn-GsVh6UHmIN08Q",
  authDomain: "notify-me-agiapp.firebaseapp.com",
  databaseURL: "https://notify-me-agiapp.firebaseio.com",
  projectId: "notify-me-agiapp",
  storageBucket: "notify-me-agiapp.appspot.com",
  messagingSenderId: "189230910349",
  appId: "1:189230910349:web:eaf00d78b6ade7a1750bc4",
  measurementId: "G-BFVSR071FW"
});
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log('Received background message ', payload);
  var notification = JSON.parse(payload.data.notification);
  const notificationTitle = "Notify_Me ALERT ⏰";
  const notificationOptions = {
    body: notification.body,
    icon:"https://dl.dropbox.com/s/lajvp5srja4h4ny/bell-small.png",
    actions: [
      { action: 'b', title: '👍DONE' },
      { action: 'a', title: 'Notify-Me' }
    ]
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});

self.addEventListener('notificationclick', function (event) {

  event.notification.close();

  if (event.action == 'a') {
    clients.openWindow("https://notify-me-agiapp.web.app")
    return;
  }
  else if (event.action == 'b') {
    return;
  }
  clients.openWindow("https://notify-me-agiapp.web.app");
}, false);

this.addEventListener('fetch', function (event) {
  // it can be empty if you just want to get rid of that error
});