// Connect Trakt or Simkl: a code on the TV, entered on the phone (QR) or PC.
import { h } from '../lib/dom.js';
import * as tracker from '../api/tracker.js';
import * as phone from '../lib/phone.js';
import { toast } from '../ui.js';
import * as router from '../router.js';
import { t } from '../lib/i18n.js';

const NAMES = { trakt: 'Trakt', simkl: 'Simkl' };

export function openTrackLink(provider, onDone) {
  router.push(TrackLinkView(provider, onDone));
}

function TrackLinkView(provider, onDone) {
  const name = NAMES[provider];
  const el = h('div.view');
  const codeEl = h('div.code', { text: '····' });
  const qr = h('img.qr', { alt: '' });
  const urlEl = h('p');
  const status = h('p', { text: t('Gerando código...') });
  el.appendChild(
    h('div.login', null,
      h('div.login-card', null, [
        h('div.login-col', null, [
          h('h1', { text: t('Conectar {name}', { name: name }) }),
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
  const link = tracker.startLink(
    provider,
    (user) => {
      if (!alive) return;
      toast(user ? t('{name} conectado: {user}', { name: name, user: user }) : t('{name} conectado', { name: name }), 4000);
      router.pop();
      if (onDone) onDone();
    },
    (why) => {
      if (!alive) return;
      status.textContent = why === 'expired' ? t('Código expirou. Abra de novo.') : why === 'denied' ? t('Acesso negado no site.') : t('Falhou: {msg}', { msg: why });
    }
  );
  link.ready
    .then(() => {
      if (!alive) return;
      codeEl.textContent = link.code;
      urlEl.innerHTML = '';
      urlEl.appendChild(document.createTextNode(t('No celular ou PC, abra') + ' '));
      urlEl.appendChild(h('b', { text: link.url.replace(/^https?:\/\//, '') }));
      urlEl.appendChild(document.createTextNode(' ' + t('e digite o código:')));
      qr.src = phone.qrImage(link.url, 260);
      status.textContent = t('Aguardando confirmação...');
    })
    .catch(() => {});

  return {
    el: el,
    destroy: () => {
      alive = false;
      link.cancel();
    },
  };
}
