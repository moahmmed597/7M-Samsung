// Interface sounds (Settings → Appearance, off by default): a soft tick when the focus moves and a
// short blip on OK. Made on the fly with Web Audio, so the app carries no sound files. Silent while a
// video, a book or an audiobook is open.
import * as store from './store.js';

let ctx = null;
function context() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
  } catch (e) {
    ctx = null;
  }
  return ctx;
}

function busy() {
  return !!document.querySelector('.view.player:not(.hidden), .view.reader:not(.hidden), .view.listen:not(.hidden)');
}

function beep(freq, ms, vol) {
  if (!store.settings().uiSounds || busy()) return;
  const c = context();
  if (!c) return;
  try {
    if (c.state === 'suspended' && c.resume) c.resume();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    const now = c.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(vol, now + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, now + ms / 1000);
    o.connect(g);
    g.connect(c.destination);
    o.start(now);
    o.stop(now + ms / 1000 + 0.02);
  } catch (e) {
    /* no sound, no harm */
  }
}

export const move = () => beep(880, 45, 0.05);
export const press = () => beep(1320, 70, 0.08);
