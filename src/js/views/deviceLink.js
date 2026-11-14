// Sign-in by QR for services with a device flow (TorBox, Real-Debrid, Jellyfin Quick Connect):
// the TV shows a QR (with the code already in it) and a short code; the user approves on the phone.
// flow = { name, hint, start(): Promise<{ code, url, qrUrl, interval, expiresIn, poll(): Promise<status> }> }
// where status is 'pending' | 'ok' | 'expired' | 'denied' | an error message.
import { h } from '../lib/dom.js';
import * as phone from '../lib/phone.js';
import { toast } from '../ui.js';
import * as router from '../router.js';
import { t } from '../lib/i18n.js';

export function openDeviceLink(flow, onDone) {
  router.push(DeviceLinkView(flow, onDone));
}

function DeviceLinkView(flow, onDone) {
  const el = h('div.view');
  const codeEl = h('div.code', { text: '····' });
  const qr = h('img.qr.qr-big', { alt: '' });
  const urlEl = h('p');
  const status = h('p', { text: t('Gerando código...') });
  el.appendChild(
    h('div.login', null,
      h('div.login-card', null, [
        h('div.login-col', null, [
          h('h1', { text: t('Conectar {name}', { name: flow.name }) }),
          urlEl,
          codeEl,
          status,
          h('div', { 'data-group': '' }, [h('div.btn', { focusable: true, text: t('Cancelar'), onSelect: () => router.pop() })]),
        ]),
        h('div.login-col', null, [qr]),
      ])
    )
  );

  let alive = true;
  let timer = null;
  flow
    .start()
    .then((s) => {
      if (!alive) return;
      codeEl.textContent = s.code || '';
      urlEl.appendChild(h('b', { text: flow.hint || t('Aponte a câmera do celular para o QR, entre na sua conta e pronto: conecta sozinho.') }));
      urlEl.appendChild(h('br'));
      urlEl.appendChild(document.createTextNode(t('Ou abra') + ' '));
      urlEl.appendChild(h('b', { text: String(s.url || '').replace(/^https?:\/\//, '') }));
      if (s.code) urlEl.appendChild(document.createTextNode(' ' + t('e digite o código:')));
      qr.src = phone.qrImage(s.qrUrl || s.url, 360);
      status.textContent = t('Aguardando confirmação...');
      const until = Date.now() + (s.expiresIn || 600) * 1000;
      const tick = () => {
        if (!alive) return;
        if (Date.now() > until) {
          status.textContent = t('Código expirou. Abra de novo.');
          return;
        }
        s.poll()
          .then((r) => {
            if (!alive) return;
            if (r === 'ok') {
              toast(t('{name} conectado', { name: flow.name }), 4000);
              router.pop();
              if (onDone) onDone();
              return;
            }
            if (r === 'expired') return (status.textContent = t('Código expirou. Abra de novo.'));
            if (r === 'denied') return (status.textContent = t('Acesso negado no site.'));
            if (r !== 'pending') status.textContent = t('Falhou: {msg}', { msg: r });
            timer = setTimeout(tick, Math.max(3, s.interval || 5) * 1000);
          })
          .catch(() => alive && (timer = setTimeout(tick, Math.max(3, s.interval || 5) * 1000)));
      };
      timer = setTimeout(tick, Math.max(3, s.interval || 5) * 1000);
    })
    .catch((e) => alive && (status.textContent = t('Falhou: {msg}', { msg: e.message })));

  return {
    el: el,
    destroy: () => {
      alive = false;
      clearTimeout(timer);
    },
  };
}
