// sw.js
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => self.clients.claim());

// Push nahi use kar rahe (no keys/server), phir bhi keep handler for future:
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch {}
  const title = data.title || 'Expense Reminder';
  const body  = data.body  || 'It’s time for your reminder.';

  event.waitUntil(self.registration.showNotification(title, {
    body,
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag: 'expense-push',
    renotify: false
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const all = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (all.length) {
      all[0].focus();
      all[0].navigate('./');
    } else {
      clients.openWindow('./');
    }
  })());
});
