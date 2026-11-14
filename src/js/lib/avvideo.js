// Samsung AVPlay behind the small part of the HTMLVideoElement API the player uses.
//
// Why: on Samsung TVs the browser's <video> plays only the file's default audio track.
// audioTracks[i].enabled is ignored, and webOS's Luna selectTrack doesn't exist, so picking
// another language in the Audio menu changed nothing. The official Stremio app on Tizen plays
// through AVPlay (webapis.avplay) and switches with setSelectTrack('AUDIO', index); this does
// the same while the rest of player.js keeps talking to something shaped like a <video>.
//
// Times: AVPlay works in milliseconds, this object in seconds (like <video>).
import { h } from './dom.js';
import { log } from './log.js';

export function available() {
  try {
    return !!(window.webapis && window.webapis.avplay && typeof window.webapis.avplay.open === 'function');
  } catch (e) {
    return false;
  }
}

export function create() {
  const AV = window.webapis.avplay;
  const node = h('object', { type: 'application/avplayer' });
  node.className = 'av-video';
  const listeners = {};
  let src = '';
  let opened = false;
  let prepared = false;
  let state = 'NONE';
  let wantPlay = false;
  let curMs = 0;
  let durMs = NaN;
  let ended = false;
  let buffering = false;
  let error = null;
  let pendingSeekMs = null;
  let pendingAudio = null; // Tizen 3 refuses setSelectTrack while paused: applied on play
  let pendingText = null; // same for an embedded subtitle track
  let textOn = false; // an embedded subtitle track is wanted: its text is passed to onSubtitle
  let subCb = null;
  let lastTimeEmit = 0;
  let generation = 0;

  function emit(type) {
    const list = (listeners[type] || []).slice();
    for (let i = 0; i < list.length; i++) {
      try {
        list[i].call(api, { type: type, target: api });
      } catch (e) {
        log.warn('avplay listener', type, e && e.message);
      }
    }
  }

  function readState() {
    try {
      state = AV.getState();
    } catch (e) {
      /* keep last */
    }
    return state;
  }

  function stopAndClose() {
    if (!opened) return;
    try {
      AV.stop();
    } catch (e) {
      /* ignore */
    }
    try {
      AV.close();
    } catch (e) {
      /* ignore */
    }
    opened = false;
    prepared = false;
    state = 'NONE';
  }

  function setListener(gen) {
    const ok = () => gen === generation;
    AV.setListener({
      onbufferingstart: () => {
        if (!ok()) return;
        buffering = true;
        emit('waiting');
      },
      onbufferingprogress: () => {},
      onbufferingcomplete: () => {
        if (!ok()) return;
        buffering = false;
        emit('canplay');
        if (readState() === 'PLAYING') emit('playing');
      },
      oncurrentplaytime: (ms) => {
        if (!ok()) return;
        if (typeof ms === 'number' && isFinite(ms)) curMs = ms;
        const now = Date.now();
        if (now - lastTimeEmit >= 240) {
          lastTimeEmit = now;
          emit('timeupdate');
        }
      },
      onstreamcompleted: () => {
        if (!ok()) return;
        ended = true;
        try {
          AV.pause();
        } catch (e) {
          /* ignore */
        }
        readState();
        emit('pause');
        emit('ended');
      },
      onerror: (type) => {
        if (!ok()) return;
        fail(String(type || 'PLAYER_ERROR'));
      },
      onevent: () => {},
      // Embedded subtitles: the player parses them (SRT, ASS...) and hands over the text to show.
      onsubtitlechange: (p1, p2, p3, p4) => {
        if (!ok() || !textOn || !subCb) return;
        try {
          let text = '';
          let dur = 0;
          if (typeof p1 === 'object' && p1 !== null) {
            text = p1.text || p1.data || p1.subtitle || '';
            dur = Number(p1.duration) || 0;
          } else if (typeof p1 === 'string' && (p2 === undefined || typeof p2 !== 'string')) {
            text = p1;
            dur = Number(p2) || 0;
          } else if (typeof p2 === 'string') {
            text = p2;
            dur = Number(p1) || 0;
          } else if (typeof p1 === 'string') {
            text = p1;
            dur = Number(p2) || 0;
          }
          subCb({ text: String(text || ''), duration: dur });
        } catch (e) {
          log.warn('avplay subtitle', e && e.message);
        }
      },
      ondrmevent: () => {},
    });
  }

  function fail(msg) {
    log.warn('avplay error', msg);
    error = { code: 4, message: msg };
    emit('error');
  }

  function open(url) {
    generation++;
    const gen = generation;
    stopAndClose();
    src = url;
    ended = false;
    error = null;
    curMs = 0;
    durMs = NaN;
    pendingSeekMs = null;
    pendingAudio = null;
    pendingText = null;
    textOn = false;
    wantPlay = !!api.autoplay;
    if (!url) {
      emit('emptied');
      return;
    }
    try {
      AV.open(url);
      opened = true;
      setListener(gen);
      AV.setDisplayRect(0, 0, 1920, 1080);
      try {
        AV.setDisplayMethod('PLAYER_DISPLAY_MODE_LETTER_BOX');
      } catch (e) {
        /* older firmware */
      }
    } catch (e) {
      setTimeout(() => gen === generation && fail('open: ' + (e && e.message)), 0);
      return;
    }
    emit('loadstart');
    buffering = true;
    emit('waiting');
    AV.prepareAsync(
      () => {
        if (gen !== generation) return;
        prepared = true;
        readState();
        try {
          durMs = AV.getDuration();
        } catch (e) {
          durMs = NaN;
        }
        // The player seeks to the resume point inside loadedmetadata; that lands in pendingSeekMs.
        emit('loadedmetadata');
        emit('loadeddata');
        buffering = false;
        emit('canplay');
        if (wantPlay) startPlayback();
      },
      (err) => {
        if (gen !== generation) return;
        fail('prepare: ' + (err && (err.name || err.message) ? err.name || err.message : err));
      }
    );
  }

  function startPlayback() {
    if (!prepared) return;
    const go = () => {
      try {
        AV.play();
      } catch (e) {
        fail('play: ' + (e && e.message));
        return;
      }
      readState();
      emit('play');
      emit('playing');
      if (pendingAudio !== null) {
        const idx = pendingAudio;
        pendingAudio = null;
        setTimeout(() => applyAudio(idx), 300);
      }
      if (pendingText !== null) {
        const ti = pendingText;
        pendingText = null;
        setTimeout(() => applyText(ti), 500);
      }
    };
    if (pendingSeekMs !== null) {
      const ms = pendingSeekMs;
      pendingSeekMs = null;
      doSeek(ms, go);
    } else go();
  }

  function doSeek(ms, then) {
    emit('seeking');
    const done = () => {
      curMs = ms;
      emit('seeked');
      emit('timeupdate');
      if (then) then();
    };
    try {
      AV.seekTo(Math.max(0, Math.floor(ms)), done, (e) => {
        log.warn('avplay seek', e && e.name);
        emit('seeked');
        if (then) then();
      });
    } catch (e) {
      log.warn('avplay seek threw', e && e.message);
      emit('seeked');
      if (then) then();
    }
  }

  // ---------- Tracks ----------
  function parseExtra(info) {
    if (!info) return {};
    if (typeof info === 'object') return info;
    if (typeof info === 'string') {
      try {
        return JSON.parse(info);
      } catch (e) {
        const res = {};
        info.replace(/([^,=;]+)=([^,;]+)/g, (_, k, v) => {
          res[k.trim()] = v.trim().replace(/^['"]|['"]$/g, '');
        });
        return res;
      }
    }
    return {};
  }

  function trackInfo(type) {
    let all = [];
    try {
      all = AV.getTotalTrackInfo() || [];
    } catch (e) {
      return [];
    }
    const out = [];
    for (let i = 0; i < all.length; i++) {
      if (all[i].type !== type) continue;
      const extra = parseExtra(all[i].extra_info);
      const rawLang = extra.language || extra.track_lang || extra.lang || extra.Language || all[i].language || all[i].lang || '';
      const rawLabel = extra.track_name || extra.track_title || extra.title || extra.name || extra.label || extra.track_label || extra.description || extra.track_description || all[i].track_name || all[i].name || '';
      const rawCodec = extra.fourCC || extra.codec || extra.sub_type || extra.subtitle_type || extra.track_type || all[i].codec || '';
      out.push({
        index: all[i].index,
        language: String(rawLang).trim(),
        label: String(rawLabel).trim(),
        channels: extra.channels ? Number(extra.channels) : 0,
        codec: String(rawCodec).trim(),
      });
    }
    return out;
  }

  function currentIndex(type) {
    try {
      const cur = AV.getCurrentStreamInfo() || [];
      for (let i = 0; i < cur.length; i++) if (cur[i].type === type) return cur[i].index;
    } catch (e) {
      /* ignore */
    }
    return null;
  }

  function applyAudio(avIndex) {
    try {
      AV.setSelectTrack('AUDIO', avIndex);
      log.info('avplay audio ->', avIndex);
      // Many Samsung firmwares keep playing the old track's buffered audio until the stream is
      // re-read: a small seek back flushes it so the new language is heard right away.
      if (readState() === 'PLAYING') {
        const back = Math.max(0, curMs - 800);
        setTimeout(() => {
          if (readState() === 'PLAYING') doSeek(back);
        }, 250);
      }
      return true;
    } catch (e) {
      log.warn('avplay setSelectTrack', e && (e.name || e.message));
      return false;
    }
  }

  // Silent = the player does not draw the subtitle itself; the app draws it in its own style.
  function applyText(avIndex) {
    try {
      try {
        AV.setSilentSubtitle(true);
      } catch (err) {
        log.warn('avplay setSilentSubtitle failed', err);
      }
      AV.setSelectTrack('TEXT', avIndex);
      log.info('avplay text ->', avIndex);
      if (readState() === 'PLAYING') {
        const back = Math.max(0, curMs - 400);
        setTimeout(() => {
          if (readState() === 'PLAYING') doSeek(back);
        }, 150);
      }
      return true;
    } catch (e) {
      log.warn('avplay text track', e && (e.name || e.message));
      return false;
    }
  }

  const api = {
    node: node,
    isAVPlay: true,
    mediaId: '',
    preload: 'auto',
    autoplay: false,
    addEventListener(type, fn) {
      (listeners[type] = listeners[type] || []).push(fn);
    },
    removeEventListener(type, fn) {
      const l = listeners[type];
      if (l) listeners[type] = l.filter((x) => x !== fn);
    },
    play() {
      wantPlay = true;
      if (!prepared) return Promise.resolve();
      if (ended) {
        ended = false;
        pendingSeekMs = 0;
      }
      if (readState() === 'PAUSED') {
        try {
          AV.play();
        } catch (e) {
          /* ignore */
        }
        readState();
        emit('play');
        emit('playing');
        if (pendingAudio !== null) {
          const idx = pendingAudio;
          pendingAudio = null;
          setTimeout(() => applyAudio(idx), 300);
        }
        if (pendingText !== null) {
          const ti = pendingText;
          pendingText = null;
          setTimeout(() => applyText(ti), 500);
        }
      } else if (state === 'READY') startPlayback();
      return Promise.resolve();
    },
    pause() {
      wantPlay = false;
      if (readState() === 'PLAYING') {
        try {
          AV.pause();
        } catch (e) {
          /* ignore */
        }
        readState();
        emit('pause');
      }
    },
    load() {
      // <video>.load() after src= restarts loading; AVPlay already opened in the src setter.
      if (!src) stopAndClose();
    },
    removeAttribute(name) {
      if (name === 'src') {
        wantPlay = false;
        generation++;
        stopAndClose();
        src = '';
      }
    },
    // Audio: list in file order, the playing one marked.
    audioTrackList() {
      const list = trackInfo('AUDIO');
      const cur = pendingAudio !== null ? pendingAudio : currentIndex('AUDIO');
      return list.map((tr, i) => ({ language: tr.language, label: '', channels: tr.channels, codec: tr.codec, enabled: cur === null ? i === 0 : tr.index === cur }));
    },
    // position = place in audioTrackList()
    selectAudio(position) {
      const list = trackInfo('AUDIO');
      const tr = list[position];
      if (!tr) return false;
      if (readState() !== 'PLAYING') {
        pendingAudio = tr.index;
        return true;
      }
      return applyAudio(tr.index);
    },
    // Embedded subtitle tracks, in file order.
    textTrackList() {
      return trackInfo('TEXT').map((tr) => ({
        language: tr.language,
        label: tr.label,
        codec: tr.codec,
        index: tr.index,
      }));
    },
    // position = place in textTrackList()
    selectText(position) {
      const tr = trackInfo('TEXT')[position];
      if (!tr) return false;
      textOn = true;
      if (readState() !== 'PLAYING') {
        pendingText = tr.index;
        return true;
      }
      return applyText(tr.index);
    },
    disableText() {
      textOn = false;
      pendingText = null;
    },
    onSubtitle(fn) {
      subCb = fn;
    },
    destroy() {
      wantPlay = false;
      generation++;
      stopAndClose();
      Object.keys(listeners).forEach((k) => delete listeners[k]);
    },
  };

  Object.defineProperty(api, 'src', {
    get: () => src,
    set: (v) => open(String(v || '')),
  });
  Object.defineProperty(api, 'currentSrc', { get: () => src });
  Object.defineProperty(api, 'currentTime', {
    get: () => curMs / 1000,
    set: (sec) => {
      const ms = Math.max(0, Number(sec) * 1000 || 0);
      ended = false;
      const st = readState();
      if (!prepared || st === 'READY') {
        pendingSeekMs = ms;
        curMs = ms;
        return;
      }
      curMs = ms;
      doSeek(ms);
    },
  });
  Object.defineProperty(api, 'duration', {
    get: () => (durMs > 0 ? durMs / 1000 : NaN),
  });
  Object.defineProperty(api, 'paused', {
    get: () => readState() !== 'PLAYING',
  });
  Object.defineProperty(api, 'ended', { get: () => ended });
  Object.defineProperty(api, 'error', { get: () => error });
  Object.defineProperty(api, 'readyState', { get: () => (prepared ? (buffering ? 2 : 4) : 0) });
  Object.defineProperty(api, 'networkState', { get: () => (opened ? 2 : 0) });
  Object.defineProperty(api, 'buffered', {
    // AVPlay doesn't report buffered ranges; the seek bar just shows no buffer line.
    get: () => ({ length: 0, start: () => 0, end: () => 0 }),
  });
  Object.defineProperty(api, 'audioTracks', { get: () => null });
  return api;
}
