'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

const NOTIFICATION_SOUND_PATH = '/sounds/BvyegYDEnLc.mp3';

type AppNotification = {
  id: number;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

type PushState = 'unsupported' | 'idle' | 'enabled' | 'blocked' | 'loading';

function playNotificationTone(
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  canPlayRef: React.MutableRefObject<boolean>,
) {
  if (!canPlayRef.current) return;
  const player = audioRef.current;
  if (!player) return;
  try {
    player.currentTime = 0;
    const playPromise = player.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Ignore unsupported source / autoplay restrictions.
      });
    }
  } catch {
    // Ignore sync playback errors.
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function NotificationBell() {
  const { status } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pushState, setPushState] = useState<PushState>('idle');
  const [pushHint, setPushHint] = useState('');
  const prevUnreadRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canPlaySoundRef = useRef(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const detectPushState = useCallback(async () => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setPushState('unsupported');
      return;
    }

    if (Notification.permission === 'denied') {
      setPushState('blocked');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const existing = await registration.pushManager.getSubscription();
      setPushState(existing ? 'enabled' : 'idle');
    } catch {
      setPushState('unsupported');
    }
  }, []);

  useEffect(() => {
    if (status !== 'authenticated') return;
    void detectPushState();
  }, [detectPushState, status]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = NOTIFICATION_SOUND_PATH;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const unlockAudio = () => {
      canPlaySoundRef.current = true;
      const player = audioRef.current;
      if (!player) return;
      try {
        const warmupPromise = player.play();
        if (warmupPromise && typeof warmupPromise.then === 'function') {
          warmupPromise
            .then(() => {
              player.pause();
              player.currentTime = 0;
            })
            .catch(() => {
              // Ignore if browser keeps blocking until later interaction.
            });
        }
      } catch {
        // no-op
      }
    };

    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio);

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  const enableBackgroundNotifications = async () => {
    if (pushState === 'loading') return;
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setPushState('unsupported');
      return;
    }

    setPushState('loading');
    setPushHint('');

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setPushState(permission === 'denied' ? 'blocked' : 'idle');
        setPushHint('Browser permission is required for background notifications.');
        return;
      }

      const publicKeyRes = await fetch('/api/push/public-key', { cache: 'no-store' });
      if (!publicKeyRes.ok) {
        setPushState('idle');
        setPushHint('Server push key is not configured.');
        return;
      }

      const keyData = await publicKeyRes.json();
      const publicKey = String(keyData?.publicKey || '');
      if (!publicKey) {
        setPushState('idle');
        setPushHint('Server push key is not configured.');
        return;
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }

      const saveRes = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription.toJSON()),
      });

      if (!saveRes.ok) {
        setPushState('idle');
        setPushHint('Failed to enable push notifications.');
        return;
      }

      setPushState('enabled');
      setPushHint('Background notifications are enabled.');
    } catch {
      setPushState('idle');
      setPushHint('Failed to enable push notifications.');
    }
  };

  const disableBackgroundNotifications = async () => {
    if (pushState === 'loading' || !('serviceWorker' in navigator)) return;

    setPushState('loading');
    setPushHint('');

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }
      setPushState('idle');
      setPushHint('Background notifications are disabled.');
    } catch {
      setPushState('enabled');
      setPushHint('Failed to disable push notifications.');
    }
  };

  const fetchNotifications = useCallback(async () => {
    if (status !== 'authenticated') return;
    try {
      setLoading(true);
      const response = await fetch('/api/notifications?limit=12', { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      const nextUnread = Number(data?.unreadCount || 0);
      setNotifications(Array.isArray(data?.notifications) ? data.notifications : []);
      setUnreadCount(nextUnread);
      if (prevUnreadRef.current > 0 && nextUnread > prevUnreadRef.current) {
        playNotificationTone(audioRef, canPlaySoundRef);
      }
      prevUnreadRef.current = nextUnread;
    } catch {
      // no-op
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void fetchNotifications();
    const id = window.setInterval(() => {
      void fetchNotifications();
    }, 20000);
    return () => window.clearInterval(id);
  }, [fetchNotifications]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));
      setUnreadCount(0);
      prevUnreadRef.current = 0;
    } catch {
      // no-op
    }
  };

  const markOneRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, is_read: true } : item)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      prevUnreadRef.current = Math.max(0, prevUnreadRef.current - 1);
    } catch {
      // no-op
    }
  };

  const unreadItems = useMemo(() => notifications.filter((n) => !n.is_read).length, [notifications]);

  if (status !== 'authenticated') return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-96 max-w-[90vw] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border dark:border-gray-800 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b dark:border-gray-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Notifications</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{unreadItems} unread</p>
            </div>
            <button
              onClick={markAllRead}
              className="text-xs px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1"
            >
              <CheckCheck size={12} />
              Mark all
            </button>
          </div>

          <div className="px-4 py-2 border-b dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/30">
            <p className="text-[11px] text-gray-600 dark:text-gray-300 mb-2">Background alerts</p>
            <div className="flex items-center gap-2">
              {pushState === 'enabled' ? (
                <button
                  onClick={() => void disableBackgroundNotifications()}
                  className="text-[11px] px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                >
                  Disable
                </button>
              ) : (
                <button
                  onClick={() => void enableBackgroundNotifications()}
                  disabled={pushState === 'loading' || pushState === 'unsupported' || pushState === 'blocked'}
                  className="text-[11px] px-2 py-1 rounded-md bg-blue-600 text-white disabled:opacity-60"
                >
                  {pushState === 'loading' ? 'Enabling...' : 'Enable'}
                </button>
              )}
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                {pushState === 'enabled' && 'On'}
                {pushState === 'idle' && 'Off'}
                {pushState === 'unsupported' && 'Not supported'}
                {pushState === 'blocked' && 'Blocked by browser'}
                {pushState === 'loading' && 'Please wait'}
              </span>
            </div>
            {pushHint ? <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{pushHint}</p> : null}
          </div>

          <div className="max-h-96 overflow-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-6 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 justify-center">
                <Loader2 size={16} className="animate-spin" />
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-sm text-gray-500 dark:text-gray-400 text-center">No notifications yet</div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`px-4 py-3 border-b dark:border-gray-800 ${item.is_read ? 'bg-transparent' : 'bg-blue-50/60 dark:bg-blue-900/20'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">{item.message}</p>
                      {item.link ? (
                        <Link
                          href={item.link}
                          onClick={() => {
                            void markOneRead(item.id);
                            setOpen(false);
                          }}
                          className="mt-2 inline-block text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Open
                        </Link>
                      ) : null}
                    </div>
                    {!item.is_read && (
                      <button
                        onClick={() => void markOneRead(item.id)}
                        className="text-[10px] px-2 py-1 rounded bg-blue-600 text-white"
                      >
                        Read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
