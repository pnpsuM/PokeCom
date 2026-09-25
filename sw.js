const C='pokecom-m1-v1';
const CORE=['./','index.html','manifest.webmanifest','icon.svg','icon-192.png','assets/index-CEpc4yJ2.js','assets/jszip.min-DyJiNn0C.js','assets/streams-D8zS4w6j.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k.startsWith('pokecom-')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET')return;
 if(u.origin===location.origin){e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{if(res.ok){const cl=res.clone();caches.open(C).then(c=>c.put(e.request,cl))}return res})));}
 else if(u.hostname.endsWith('googleapis.com')||u.hostname.endsWith('gstatic.com')){e.respondWith(caches.open(C+'-fonts').then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(res=>{c.put(e.request,res.clone());return res}))));}
});
