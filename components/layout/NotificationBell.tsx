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
        setPushHint('يجب السماح بإشعارات المتصفح لتفعيل التنبيهات.');
        return;
      }

      const publicKeyRes = await fetch('/api/push/public-key', { cache: 'no-store' });
      if (!publicKeyRes.ok) {
        setPushState('idle');
        setPushHint('مفتاح الإشعارات غير مهيأ على الخادم.');
        return;
      }

      const keyData = await publicKeyRes.json();
      const publicKey = String(keyData?.publicKey || '');
      if (!publicKey) {
        setPushState('idle');
        setPushHint('مفتاح الإشعارات غير مهيأ على الخادم.');
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
        setPushHint('تعذر تفعيل إشعارات الخلفية.');
        return;
      }

      setPushState('enabled');
      setPushHint('تم تفعيل إشعارات الخلفية.');
    } catch {
      setPushState('idle');
      setPushHint('تعذر تفعيل إشعارات الخلفية.');
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
      setPushHint('تم إيقاف إشعارات الخلفية.');
    } catch {
      setPushState('enabled');
      setPushHint('تعذر إيقاف إشعارات الخلفية.');
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
        className="relative rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 md:hidden" onClick={() => setOpen(false)} />

          <div
            dir="rtl"
            className="fixed inset-x-2 top-16 z-50 flex max-h-[calc(100vh-5rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 md:inset-x-auto md:right-3 md:left-auto md:top-[4.25rem] md:w-[430px] md:max-w-[calc(100vw-1.25rem)] md:max-h-[calc(100vh-5.25rem)]"
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
              <div className="min-w-0">
                <p className="font-bold text-slate-900 dark:text-slate-100">الإشعارات</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{unreadItems} غير مقروءة</p>
              </div>
              <button
                onClick={markAllRead}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <CheckCheck size={12} />
                تحديد الكل كمقروء
              </button>
            </div>

            <div className="border-b border-slate-200 bg-slate-50/70 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-800/30">
              <p className="mb-2 text-[11px] font-medium text-slate-600 dark:text-slate-300">إشعارات الخلفية</p>
              <div className="flex items-center gap-2">
                {pushState === 'enabled' ? (
                  <button
                    onClick={() => void disableBackgroundNotifications()}
                    className="rounded-md bg-slate-200 px-2 py-1 text-[11px] text-slate-800 dark:bg-slate-700 dark:text-slate-100"
                  >
                    إيقاف
                  </button>
                ) : (
                  <button
                    onClick={() => void enableBackgroundNotifications()}
                    disabled={pushState === 'loading' || pushState === 'unsupported' || pushState === 'blocked'}
                    className="rounded-md bg-blue-600 px-2 py-1 text-[11px] text-white disabled:opacity-60"
                  >
                    {pushState === 'loading' ? 'جارٍ التفعيل...' : 'تفعيل'}
                  </button>
                )}
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {pushState === 'enabled' && 'مفعلة'}
                  {pushState === 'idle' && 'متوقفة'}
                  {pushState === 'unsupported' && 'غير مدعومة'}
                  {pushState === 'blocked' && 'محجوبة من المتصفح'}
                  {pushState === 'loading' && 'يرجى الانتظار'}
                </span>
              </div>
              {pushHint ? <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{pushHint}</p> : null}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {loading && notifications.length === 0 ? (
                <div className="flex items-center justify-center gap-2 p-6 text-sm text-slate-500 dark:text-slate-400">
                  <Loader2 size={16} className="animate-spin" />
                  جارٍ التحميل...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">لا توجد إشعارات حالياً</div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`mb-2 rounded-xl border px-3 py-2.5 ${
                      item.is_read
                        ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                        : 'border-blue-200 bg-blue-50/70 dark:border-blue-800/60 dark:bg-blue-900/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                        <p className="mt-1 break-words text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.message}</p>
                        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                          {new Date(item.created_at).toLocaleString('ar-EG')}
                        </p>
                        {item.link ? (
                          <Link
                            href={item.link}
                            onClick={() => {
                              void markOneRead(item.id);
                              setOpen(false);
                            }}
                            className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                          >
                            فتح
                          </Link>
                        ) : null}
                      </div>

                      {!item.is_read && (
                        <button
                          onClick={() => void markOneRead(item.id)}
                          className="shrink-0 rounded-md bg-blue-600 px-2 py-1 text-[10px] font-medium text-white"
                        >
                          تمت القراءة
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
