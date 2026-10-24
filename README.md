<p align="center"><img src="icons/icon128.png" width="96" alt="X Auto Quality icon"></p>

<h1 align="center">X Auto Quality</h1>

<p align="center">Chrome extension that forces every video on X (Twitter) to play in the highest available quality.</p>

## Why

X's player picks video quality adaptively and often starts — or stays — at a blurry low resolution. There's no quality menu to fix it.

## How it works

X streams video over HLS. Each video has a master `.m3u8` playlist listing every quality variant. This extension intercepts that playlist (both `XMLHttpRequest` and `fetch`) and removes every variant except the highest-bitrate one, so the player has nothing lower to fall back to.

- No permissions, no tracking, no network calls of its own
- Runs only on `x.com` / `twitter.com`
- ~50 lines of plain JavaScript, no dependencies

> **Note on compression:** X re-encodes uploads server-side, and no extension can undo that. Picking the highest-bitrate stream is the least-compressed version X actually serves.

## Install

1. Download `x-auto-quality.zip` from the [latest release](https://github.com/raulkolaric/x-auto-quality/releases/latest) and unzip it (or clone this repo).
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the folder.
4. Reload x.com.

Works in any Chromium browser (Chrome, Edge, Brave, Arc).

## Trade-off

On a slow connection the video will buffer instead of dropping to a lower quality.

## Project structure

```
manifest.json   extension manifest (MV3)
quality.js      playlist filter + XHR/fetch hooks
test.js         self-check: node test.js
icons/          icon source (SVG) and PNGs
```

## Development

```sh
node test.js   # prints "ok"
```

After editing, hit the reload button on the extension card in `chrome://extensions`.

## License

MIT
