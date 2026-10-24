// X serves HLS: a master .m3u8 lists every quality variant and the player picks one adaptively.
// We strip the master down to its highest-bandwidth variant so the player has nothing lower to fall back to.

function keepBest(text) {
  if (!text.includes('#EXT-X-STREAM-INF')) return text; // media playlist, not a master
  const lines = text.split('\n');
  let best = -1, bestBw = -1;
  lines.forEach((l, i) => {
    if (!l.startsWith('#EXT-X-STREAM-INF')) return;
    const bw = +(l.match(/[:,]BANDWIDTH=(\d+)/) || [])[1] || 0;
    if (bw > bestBw) { bestBw = bw; best = i; }
  });
  // drop every other STREAM-INF line plus the URI line that follows it
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('#EXT-X-STREAM-INF') && i !== best) { i++; continue; }
    out.push(lines[i]);
  }
  return out.join('\n');
}

if (typeof window !== 'undefined') {
  const isM3u8 = (url) => /\.m3u8(\?|$)/.test(String(url));

  // XHR (what hls.js uses by default)
  const xp = XMLHttpRequest.prototype;
  const open = xp.open;
  xp.open = function (method, url) { this._aqM3u8 = isM3u8(url); return open.apply(this, arguments); };
  for (const prop of ['responseText', 'response']) {
    const desc = Object.getOwnPropertyDescriptor(xp, prop);
    Object.defineProperty(xp, prop, {
      ...desc,
      get() {
        const v = desc.get.call(this);
        return this._aqM3u8 && typeof v === 'string' && this.readyState === 4 ? keepBest(v) : v;
      },
    });
  }

  // fetch
  const origFetch = window.fetch;
  window.fetch = async function (input) {
    const res = await origFetch.apply(this, arguments);
    if (!isM3u8(input instanceof Request ? input.url : input) || !res.ok) return res;
    const text = keepBest(await res.text());
    const copy = new Response(text, { status: res.status, statusText: res.statusText, headers: res.headers });
    Object.defineProperty(copy, 'url', { value: res.url }); // relative variant URIs resolve against this
    return copy;
  };
}

if (typeof module !== 'undefined') module.exports = { keepBest };
