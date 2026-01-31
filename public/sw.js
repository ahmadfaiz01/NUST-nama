// Service Worker for Push Notifications
// Register this in your app: navigator.serviceWorker.register('/sw.js')

self.addEventListener('install', (event) => {
    console.log('[SW] Service Worker installed');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Service Worker activated');
    event.waitUntil(self.clients.claim());
});

// Handle incoming push notifications
self.addEventListener('push', (event) => {
    const data = event.data?.json() ?? {
        title: "What's Up NUST",
        body: "You have a new notification!",
    };

    const options = {
        body: data.body,
        icon: '/icons/icon-192.png',
        badge: '/icons/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/',
        },
        actions: [
            { action: 'open', title: 'Open' },
            { action: 'close', title: 'Dismiss' },
        ],
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'close') return;

    const url = event.notification.data?.url || '/';

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // If a window is already open, focus it
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.focus();
                    client.navigate(url);
                    return;
                }
            }
            // Otherwise, open a new window
            if (self.clients.openWindow) {
                return self.clients.openWindow(url);
            }
        })
    );
});
