// اسم النسخة لتحديث التخزين عند الحاجة
const CACHE_NAME = 'rasd-v2026-cache';

// قائمة الملفات التي سيتم تخزينها لتعمل بدون إنترنت
const urlsToCache = [
  './',
  './index.html',
  './admin.html',
  './teacher.html',
  './manifest.json',
  './icon-180x180.png',
  './icon-192x192.png',
  './icon-512x512.png'
];

// مرحلة التثبيت: تخزين الملفات الأساسية
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('تم فتح التخزين المؤقت وتخزين الأيقونات والملفات');
        return cache.addAll(urlsToCache);
      })
  );
});

// مرحلة التفعيل: حذف النسخ القديمة من التخزين
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// جلب الملفات: استدعاء الملف من التخزين إذا لم يتوفر إنترنت
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وجد الملف في التخزين (Cache) نرجعه، وإلا نطلبه من الشبكة
        return response || fetch(event.request);
      })
  );
});
