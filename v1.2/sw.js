// PokeCom 서비스워커: 앱 파일 프리캐시 + 폰트 캐시 (스프라이트는 IndexedDB)
const C = 'pokecom-muhpgbw3';
const CORE = ["./","index.html","manifest.webmanifest","icon.svg","icon-192.png","icon-180.png","index-SbBXkmYW.js","jszip.min-Ci3q0YSJ.js","index-C3hbFClD.css"];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
	e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C && k.startsWith('pokecom-') && !k.endsWith('-fonts')).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
	const u = new URL(e.request.url);
	if (e.request.method !== 'GET') return;
	if (u.origin === location.origin) {
		e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(res => {
			if (res.ok) { const cl = res.clone(); caches.open(C).then(c => c.put(e.request, cl)); }
			return res;
		})));
	} else if (u.hostname.endsWith('googleapis.com') || u.hostname.endsWith('gstatic.com')) {
		e.respondWith(caches.open('pokecom-fonts').then(c => c.match(e.request).then(r => r || fetch(e.request).then(res => { c.put(e.request, res.clone()); return res; }))));
	}
});
