# Stremio Kai 7M (Samsung Tizen Edition) 🎬⚡

<div align="center">
  <img src="src/static/largeIcon.png" alt="Stremio Kai 7M Logo" width="140" style="border-radius: 28px; box-shadow: 0 8px 24px rgba(0,0,0,0.5);" />
  <br/>
  <h3>The Ultimate Modern Stremio Experience Crafted for Samsung OLED / Tizen Smart TVs</h3>
  <p>
    <b>High Performance · True OLED Blacks · Embedded Subtitles · Franchise Sagas · Multi-Profile · Anime Universe</b>
  </p>

  [![Samsung Tizen](https://img.shields.io/badge/Samsung-Tizen_OS_4.0_--_8.0+-037bc8?style=for-the-badge&logo=samsung&logoColor=white)](https://www.samsung.com)
  [![Built For OLED](https://img.shields.io/badge/OLED-Burn--in_Protected-000000?style=for-the-badge&logo=target&logoColor=white)](https://github.com/moahmmed597/Stremio-Kai-7M)
  [![License](https://img.shields.io/badge/License-GPL--3.0-blue?style=for-the-badge)](LICENSE)
  [![Build](https://img.shields.io/badge/Build-Tizen_.wgt_Ready-success?style=for-the-badge&logo=checkmarx&logoColor=white)](https://github.com/moahmmed597/Stremio-Kai-7M)
</div>

---

## 🌟 Overview / نظرة عامة

**Stremio Kai 7M** is a heavily enhanced, standalone evolution of the open-source Stremio Tizen client (`kai`), meticulously re-engineered for Samsung Smart TVs (especially 2024 OLED S90D/S95D and high-refresh Tizen models).

It transforms the streaming experience on Samsung TVs with native hardware decoding, embedded MKV subtitle handling, 100% Arabic localization, multi-franchise timelines, OLED burn-in prevention, and zero-latency TV navigation.

> [!NOTE]
> This edition contains over **22,000+ lines of custom enhancements** across 69 files compared to upstream, including custom video renderers, memory optimizations, and comprehensive cloud integrations.

---

## 🚀 Key Features & Innovations / أبرز المزايا والابتكارات

### 📺 1. Native Samsung AVPlay Engine (Hardware Decoding)
* **Embedded Subtitles Decoding:** Native playback of subtitle tracks packed inside MKV and MP4 files (TEXT/UTF8, ASS/SSA) rendered directly on screen without needing an external PC transcoding server.
* **Smart Arabic Character Encoding:** Automatic CP1256 and UTF-8 encoding detection with ZIP stream decompression for SubDL and external subtitle providers.
* **Auto-Language Detection:** Intelligently resolves `Unknown / und` anime tracks by inspecting internal track labels (`extra_info.label`).
* **Multi-Audio Track Switching:** Seamlessly switch between multi-language audio streams, dubs, stereo, 5.1 surround, and Dolby Atmos passthrough.

### 🖤 2. Tailored for OLED Screens (Samsung OLED 2024 Care)
* **True OLED Screensaver:** `#000000` pitch-black sleep screen activates after 90 seconds of inactivity or pause to safeguard OLED panels from burn-in, featuring an ultra-dim floating clock.
* **13 High-Contrast OLED Themes:** Cyberpunk, Emerald, Amber, Royal Violet, Neon Fuchsia, Ruby Rose, Sky Blue, Netflix Red, Samsung Blue, Sunset Flame, and Charcoal Slate.
* **Memory & RAM Shield (14KB Thumbnails):** Ultra-light proxy image compression (wsrv.nl WebP caching) reducing poster sizes from 1.4MB down to ~14KB, keeping memory consumption within Samsung TV's strict 180MB budget.

### ⏱️ 3. Smart Pause Info & "Ends At" ETA
* **Real-time Finish Time (Ends At):** Displays the exact clock time a movie or episode will conclude if watched now (e.g., `⏱️ ينتهي في تمام 21:45`).
* **One-Click Trailer `[🎬 Trailer]`:** Instant official trailer playback directly in the app without launching external YouTube apps.
* **Smart Stream Badges:** Automatic tagging and highlighting for 4K UHD, HDR, Dolby Vision, REMUX, and Dolby Atmos audio sources.

### 🦸 4. Cinematic Franchise Sagas & Timelines
* **15+ Complete Universes:** MCU (Marvel Cinematic Universe), DC Universe, Batman Sagas, X-Men, Spider-Man, Fantastic Four, Blade, Star Wars, Harry Potter, Middle-earth, and more.
* **Chronological vs Release Order:** Switch viewing order between release date and chronological story continuity.
* **Saga Separation:** Clean separation between live-action movies and classic animated universes (e.g., X-Men Animated Series vs Fox/MCU Movies).
* **MCU Sub-Filters:** Instant filter chips for `[All (70)]`, `[Official MCU (52)]`, `[X-Men (14)]`, and `[Spider-Man (8)]`.
* **Active Sagas Row:** Resume watching your franchises directly from the Home screen.

### 🎎 5. Dedicated Anime Universe
* **UltraAnime Tab:** Built-in dedicated anime hub with seasonal catalogs, anime studios (MAPPA, Ufotable, Wit Studio, Toei), demographics, and genres.
* **Automated Intros/Outros Skip:** Integrated Anime-Skip and AniSkip client skipping opening and ending sequences automatically.

### 👨‍👩‍👧‍👦 6. Profiles & Family Security
* **Multi-User Profiles:** Independent Stremio accounts, watch histories, and settings per profile.
* **Startup Profile Picker:** "Who's Watching?" profile selection on TV boot with quick auto-login toggle.
* **PIN Lock (4–8 Digits):** Secure profiles with a remote-friendly PIN code.
* **Kids Profile (🧒):** Tailored profile badge and environment for children and family content.
* **IMDb Parental Guide:** Real-time content warning badges (violence, nudity, frightening scenes).

### 🌐 7. Cloud Tracking & Phone Remote Link
* **Out-of-the-Box Trakt & Simkl:** Built-in scrobbling and cloud library sync with pre-configured client credentials.
* **Instant QR Code Login:** Log in to Real-Debrid, TorBox, Trakt, and Jellyfin simply by scanning a QR code with your mobile phone camera.
* **Built-in Speedtest:** Direct TV internet speed & ping test powered by Cloudflare.
* **Multilingual UI:** Full support for Arabic (with native RTL layout), English, Spanish, French, Turkish, German, and Portuguese.

---

## 🛠️ Installation on Samsung Tizen TVs / طريقة التثبيت على شاشات سامسونج

### Method 1: TizenBrew / Device Manager (Recommended)
1. Turn on **Developer Mode** on your Samsung TV:
   * Go to **Smart Hub** -> **Apps**.
   * Press `1` `2` `3` `4` `5` on the remote.
   * Toggle **Developer Mode** to **ON** and enter your computer's local IP address.
   * Restart TV (hold power button on remote until Samsung logo appears).
2. Install via **TizenBrew** or package the `.wgt` directly:
   ```bash
   node tools/build-wgt.mjs
   tizen install -n Stremio7M.wgt -t <Your-TV-Device-Name>
   ```

### Method 2: Local Development & Build
```bash
# Clone the repository
git clone https://github.com/moahmmed597/7M-Samsung.git
cd 7M-Samsung

# Install dependencies
npm install

# Build the production bundle
npm run build

# Generate Tizen .wgt package
node tools/build-wgt.mjs
```

---

## 📊 Comparison with Original Upstream (kai)

| Feature | Upstream (`kai`) | Stremio 7M Samsung |
| :--- | :---: | :---: |
| **Samsung Tizen Native AVPlay** | Basic HTML5 | **Full Hardware AVPlay + Subtitle Decoding** |
| **Embedded MKV Subtitles** | ❌ (Required PC Server) | **✅ 100% Native on TV (ASS/SSA & SRT)** |
| **SubDL ZIP Subtitle Parsing** | ❌ (Failed on CP1256/ZIP) | **✅ Full Automatic Decoding** |
| **Arabic Subtitle Fonts** | System Default | **7 Custom High-Visibility Arabic Fonts** |
| **OLED Burn-in Protection** | ❌ None | **✅ 90s `#000000` True OLED Screen Saver** |
| **Franchise Sagas (MCU, DC, etc.)** | ❌ Flat list | **✅ 15+ Universes with Chrono Filters** |
| **Dedicated Anime Tab** | ❌ None | **✅ UltraAnime Hub + Auto-Skip Intros** |
| **Multi-Profile & PIN Lock** | ❌ Single User | **✅ Profiles + Kids Profile + PIN Lock** |
| **Smart Pause Info & "Ends At" ETA** | ❌ None | **✅ Real-Time Calculation** |
| **RAM Optimization** | Standard 1.4MB covers | **✅ WebP Caching (14KB, 90% RAM reduction)** |

---

## 🤝 Credits & Acknowledgements

* Original foundation by **ITzAkai** and contributors of the open-source `kai` project.
* Special thanks to the TizenBrew community, Stremio open-source developers, and contributors.
* **Stremio 7M Edition** created and maintained by **Mohammed** ([@moahmmed597](https://github.com/moahmmed597)).

---

## 📄 License
This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)** - see the [LICENSE](LICENSE) file for details.
