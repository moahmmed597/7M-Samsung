// Writes apps.json: the SideStore / AltStore "source" of this app (same idea as Aidoku's).
// Usage: node tools/make-altstore.mjs <tag> <version> <ipaSizeBytes>
import fs from 'node:fs';
const [tag = 'app-v1.0.0', version = '1.0.0', size = '1703018'] = process.argv.slice(2);
const repo = 'moahmmed597/Stremio-Kai-7M';
const raw = 'https://raw.githubusercontent.com/' + repo + '/main/';
const src = {
  name: 'Stremio Kai 7M Source',
  identifier: 'com.kai.stremio7m.source',
  sourceURL: raw + 'apps.json',
  subtitle: 'Stremio Kai 7M for iPhone and iPad',
  description: 'AltStore / SideStore source of Stremio Kai 7M. The app contains no content: streams come from your own Stremio add-ons, manga from your own server, live TV from your own playlists.',
  website: 'https://github.com/' + repo,
  iconURL: raw + 'src/static/largeIcon.png',
  tintColor: '7b5bf5',
  featuredApps: ['com.kai.stremio7m'],
  apps: [
    {
      name: 'Stremio Kai 7M',
      bundleIdentifier: 'com.kai.stremio7m',
      developerName: 'moahmmed597',
      subtitle: 'Stremio client: movies, anime, manga, books, live TV',
      localizedDescription: 'A modern Stremio client with anime, manga reader, comics, books and live TV (your own playlists). English, Arabic and Portuguese.',
      iconURL: raw + 'src/static/largeIcon.png',
      tintColor: '7b5bf5',
      category: 'entertainment',
      screenshots: [],
      version: version,
      versionDate: new Date().toISOString().slice(0, 10),
      downloadURL: 'https://github.com/' + repo + '/releases/download/' + tag + '/Stremio-Kai-7M-ios-unsigned.ipa',
      size: Number(size),
      versions: [
        {
          version: version,
          date: new Date().toISOString().slice(0, 10),
          localizedDescription: 'Release ' + tag,
          downloadURL: 'https://github.com/' + repo + '/releases/download/' + tag + '/Stremio-Kai-7M-ios-unsigned.ipa',
          size: Number(size),
        },
      ],
      appPermissions: { entitlements: [], privacy: { NSLocalNetworkUsageDescription: 'Reach your own servers (Suwayomi, Stremio server) on your network.' } },
    },
  ],
  news: [],
};
fs.writeFileSync('apps.json', JSON.stringify(src, null, 2) + '\n');
console.log('apps.json', tag, version, size);
