// Learn more: https://docs.expo.dev/router/reference/static-rendering/#root-html
import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';

/**
 * Content-Security-Policy for the web build, delivered as a <meta> tag since
 * a static Expo export has no server to set response headers from.
 *
 * - script-src has no 'unsafe-inline'/'unsafe-eval': the bundle ships as an
 *   external <script src>, so classic injected-<script> and inline-handler
 *   XSS payloads simply don't execute.
 * - style-src needs 'unsafe-inline': React Native Web styles elements via
 *   the DOM `style` attribute (that's how View/Text style props work) and
 *   Expo's own root reset ships as an inline <style> block. This is a
 *   deliberate, scoped trade-off, not an oversight — style-based
 *   injection can't run script.
 * - connect-src / img-src: 'self' only for now. Add your API origin(s) to
 *   connect-src here once the backend is wired up (never widen this to '*').
 *
 * Directives CSP ignores when set via <meta> (frame-ancestors, sandbox,
 * report-to) live in the header-based policy instead — see
 * public/_headers and vercel.json, which any static host that reads them
 * (Netlify, Vercel, Cloudflare Pages) applies automatically. Prefer serving
 * this same policy as a real `Content-Security-Policy` response header
 * wherever your hosting supports it; the header form can't be stripped by
 * DOM manipulation the way a <meta> tag theoretically could.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

export default function Root({ children }: { children: React.ReactNode }) {
  const { bodyAttributes, bodyNodes, htmlAttributes, headNodes } = useServerDocumentContext();

  return (
    <html lang="pt-BR" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Content-Security-Policy" content={CSP} />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#1f1f1f" />

        {/* Disable body scrolling on web so ScrollView behaves closer to native. */}
        <ScrollViewStyleReset />

        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
