<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The Opportunity experience is one client-only scroll page; chapters live in src/components/experience and share state via src/lib/store.ts, sound is procedural Web Audio in src/lib/audio.ts (no audio files, starts on first click due to browser autoplay rules).
