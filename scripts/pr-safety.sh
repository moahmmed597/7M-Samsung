#!/usr/bin/env bash
# Safety gate for Stremio 7M. Looks only at lines ADDED between two commits and refuses a change that,
# without a written reason, would:
#   - add TV app privileges or widen the page's security policy (CSP)
#   - run outside programs (child_process, exec, spawn) or download-and-run (curl | sh)
#   - run code built from text (eval, new Function, importScripts)
#   - add npm install scripts
#   - put a key or token in the code (keys are entered on the TV, never committed)
#   - change these rules themselves
# A justified exception passes when a commit message (or the PR text) in the range contains
#   safety-ok: <the reason>
# Usage: scripts/pr-safety.sh <base-sha> [head-sha]      (PR_BODY env: the pull request text, optional)
set -u
BASE="${1:-}"
HEAD="${2:-HEAD}"
if [ -z "$BASE" ] || ! git cat-file -e "$BASE^{commit}" 2>/dev/null; then
  BASE="$(git rev-list --max-parents=0 "$HEAD" | tail -1)"
fi
TAB=$'\t'

# Added lines as "file<TAB>line" (generated files, the lock file and these rules are left out; comments skipped).
ADDED="$(git diff --unified=0 --no-color "$BASE" "$HEAD" -- . ':(exclude)dist/**' ':(exclude)latest.json' \
  ':(exclude)package-lock.json' ':(exclude)scripts/pr-safety.sh' ':(exclude).github/workflows/pr-safety.yml' |
  awk '/^\+\+\+ b\//{f=substr($0,7);next} /^\+\+\+ |^--- /{next}
       /^\+/{l=substr($0,2); t=l; sub(/^[ \t]+/,"",t); if (t ~ /^(\/\/|#|\*|\/\*)/) next; print f "\t" l}')"

findings=""
# rule <file regex> <line regex> <message>
rule() {
  local hits
  hits="$(printf '%s\n' "$ADDED" | grep -E "^($1)${TAB}" | cut -f2- | grep -E "$2" | head -5)"
  [ -n "$hits" ] && findings="${findings}- $3"$'\n'"$(printf '%s\n' "$hits" | cut -c1-160 | sed 's/^/      + /')"$'\n'
}
rule 'tools/build-wgt\.mjs|.*config\.xml' '(tizen:privilege|<access[[:space:]]+origin)' 'new TV privilege or network access rule'
rule '.*\.html' '(Content-Security-Policy|<script[^>]+src=.?https?:)' 'page security policy changed or a script loaded from the internet'
CODE='.*\.(js|mjs|cjs|ts|sh|bash|ps1|py|json|html|xml|yml|yaml)'
rule "$CODE" "(child_process|execSync\(|execFile\(|spawnSync\(|[^A-Za-z_.]spawn\()" 'runs outside programs'
rule "$CODE" '(curl|wget|iwr|Invoke-WebRequest)[^|]*\|[[:space:]]*(sh|bash|iex|powershell)' 'download-and-run command'
rule "$CODE" '((^|[^A-Za-z_.])eval\(|new Function\(|importScripts\()' 'runs code built from text'
rule 'package\.json' '"(pre|post)?install"[[:space:]]*:' 'npm install script'
rule '.*' '(ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{32,}|AIza[0-9A-Za-z_-]{35}|xox[baprs]-[A-Za-z0-9-]{20,})' 'looks like a real key or token'
rule '.*' "(api_?key|apikey|client_?secret|password|token)[\"']?[[:space:]]*[:=][[:space:]]*[\"'][A-Za-z0-9_-]{24,}[\"']" 'a key or secret written into the code'
for f in scripts/pr-safety.sh .github/workflows/pr-safety.yml; do
  if git cat-file -e "$BASE:$f" 2>/dev/null && ! git diff --quiet "$BASE" "$HEAD" -- "$f"; then
    findings="${findings}- $f: the safety rules were changed"$'\n'
  fi
done

if [ -z "$findings" ]; then
  echo "pr-safety: OK ($BASE..$HEAD)"
  exit 0
fi
echo "pr-safety: findings in $BASE..$HEAD"
printf '%s' "$findings"
REASONS="$(git log --format=%B "$BASE..$HEAD" 2>/dev/null; printf '%s' "${PR_BODY:-}")"
if printf '%s' "$REASONS" | grep -qiE 'safety-ok:[[:space:]]*[^[:space:]]{4,}'; then
  echo "pr-safety: allowed by a written reason:"
  printf '%s\n' "$REASONS" | grep -iE 'safety-ok:' | sed 's/^/    /'
  exit 0
fi
echo "pr-safety: REFUSED. If it is intended, add 'safety-ok: <why it is needed>' to the commit message or the PR text."
exit 1
