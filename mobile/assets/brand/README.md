# aura-fit brand assets

Source of truth for the wordmark and app-icon mark, ported from the UI kit
artifact's "Marca" section. Palette: `#b1111b` (primary), `#b0b0b0` (gray),
`#1f1f1f` (dark), `#f5f5f5` (light). Typeface: Inter, weight 700.

- `wordmark-on-*.svg` — the full "aura-fit" lockup for dark/red/light
  backgrounds. In the app, use `src/components/brand/Logo.tsx` instead of
  these files — it renders live text with the loaded Inter font rather than
  a static image, so it scales without a raster/vector asset per size.
- `icon-tile-*.svg` — the square app-icon mark at the kit's four reference
  sizes (72/56/40/24px, corner radius = 25% of the side). In the app, use
  `src/components/brand/LogoMark.tsx`.
- `*-source.svg` — 1024×1024 masters used to render the files under
  `assets/` that `app.json` points at (`icon.png`, `splash-icon.png`, the
  three `android-icon-*.png`, `favicon.png`).

## Regenerating the raster assets

The SVGs use `font-family="Inter"`, so rendering them accurately needs the
real Inter files (bundled in `@expo-google-fonts/inter`) registered with the
system font cache — otherwise the renderer falls back to a generic sans and
the wordmark looks off.

```sh
mkdir -p ~/.local/share/fonts
cp node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf ~/.local/share/fonts/
fc-cache -f ~/.local/share/fonts

npm install --no-save sharp   # not a project dependency, install just for this
node scripts/generate-brand-raster.js
npm uninstall sharp
```
