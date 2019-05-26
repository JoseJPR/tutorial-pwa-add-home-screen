self.addEventListener('install', function(event) {
  console.log('install', event);
});

self.addEventListener('message', function(event) {
  console.log('message', event);
});

self.addEventListener('fetch', function(event) {
  console.log('fetch', event);
});