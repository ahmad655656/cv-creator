self.addEventListener('push', (event) => {
  let payload = {};

  if (event.data) {
    try {
      payload = event.data.json();
    } catch (_error) {
      payload = {};
    }
  }

  const title = payload.title || 'New Notification';
  const message = payload.message || '';
  const link = payload.link || '/dashboard';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: message,
      icon: '/next.svg',
      badge: '/next.svg',
      data: {
        link,
      },
      tag: `cv-creator-${Date.now()}`,
      renotify: true,
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetLink = event.notification?.data?.link || '/dashboard';
  const absoluteTarget = new URL(targetLink, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url === absoluteTarget && 'focus' in client) {
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(absoluteTarget);
      }

      return undefined;
    }),
  );
});
