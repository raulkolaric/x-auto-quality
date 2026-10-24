// run: node test.js
const assert = require('assert');
const { keepBest } = require('./quality.js');

const master = `#EXTM3U
#EXT-X-INDEPENDENT-SEGMENTS
#EXT-X-MEDIA:NAME="Audio",TYPE=AUDIO,GROUP-ID="audio-128000",AUTOSELECT=YES,URI="/a/128.m3u8"
#EXT-X-STREAM-INF:AVERAGE-BANDWIDTH=200000,BANDWIDTH=256000,RESOLUTION=480x270,AUDIO="audio-128000"
/v/480x270.m3u8
#EXT-X-STREAM-INF:AVERAGE-BANDWIDTH=2000000,BANDWIDTH=2176000,RESOLUTION=1280x720,AUDIO="audio-128000"
/v/1280x720.m3u8
#EXT-X-STREAM-INF:AVERAGE-BANDWIDTH=900000,BANDWIDTH=950000,RESOLUTION=640x360,AUDIO="audio-128000"
/v/640x360.m3u8`;

const out = keepBest(master);
assert(out.includes('/v/1280x720.m3u8'));
assert(!out.includes('480x270') && !out.includes('640x360'));
assert(out.includes('URI="/a/128.m3u8"')); // audio kept
assert.strictEqual((out.match(/STREAM-INF/g) || []).length, 1);

const media = '#EXTM3U\n#EXTINF:3.0,\nseg1.m4s';
assert.strictEqual(keepBest(media), media);
console.log('ok');
