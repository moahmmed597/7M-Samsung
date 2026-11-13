// Network test (like Nuvio's network diagnostics): latency and download speed against
// Cloudflare's public speed-test endpoints, which allow requests from any page.
const TRACE = 'https://cloudflare.com/cdn-cgi/trace';
const DOWN = 'https://speed.cloudflare.com/__down?bytes=';

function xhr(url, binary, timeout) {
  return new Promise((resolve, reject) => {
    const x = new XMLHttpRequest();
    x.open('GET', url + (url.indexOf('?') >= 0 ? '&' : '?') + '_=' + Date.now() + Math.random(), true);
    if (binary) x.responseType = 'arraybuffer';
    x.timeout = timeout;
    const t0 = Date.now();
    x.onload = () => (x.status >= 200 && x.status < 300 ? resolve({ ms: Date.now() - t0, bytes: binary && x.response ? x.response.byteLength : 0 }) : reject(new Error('HTTP ' + x.status)));
    x.onerror = () => reject(new Error('network'));
    x.ontimeout = () => reject(new Error('timeout'));
    x.send();
  });
}

// onStep(text) reports progress. Resolves to { pingMs, mbps }.
export function run(onStep) {
  const pings = [];
  const ping = () => xhr(TRACE, false, 5000).then((r) => pings.push(r.ms));
  onStep && onStep('ping');
  return ping()
    .then(ping)
    .then(ping)
    .then(() => {
      onStep && onStep('download');
      // A small warm-up, then a bigger file sized so slow lines still finish in time.
      return xhr(DOWN + 2000000, true, 20000);
    })
    .then((warm) => {
      const firstMbps = (warm.bytes * 8) / (warm.ms / 1000) / 1e6;
      const size = firstMbps > 40 ? 50000000 : firstMbps > 10 ? 20000000 : 5000000;
      return xhr(DOWN + size, true, 45000).then((r) => (r.bytes * 8) / (r.ms / 1000) / 1e6);
    })
    .then((mbps) => ({ pingMs: Math.min.apply(null, pings), mbps: Math.round(mbps * 10) / 10 }));
}
