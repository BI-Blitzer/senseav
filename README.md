# senseav – Qlik Sense Audio/Video Extension

A Qlik Sense visualization extension that embeds a **Video.js** media player directly on your sheet. Supports audio and video files via URL, with an optional blurred background image for the audio player.

---

## Features

- **Video playback** – MP4, WebM, OGV, AVI, MOV, MKV and more
- **Audio playback** – MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA
- **Background image for audio** – add a second dimension with an image URL; it renders as a blurred, full-area backdrop behind the audio controls
- **Auto media-type detection** from the file extension, with a manual override in the property panel
- **Playback controls**: Autoplay, Loop, Start Muted, Show/Hide Controls
- Compatible with **Qlik Sense SaaS** and **Qlik Sense Enterprise on Windows (QSEoW)**

---

## Dimensions

| # | Required | Description |
|---|---|---|
| 1 | Yes | **Media URL** – network path to an audio or video file (e.g. `https://example.com/clip.mp4`) |
| 2 | No | **Background Image URL** – displayed as a blurred backdrop in audio mode (e.g. `https://example.com/artwork.jpg`) |

---

## Property Panel Options

| Property | Default | Description |
|---|---|---|
| Media Type | Auto-detect | Force Audio or Video mode, or let the extension detect from the file extension |
| Autoplay | Off | Start playback automatically when the sheet loads |
| Loop | Off | Restart playback when the media ends |
| Start Muted | Off | Begin playback with audio muted |
| Show Controls | On | Show or hide the Video.js control bar |

---

## Development

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install dependencies

```bash
npm install
```

### Local development server

```bash
npm run serve
```

Starts the nebula.js dev server. Open the printed URL and connect it to a Qlik Sense app for live development.

### Build (ESM module, for mashup/embedding use)

```bash
npm run build
# Output: dist/
```

### Build for Qlik Sense deployment

```bash
npm run sense
# Output: senseav-ext/  (contains senseav.qext + senseav.js)
```

Zip the `senseav-ext/` folder and upload it via:
- **Qlik Sense SaaS**: Management Console → Extensions → Import
- **QSEoW**: QMC → Extensions → Import

---

## Supported Media Formats

| Type | Extensions |
|---|---|
| Audio | mp3, wav, ogg, flac, aac, m4a, opus, wma |
| Video | mp4, webm, ogv, avi, mov, mkv, m4v, wmv |
| Streaming | HLS (`.m3u8`) via Video.js HTTP Streaming plugin (bundled) |

Formats not in the list default to video mode. Use the **Media Type** property override if auto-detection is incorrect.

---

## License

MIT
